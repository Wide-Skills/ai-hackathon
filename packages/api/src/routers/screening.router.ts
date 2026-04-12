import { z } from "zod";
import { protectedProcedure, router } from "../index.js";
import { ScreeningResult } from "@ai-hackathon/db";

export const screeningRouter = router({
  generateMock: protectedProcedure
    .input(
      z.object({
        applicantId: z.string(),
        jobId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const screening = new ScreeningResult({
        ...input,
        matchScore: 85,
        strengths: ["Strong TypeScript", "Next.js experience"],
        gaps: ["No explicit NestJS mentioned"],
        recommendation: "Highly recommended for further interviews.",
      });
      await screening.save();
      return screening;
    }),

  getByApplicant: protectedProcedure
    .input(z.object({ applicantId: z.string() }))
    .query(async ({ input }) => {
      return ScreeningResult.findOne({ applicantId: input.applicantId });
    }),
});
