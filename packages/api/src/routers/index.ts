import { protectedProcedure, publicProcedure, router } from "../index.js";
import { jobRouter } from "./job.router.js";
import { applicantRouter } from "./applicant.router.js";
import { screeningRouter } from "./screening.router.js";

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
