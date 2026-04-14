import "reflect-metadata";
import { openApiDocument } from "@ai-hackathon/api";
import { createContext } from "@ai-hackathon/api/context";
import { appRouter } from "@ai-hackathon/api/routers/index";
import { auth } from "@ai-hackathon/auth";
import { env } from "@ai-hackathon/env/server";
import { NestFactory } from "@nestjs/core";
import swaggerUi from "swagger-ui-express";
import { createOpenApiExpressMiddleware } from "trpc-openapi";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.all("/api/auth/*path", async (req: any, _res: any) => {
    return auth.handler(req);
  });

  expressApp.use(
    "/api",
    createOpenApiExpressMiddleware({
      router: appRouter,
      createContext,
      responseMeta: () => ({}),
      onError: () => undefined,
      maxBodySize: 1024 * 1024,
    }),
  );

  expressApp.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument),
  );

  await app.listen(3000);
  console.log("Server is running on http://localhost:3000");
}

bootstrap();
