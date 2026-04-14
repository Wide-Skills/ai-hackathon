import { createContext as createTrpcContext } from "@ai-hackathon/api/context";
import { appRouter } from "@ai-hackathon/api/routers/index";
import { Injectable, type NestMiddleware } from "@nestjs/common";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { NextFunction, Request, Response } from "express";

@Injectable()
export class TrpcMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalUrl = req.url;

    const handler = createExpressMiddleware({
      router: appRouter,
      createContext: () => createTrpcContext({ req }),
    });

    req.url = req.url.replace(/^\/trpc/, "");

    if (req.url === "" || !req.url.startsWith("/")) {
      req.url = `/${req.url}`;
    }

    console.log(`[tRPC] ${req.method} ${originalUrl} -> ${req.url}`);

    try {
      return handler(req, res, next);
    } catch (err) {
      console.error("[tRPC Error]", err);
      next(err);
    }
  }
}
