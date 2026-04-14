import { env } from "@ai-hackathon/env/server";
import { generateOpenApiDocument } from "trpc-openapi";
import { appRouter } from "./routers/index.js";

export const openApiDocument: any = generateOpenApiDocument(appRouter, {
  title: "AI Hackathon API",
  description:
    "OpenAPI compliant REST endpoints powered natively by our tRPC routers.",
  version: "1.0.0",
  baseUrl: `${env.CORS_ORIGIN || "http://localhost:3000"}/api`,
  securitySchemes: {
    Authorization: {
      type: "http",
      scheme: "bearer",
    },
  },
});
