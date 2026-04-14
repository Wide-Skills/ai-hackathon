import { ScreeningResult } from "@ai-hackathon/db";
import { ScreeningResultSchema } from "@ai-hackathon/shared";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { serializeScreening } from "../serializers";

export const screeningRouter = router({
  generateMock: protectedProcedure
    .input(
      z.object({
        applicantId: z.string(),
        jobId: z.string(),
      }),
    )
    .output(ScreeningResultSchema)
    .mutation(async ({ input }) => {
      const screening = new ScreeningResult({
        ...input,
        matchScore: 85,
        strengths: ["Strong TypeScript", "Next.js experience"],
        gaps: ["No explicit NestJS mentioned"],
        recommendation: "Strongly Recommend",
      });
      await screening.save();
      return serializeScreening(screening);
    }),

  getByApplicant: protectedProcedure
    .input(z.object({ applicantId: z.string() }))
    .output(ScreeningResultSchema.nullable())
    .query(async ({ input }) => {
      const screening = await ScreeningResult.findOne({
        applicantId: input.applicantId,
      });
      return screening ? serializeScreening(screening) : null;
    }),

  list: protectedProcedure
    .input(z.void())
    .output(z.array(ScreeningResultSchema))
    .query(async () => {
      const screenings = await ScreeningResult.find().sort({ createdAt: -1 });
      return screenings.map(serializeScreening);
    }),

  listByJob: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .output(z.array(ScreeningResultSchema))
    .query(async ({ input }) => {
      const screenings = await ScreeningResult.find({ jobId: input.jobId }).sort(
        {
          createdAt: -1,
        },
      );
      return screenings.map(serializeScreening);
    }),
});
