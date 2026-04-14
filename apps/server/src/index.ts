import "reflect-metadata";
import { createContext as createTrpcContext } from "@ai-hackathon/api/context";
import { appRouter } from "@ai-hackathon/api/routers/index";
import { auth } from "@ai-hackathon/auth";
import { env } from "@ai-hackathon/env/server";
import { NestFactory } from "@nestjs/core";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

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
  expressApp.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: ({ req }) => createTrpcContext({ req }),
    }),
  );
  expressApp.all("/api/auth/*path", async (req: any, _res: any) => {
    return auth.handler(req);
  });

  await app.listen(3000);
  console.log("Server is running on http://localhost:3000");
}

bootstrap();
