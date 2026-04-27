import { startWorkers } from "@ai-hackathon/api";
import { createContext } from "@ai-hackathon/api/context";
import { appRouter } from "@ai-hackathon/api/routers/index";
import { auth } from "@ai-hackathon/auth";
import { env } from "@ai-hackathon/env/server";
import { serve } from "@hono/node-server";
import { getConnInfo } from "@hono/node-server/conninfo";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { requestId } from "hono/request-id";
import { timing } from "hono/timing";
import logger from "./lib/logger";

const app = new Hono();

app.use("*", requestId());
app.use("*", timing());
app.use("*", poweredBy());

app.use("*", async (c, next) => {
  const info = getConnInfo(c);
  const agent = c.req.header("user-agent");

  c.res.headers.set("X-AI-Powered", "Gemini-2.5-Flash");
  c.res.headers.set("X-Recruiter-Intelligence", "Active");

  await next();

  logger.debug(
    {
      requestId: c.get("requestId"),
      method: c.req.method,
      path: c.req.path,
      remoteAddress: info.remote.address,
      userAgent: agent,
    },
    "Request completed",
  );
});

app.use(
  "*",
  honoLogger((str) => logger.info(str)),
);

app.use(
  "*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.onError((err, c) => {
  logger.error({ err }, "Global Hono Error");
  return c.json(
    {
      error: "Internal Server Error",
      message: err.message,
    },
    500,
  );
});

app.notFound((c) => {
  return c.json(
    { error: "Not Found", message: "The requested resource does not exist" },
    404,
  );
});

app.get("/", (c) => c.text("Screening Hackathon API is running"));
app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

app.all("/api/auth/*", async (c) => {
  const res = await auth.handler(c.req.raw);
  return res;
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    endpoint: "/trpc",
    createContext: (_opts, c) =>
      createContext({
        req: { headers: Object.fromEntries(c.req.raw.headers) },
      }),
  }) as any,
);

const port = env.PORT || 3000;

logger.info(`Starting server on port ${port}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});

logger.info("Starting background queue workers...");
startWorkers()
  .then(() => {
    logger.info("Background queue workers started successfully");
  })
  .catch((err) => {
    logger.error({ err }, "Failed to start background workers");
  });
