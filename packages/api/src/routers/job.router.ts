import { Applicant, Job, ScreeningResult } from "@ai-hackathon/db";
import {
  CreateJobSchema,
  createPaginatedResponseSchema,
  DashboardStatsSchema,
  JobAnalyticsSchema,
  JobSchema,
  PaginationInputSchema,
} from "@ai-hackathon/shared";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { serializeJob } from "../serializers";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const jobRouter = router({
  getPublicById: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(JobSchema.nullable())
    .query(async ({ input }) => {
      const job = await Job.findById(input.id);
      return job ? serializeJob(job) : null;
    }),

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
    .input(PaginationInputSchema.optional())
    .output(createPaginatedResponseSchema(JobSchema))
    .query(async ({ input }) => {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        sortBy,
        sortOrder = "desc",
      } = input || {};
      const skip = (page - 1) * limit;

      const query: any = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { department: { $regex: search, $options: "i" } },
        ];
      }
      if (status && status !== "all") {
        query.status = status;
      }

      const sort: any = {};
      if (sortBy) {
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;
      } else {
        sort.createdAt = -1;
      }

      const [jobs, totalCount] = await Promise.all([
        Job.find(query).sort(sort).skip(skip).limit(limit),
        Job.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        items: jobs.map(serializeJob),
        totalCount,
        totalPages,
        currentPage: page,
        hasMore: page < totalPages,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(JobSchema.nullable())
    .query(async ({ input }) => {
      const job = await Job.findById(input.id);
      return job ? serializeJob(job) : null;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: CreateJobSchema.partial(),
      }),
    )
    .output(JobSchema)
    .mutation(async ({ input }) => {
      const existing = await Job.findById(input.id);
      if (!existing) {
        throw new Error("Job not found");
      }

      // Check if requirements or skills changed
      const reqsChanged =
        input.data.requirements &&
        JSON.stringify(input.data.requirements) !==
          JSON.stringify(existing.requirements);
      const skillsChanged =
        input.data.skills &&
        JSON.stringify(input.data.skills) !== JSON.stringify(existing.skills);

      if (reqsChanged || skillsChanged) {
        // Increment version and mark screenings as outdated
        const newVersion = (existing.version || 1) + 1;
        await Job.findByIdAndUpdate(input.id, {
          ...input.data,
          version: newVersion,
        });

        await ScreeningResult.updateMany(
          { jobId: input.id },
          { $set: { isOutdated: true } },
        );
      } else {
        await Job.findByIdAndUpdate(input.id, input.data);
      }

      const updated = await Job.findById(input.id);
      return serializeJob(updated!);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      const job = await Job.findById(input.id);
      if (!job) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job not found",
        });
      }

      await Promise.all([
        Job.findByIdAndDelete(input.id),
        Applicant.deleteMany({ jobId: input.id }),
        ScreeningResult.deleteMany({ jobId: input.id }),
      ]);

      return { success: true };
    }),

  compareApplicants: protectedProcedure
    .input(z.object({ jobId: z.string(), applicantIds: z.array(z.string()) }))
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          matchScore: z.number(),
          strengths: z.array(z.string()),
          gaps: z.array(z.string()),
          recommendation: z.string(),
        }),
      ),
    )
    .query(async ({ input }) => {
      const screenings = await ScreeningResult.find({
        jobId: input.jobId,
        applicantId: { $in: input.applicantIds },
      });

      const applicants = await Applicant.find({
        _id: { $in: input.applicantIds },
      });

      // Simple comparison mapper
      return applicants.map((a) => {
        const s = screenings.find((sr) => sr.applicantId.toString() === a.id);
        return {
          id: a.id,
          name: `${a.firstName} ${a.lastName}`,
          matchScore: s?.matchScore ?? 0,
          strengths: s?.strengths ?? [],
          gaps: s?.gaps ?? [],
          recommendation: s?.recommendation ?? "N/A",
        };
      });
    }),

  getAnalytics: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .output(JobAnalyticsSchema)
    .query(async ({ input }) => {
      const screenings = await ScreeningResult.find({ jobId: input.jobId });

      const distribution = {
        "90-100": 0,
        "80-89": 0,
        "70-79": 0,
        "60-69": 0,
        "<60": 0,
      };

      let totalTech = 0;
      let totalExp = 0;
      let totalEdu = 0;
      let totalFit = 0;
      let count = 0;

      const skillCounts: Record<string, { present: number; total: number }> =
        {};

      for (const s of screenings) {
        const score = s.manualScore ?? s.matchScore;
        if (score >= 90) distribution["90-100"]++;
        else if (score >= 80) distribution["80-89"]++;
        else if (score >= 70) distribution["70-79"]++;
        else if (score >= 60) distribution["60-69"]++;
        else distribution["<60"]++;

        if (s.scoreBreakdown) {
          totalTech += s.scoreBreakdown.technicalSkills;
          totalExp += s.scoreBreakdown.experience;
          totalEdu += s.scoreBreakdown.education;
          totalFit += s.scoreBreakdown.culturalFit;
          count++;
        }

        // Skill gaps analysis
        for (const skill of s.skillBreakdown) {
          if (!skillCounts[skill.skill]) {
            skillCounts[skill.skill] = { present: 0, total: 0 };
          }
          const stats = skillCounts[skill.skill]!;
          stats.total++;
          if (skill.score > 50) stats.present++;
        }
      }

      const topSkillsGaps = Object.entries(skillCounts)
        .map(([skill, stats]) => ({
          skill,
          missingPercentage: Math.round(
            ((stats.total - stats.present) / stats.total) * 100,
          ),
        }))
        .sort((a, b) => b.missingPercentage - a.missingPercentage)
        .slice(0, 5);

      return {
        jobId: input.jobId,
        scoreDistribution: distribution,
        topSkillsGaps,
        avgScores: {
          technicalSkills: count ? Math.round(totalTech / count) : 0,
          experience: count ? Math.round(totalExp / count) : 0,
          education: count ? Math.round(totalEdu / count) : 0,
          culturalFit: count ? Math.round(totalFit / count) : 0,
        },
      };
    }),

  stats: protectedProcedure
    .input(z.void())
    .output(DashboardStatsSchema)
    .query(async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        totalCandidates,
        openPositions,
        screenedToday,
        screenedApplicants,
      ] = await Promise.all([
        Applicant.countDocuments(),
        Job.countDocuments({ status: "active" }),
        Applicant.countDocuments({
          "screening.matchScore": { $exists: true },
          updatedAt: { $gte: today },
        }),
        Applicant.find(
          { "screening.matchScore": { $exists: true } },
          { "screening.matchScore": 1 },
        ).lean(),
      ]);

      const avgMatchScore = screenedApplicants.length
        ? Math.round(
            screenedApplicants.reduce(
              (total, applicant) =>
                total +
                ((applicant.screening as any)?.manualScore ??
                  (applicant.screening as any)?.matchScore ??
                  0),
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
