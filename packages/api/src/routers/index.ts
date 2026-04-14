import { protectedProcedure, publicProcedure, router } from "../trpc";
import { applicantRouter } from "./applicant.router";
import { jobRouter } from "./job.router";
import { screeningRouter } from "./screening.router";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
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
