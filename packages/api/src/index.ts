import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";

import type { Context } from "./context.js";

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const router = t.router;

export * from "./openapi.js";

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
