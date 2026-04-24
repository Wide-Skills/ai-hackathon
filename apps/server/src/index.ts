import { randomUUID } from "node:crypto";
import "reflect-metadata";
import { createContext as createTrpcContext } from "@ai-hackathon/api/context";
import { appRouter } from "@ai-hackathon/api/routers/index";
import { auth } from "@ai-hackathon/auth";
import { env } from "@ai-hackathon/env/server";
import { NestFactory } from "@nestjs/core";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { toNodeHandler } from "better-auth/node";
import pinoHttp from "pino-http";

import { AppModule } from "./app.module";
import logger from "./lib/logger";

async function bootstrap() {
  logger.info(`Starting server in ${env.NODE_ENV} mode`);
  logger.info(`BETTER_AUTH_URL: ${env.BETTER_AUTH_URL}`);
  logger.info(`CORS_ORIGIN: ${env.CORS_ORIGIN}`);
  logger.info(`Google Client ID present: ${!!env.GOOGLE_CLIENT_ID}`);

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  const expressApp = app.getHttpAdapter().getInstance();
  const authHandler = toNodeHandler(auth);

  expressApp.use(
    pinoHttp({
      logger,
      genReqId(req, res) {
        const requestId =
          (req.headers["x-request-id"] as string | undefined) ?? randomUUID();

        res.setHeader("x-request-id", requestId);
        return requestId;
      },
      customProps(req) {
        return {
          route: req.url,
        };
      },
      customLogLevel(_req, res, error) {
        if (error || res.statusCode >= 500) {
          return "error";
        }
        if (res.statusCode >= 400) {
          return "warn";
        }
        return "info";
      },
      customSuccessMessage(req, res) {
        return `${req.method} ${req.url} completed with ${res.statusCode}`;
      },
      customErrorMessage(req, res, error) {
        return `${req.method} ${req.url} failed with ${res.statusCode}: ${error.message}`;
      },
    }),
  );

  expressApp.all(/\/api\/auth\/.*/, async (req: any, res: any) => {
    logger.info(`Auth request: ${req.method} ${req.url}`);
    try {
      return await authHandler(req, res);
    } catch (error: any) {
      logger.error(`Auth handler error: ${error.message}`, {
        stack: error.stack,
        url: req.url,
        method: req.method,
      });
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  });

  expressApp.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: ({ req }) => createTrpcContext({ req }),
    }),
  );

  await app.listen(3000);
  logger.info("Server is running on http://localhost:3000");
}

bootstrap();
