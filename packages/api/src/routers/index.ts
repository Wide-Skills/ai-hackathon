import { protectedProcedure, publicProcedure, router } from "../index.js";
import { jobRouter } from "./job.router.js";
import { applicantRouter } from "./applicant.router.js";
import { screeningRouter } from "./screening.router.js";

export const appRouter = router({
  healthCheck: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/health', tags: ['system'], summary: 'Health check' } })
    .query(() => {
    return "OK";
  }),
  privateData: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/private', tags: ['system'], summary: 'Private data check' } })
    .query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  jobs: jobRouter,
  applicants: applicantRouter,
  screenings: screeningRouter,
});
export type AppRouter = typeof appRouter;
