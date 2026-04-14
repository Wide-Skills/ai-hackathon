import { Applicant, Job } from "@ai-hackathon/db";
import {
  CreateJobSchema,
  DashboardStatsSchema,
  JobSchema,
} from "@ai-hackathon/shared";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { serializeJob } from "../serializers";

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
      const totalCandidates = await Applicant.countDocuments();
      const openPositions = await Job.countDocuments({ status: "active" });
      const screenedToday = await Applicant.countDocuments({
        status: { $in: ["screening", "shortlisted", "rejected", "hired"] },
      });

      // TODO: calculate avg match score
      const avgMatchScore = 80;

      return {
        totalCandidates,
        openPositions,
        screenedToday,
        avgMatchScore,
      };
    }),
});
