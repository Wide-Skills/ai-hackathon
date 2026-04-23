import { Applicant, ScreeningResult } from "@ai-hackathon/db";
import { env } from "@ai-hackathon/env/server";
import { ScreeningResultSchema } from "@ai-hackathon/shared";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { TRPCError } from "@trpc/server";
import { generateObject } from "ai";
import { z } from "zod";
import { ensureJobExists, syncJobMetrics } from "../router-helpers/job-metrics";
import { serializeScreening } from "../serializers";
import { protectedProcedure, router } from "../trpc";

const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildScreeningScore(
  applicantSkills: string[],
  jobSkills: string[],
  requirementsCount: number,
) {
  if (jobSkills.length === 0) {
    return clampScore(60 + requirementsCount * 2);
  }

  const matchedSkills = applicantSkills.filter((skill) =>
    jobSkills.includes(skill),
  );

  return clampScore(
    48 +
      (matchedSkills.length / jobSkills.length) * 35 +
      Math.min(requirementsCount, 5) * 3,
  );
}

function buildRecommendation(matchScore: number) {
  if (matchScore >= 85) {
    return "Strongly Recommend";
  }

  if (matchScore >= 70) {
    return "Recommend";
  }

  if (matchScore >= 55) {
    return "Consider";
  }

  return "Not Recommended";
}

function buildApplicantStatus(matchScore: number) {
  return matchScore >= 85 ? "shortlisted" : "screening";
}

export const screeningRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        applicantId: z.string(),
        jobId: z.string(),
      }),
    )
    .output(ScreeningResultSchema)
    .mutation(async ({ input, ctx }) => {
      const [applicant, job] = await Promise.all([
        Applicant.findById(input.applicantId),
        ensureJobExists(input.jobId),
      ]);

      if (!applicant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Applicant not found",
        });
      }

      const prompt = `
        You are an expert technical recruiter. Your task is to screen an applicant for a specific job opening.
        
        Job Title: ${job.title}
        Job Description: ${job.description}
        Key Requirements:
        ${job.requirements.map((r) => `- ${r}`).join("\n")}
        Preferred Skills:
        ${job.skills.map((s) => `- ${s}`).join("\n")}
        
        Applicant Name: ${applicant.firstName} ${applicant.lastName}
        Applicant Bio: ${applicant.bio || "N/A"}
        Applicant Skills: ${applicant.skills.map((s) => s.name).join(", ")}
        Resume Text:
        ${applicant.resumeText || "No resume text provided."}
        
        Analyze the applicant's profile against the job requirements. 
        Provide a structured evaluation including:
        1. A match score (0-100).
        2. Key strengths relative to the job.
        3. Capability gaps or missing signals.
        4. A recommendation (Strongly Recommend, Recommend, Consider, Not Recommended).
        5. A concise summary of the fit.
        6. A skill breakdown with individual scores for the job's preferred skills.
      `;

      try {
        const { object } = await generateObject({
          model: google("gemini-1.5-pro") as any, // Bypass version mismatch if it persists
          schema: ScreeningResultSchema,
          prompt,
        });

        const screeningPayload = {
          ...object,
          applicantId: input.applicantId,
          jobId: input.jobId,
          createdByUserId: ctx.session.user.id,
        };

        const existingScreening = await ScreeningResult.findOne({
          applicantId: input.applicantId,
        });

        if (existingScreening) {
          existingScreening.set(screeningPayload);
          await existingScreening.save();
        } else {
          const screening = new ScreeningResult(screeningPayload);
          await screening.save();
        }

        await Applicant.findByIdAndUpdate(input.applicantId, {
          screening: {
            matchScore: object.matchScore,
            strengths: object.strengths,
            gaps: object.gaps,
            recommendation: object.recommendation,
            summary: object.summary,
            skillBreakdown: object.skillBreakdown,
          },
          status: buildApplicantStatus(object.matchScore),
        });

        await syncJobMetrics(input.jobId);

        const savedScreening = await ScreeningResult.findOne({
          applicantId: input.applicantId,
        });

        if (!savedScreening) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Screening result could not be loaded after saving",
          });
        }

        return serializeScreening(savedScreening);
      } catch (error) {
        console.error("Gemini Screening Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate AI screening result",
          cause: error,
        });
      }
    }),

  generateMock: protectedProcedure
    .input(
      z.object({
        applicantId: z.string(),
        jobId: z.string(),
      }),
    )
    .output(ScreeningResultSchema)
    .mutation(async ({ input, ctx }) => {
      const [applicant, job] = await Promise.all([
        Applicant.findById(input.applicantId),
        ensureJobExists(input.jobId),
      ]);

      if (!applicant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Applicant not found",
        });
      }

      if (String(applicant.jobId) !== input.jobId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Applicant does not belong to this job",
        });
      }

      const applicantSkills = applicant.skills
        .map((skill) => skill.name.trim().toLowerCase())
        .filter(Boolean);
      const jobSkills = job.skills.map((skill) => skill.trim().toLowerCase());
      const matchedSkills = jobSkills.filter((skill) =>
        applicantSkills.includes(skill),
      );
      const missingSkills = jobSkills.filter(
        (skill) => !applicantSkills.includes(skill),
      );
      const matchScore = buildScreeningScore(
        applicantSkills,
        jobSkills,
        job.requirements.length,
      );
      const recommendation = buildRecommendation(matchScore);
      const summary = matchedSkills.length
        ? `${applicant.firstName} aligns with ${matchedSkills.length} core requirement${matchedSkills.length === 1 ? "" : "s"} for ${job.title}.`
        : `${applicant.firstName} needs further review against the key requirements for ${job.title}.`;
      const skillBreakdown = jobSkills.map((skill) => ({
        skill,
        score: applicantSkills.includes(skill) ? 92 : 38,
      }));
      const screeningPayload = {
        applicantId: input.applicantId,
        jobId: input.jobId,
        createdByUserId: ctx.session.user.id,
        matchScore,
        strengths:
          matchedSkills.length > 0
            ? matchedSkills.map((skill) => `Matched requirement: ${skill}`)
            : ["Baseline profile completeness supports a manual review"],
        gaps:
          missingSkills.length > 0
            ? missingSkills.slice(0, 3).map((skill) => `Missing signal: ${skill}`)
            : ["No major capability gaps detected"],
        recommendation,
        summary,
        skillBreakdown,
      };

      const existingScreening = await ScreeningResult.findOne({
        applicantId: input.applicantId,
      });

      if (existingScreening) {
        existingScreening.set(screeningPayload);
        await existingScreening.save();
      } else {
        const screening = new ScreeningResult(screeningPayload);
        await screening.save();
      }

      await Applicant.findByIdAndUpdate(input.applicantId, {
        screening: {
          matchScore,
          strengths: screeningPayload.strengths,
          gaps: screeningPayload.gaps,
          recommendation,
          summary,
          skillBreakdown,
        },
        status: buildApplicantStatus(matchScore),
      });

      await syncJobMetrics(input.jobId);

      const savedScreening = await ScreeningResult.findOne({
        applicantId: input.applicantId,
      });

      if (!savedScreening) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Screening result could not be loaded after saving",
        });
      }

      return serializeScreening(savedScreening);
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
      const screenings = await ScreeningResult.find({
        jobId: input.jobId,
      }).sort({
        createdAt: -1,
      });
      return screenings.map(serializeScreening);
    }),
});
