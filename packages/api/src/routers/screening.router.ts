import { z } from "zod";
import { protectedProcedure, router } from "../index.js";
import { ScreeningResult } from "@ai-hackathon/db";

export const screeningRouter = router({
  generateMock: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/screenings/mock', tags: ['screenings'], summary: 'Generate a mock screening' } })
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
    .meta({ openapi: { method: 'GET', path: '/screenings/applicant/{applicantId}', tags: ['screenings'], summary: 'Get screening result by applicant ID' } })
    .input(z.object({ applicantId: z.string() }))
    .query(async ({ input }) => {
      return ScreeningResult.findOne({ applicantId: input.applicantId });
    }),
});
