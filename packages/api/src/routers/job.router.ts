import { Applicant, Job } from "@ai-hackathon/db";
import {
  CreateJobSchema,
  DashboardStatsSchema,
  JobSchema,
} from "@ai-hackathon/shared";
import { z } from "zod";
import { protectedProcedure, router } from "../index.js";
import { serializeJob } from "../serializers.js";

export const jobRouter = router({
  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/jobs",
        tags: ["jobs"],
        summary: "Create a new Job",
      },
    })
    .input(CreateJobSchema)
    .output(JobSchema)
    .mutation(async ({ input }) => {
      const job = new Job(input);
      await job.save();
      return serializeJob(job);
    }),

  list: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/jobs",
        tags: ["jobs"],
        summary: "List all Jobs",
      },
    })
    .input(z.void())
    .output(z.array(JobSchema))
    .query(async () => {
      const jobs = await Job.find().sort({ createdAt: -1 });
      return jobs.map(serializeJob);
    }),

  getById: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/jobs/{id}",
        tags: ["jobs"],
        summary: "Get a specific Job",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(JobSchema.nullable())
    .query(async ({ input }) => {
      const job = await Job.findById(input.id);
      return job ? serializeJob(job) : null;
    }),

  stats: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/dashboard/stats",
        tags: ["dashboard"],
        summary: "Get Dashboard Statistics",
      },
    })
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
