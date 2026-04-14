import { createContext } from "@ai-hackathon/api/context";
import { appRouter } from "@ai-hackathon/api/routers/index";
import { Injectable, type NestMiddleware } from "@nestjs/common";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { NextFunction, Request, Response } from "express";

@Injectable()
export class TrpcMiddleware implements NestMiddleware {
  private trpcMiddleware(req: Request, res: Response, next: NextFunction) {
    return createExpressMiddleware({
      router: appRouter,
      createContext: () => createContext({ req }),
    })(req, res, next);
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.trpcMiddleware(req, res, next);
  }
}
