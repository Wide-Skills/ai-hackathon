import { generateOpenApiDocument } from "trpc-openapi";
import { appRouter } from "./routers/index.js";
import { env } from "@ai-hackathon/env/server";

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "AI Hackathon API",
  description: "OpenAPI compliant REST endpoints powered natively by our tRPC routers.",
  version: "1.0.0",
  baseUrl: `${env.CORS_ORIGIN || "http://localhost:3000"}/api`,
  // Specify doc-level security schemas safely if authentication is protected logic
  securitySchemes: {
    Authorization: {
      type: "http",
      scheme: "bearer",
    },
  },
});
