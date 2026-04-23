import { Applicant, Job } from "@ai-hackathon/db";
import {
  CreateJobSchema,
  DashboardStatsSchema,
  JobSchema,
} from "@ai-hackathon/shared";
import { z } from "zod";
import { serializeJob } from "../serializers";
import { protectedProcedure, router } from "../trpc";

export const jobRouter = router({
  create: protectedProcedure
    .input(CreateJobSchema)
    .output(JobSchema)
    .mutation(async ({ input, ctx }) => {
      const job = new Job({
        ...input,
        createdByUserId: ctx.session.user.id,
      });
      await job.save();
      return serializeJob(job);
    }),

  list: protectedProcedure
    .input(z.void())
    .output(z.array(JobSchema))
    .query(async () => {
      const jobs = await Job.find().sort({ createdAt: -1 });
      return jobs.map(serializeJob);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(JobSchema.nullable())
    .query(async ({ input }) => {
      const job = await Job.findById(input.id);
      return job ? serializeJob(job) : null;
    }),

  stats: protectedProcedure
    .input(z.void())
    .output(DashboardStatsSchema)
    .query(async () => {
      const [
        totalCandidates,
        openPositions,
        screenedToday,
        screenedApplicants,
      ] = await Promise.all([
        Applicant.countDocuments(),
        Job.countDocuments({ status: "active" }),
        Applicant.countDocuments({
          screening: { $exists: true, $ne: null },
        }),
        Applicant.find(
          { screening: { $exists: true, $ne: null } },
          { "screening.matchScore": 1 },
        ).lean(),
      ]);

      const avgMatchScore = screenedApplicants.length
        ? Math.round(
            screenedApplicants.reduce(
              (total, applicant) =>
                total + (applicant.screening?.matchScore ?? 0),
              0,
            ) / screenedApplicants.length,
          )
        : 0;

      return {
        totalCandidates,
        openPositions,
        screenedToday,
        avgMatchScore,
      };
    }),
});
