import { createHash } from "node:crypto";
import { sendScreeningCompletedEmail } from "@ai-hackathon/auth/email";
import { Applicant, ScreeningCache, ScreeningResult } from "@ai-hackathon/db";
import { env } from "@ai-hackathon/env/server";
import {
  LANGUAGE_PROFICIENCIES,
  ScreeningResultSchema,
  SKILL_LEVELS,
} from "@ai-hackathon/shared";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { TRPCError } from "@trpc/server";
import { generateText, Output } from "ai";
import { z } from "zod";
import { ensureJobExists, syncJobMetrics } from "../router-helpers/job-metrics";
import { serializeScreening } from "../serializers";
import { protectedProcedure, router } from "../trpc";

const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});

const SHORTLIST_THRESHOLD = 85;
const CACHE_TTL_DAYS = 7;
export const SYSTEM_USER_ID = "usr_automated_system";

const WORKING_MODEL = "gemini-2.5-flash";

export function buildApplicantStatus(matchScore: number) {
  return matchScore >= SHORTLIST_THRESHOLD ? "shortlisted" : "screening";
}

function buildScreeningPrompt(
  job: {
    title: string;
    description: string;
    requirements: string[];
    skills: string[];
  },
  applicant: {
    firstName: string;
    lastName: string;
    bio?: string;
    skills: { name: string }[];
    resumeText?: string;
  },
): string {
  return `You are an expert technical recruiter and data extractor. Your task is to perform a deep analysis of an applicant's resume and screen them for a specific job opening.

### JOB CONTEXT
Title: ${job.title}
Description: ${job.description}
Requirements: ${job.requirements.join(", ")}
Target Skills: ${job.skills.join(", ")}

### APPLICANT DATA
Current Name: ${applicant.firstName} ${applicant.lastName}
Provided Bio: ${applicant.bio || "N/A"}
Resume Source Text:
${applicant.resumeText || "No resume text provided."}

### YOUR MISSION
1. **Screening Evaluation**: Provide a match score (0-100), strategic strengths, critical gaps, a formal recommendation, and a concise summary.
2. **Skill Mapping**: Score the applicant's proficiency in each of the "Target Skills" listed above.
3. **Profile Extraction**: Extract the following data points FROM THE RESUME TEXT to build a structured profile:
   - Personal Info: headline, detailed bio, location.
   - Career History: Extract all work experience (company, role, dates, description, technologies).
   - Education: Extract all degrees (institution, degree, field, years).
   - Languages: Extract known languages and proficiency. Use ONLY: Basic, Intermediate, Conversational, Fluent, Native.
   - Certifications & Projects: Extract relevant entries.
- For Skill levels, use ONLY: Basic, Beginner, Intermediate, Advanced, Expert.

Ensure all extracted dates are in a readable format (e.g. "Jan 2022" or "2022-01"). If a field is missing in the resume, provide an empty array or reasonable default.`;
}

export async function createOrUpdateScreening(
  applicantId: string,
  jobId: string,
  userId: string,
  screeningData: z.infer<typeof ScreeningResultSchema>,
) {
  const existing = await ScreeningResult.findOne({ applicantId });

  if (existing) {
    existing.set({
      ...screeningData,
      applicantId,
      jobId,
      createdByUserId: userId,
    });
    return existing.save();
  }

  return new ScreeningResult({
    ...screeningData,
    applicantId,
    jobId,
    createdByUserId: userId,
  }).save();
}

export const AIScreeningOutputSchema = z.object({
  matchScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendation: z.string(),
  summary: z.string(),
  skillBreakdown: z.array(
    z.object({
      skill: z.string(),
      score: z.number(),
    }),
  ),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z
    .array(
      z.object({
        name: z.string(),
        level: z.enum(SKILL_LEVELS),
        yearsOfExperience: z.number(),
      }),
    )
    .default([]),
  experience: z
    .array(
      z.object({
        company: z.string(),
        role: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
        isCurrent: z.boolean(),
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        fieldOfStudy: z.string(),
        startYear: z.number(),
        endYear: z.number(),
      }),
    )
    .default([]),
  languages: z
    .array(
      z.object({
        name: z.string(),
        proficiency: z.enum(LANGUAGE_PROFICIENCIES),
      }),
    )
    .default([]),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        issueDate: z.string(),
      }),
    )
    .default([]),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
        role: z.string(),
        link: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }),
    )
    .default([]),
});

export type AIScreeningOutput = z.infer<typeof AIScreeningOutputSchema>;

export async function evaluateAndExtractProfile(
  job: {
    title: string;
    description: string;
    requirements: string[];
    skills: string[];
  },
  applicant: {
    firstName: string;
    lastName: string;
    bio?: string;
    skills?: { name: string }[];
    resumeText?: string;
  },
): Promise<AIScreeningOutput> {
  const prompt = buildScreeningPrompt(job, {
    ...applicant,
    skills: applicant.skills || [],
  });

  // Calculate hash of the prompt to use as cache key
  const promptHash = createHash("md5").update(prompt).digest("hex");

  // Check cache first
  const cachedResult = await ScreeningCache.findOne({ promptHash });
  if (cachedResult) {
    console.log("[Screening] Cache HIT for promptHash:", promptHash);
    return cachedResult.output as AIScreeningOutput;
  }

  console.log("[Screening] Cache MISS for promptHash:", promptHash);

  const systemPrompt =
    "You are an expert technical recruiter and data extractor. Provide structured, objective evaluations and extract accurate profile data from the provided resume text.";

  const { output } = await generateText({
    model: google(WORKING_MODEL) as any,
    system: systemPrompt,
    prompt,
    output: Output.object({ schema: AIScreeningOutputSchema }),
    temperature: 0,
  });

  // Store in cache for future use
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS);

  await ScreeningCache.create({
    promptHash,
    output,
    expiresAt,
  }).catch((err) => console.error("[Screening] Cache write failed:", err));

  return output;
}

/**
 * Internal helper to run screening logic with automatic retries.
 */
export async function runAIInternal(params: {
  applicantId: string;
  jobId: string;
  triggeredByUserId: string;
  triggererEmail?: string;
  triggererName?: string;
  maxRetries?: number;
}) {
  const {
    applicantId,
    jobId,
    triggeredByUserId,
    triggererEmail,
    triggererName,
    maxRetries = 3,
  } = params;

  const [applicant, job] = await Promise.all([
    Applicant.findById(applicantId),
    ensureJobExists(jobId),
  ]);

  if (!applicant) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Applicant not found",
    });
  }

  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `[Screening] AI Analysis Attempt ${attempt}/${maxRetries} for Applicant ${applicantId}`,
      );

      const validatedData = await evaluateAndExtractProfile(job, applicant);

      console.log(
        `[Screening] AI Analysis Complete for Applicant ${applicantId}. Match Score: ${validatedData.matchScore}`,
      );

      const screeningPayload = { ...validatedData, applicantId, jobId };

      const [savedRecord] = await Promise.all([
        createOrUpdateScreening(
          applicantId,
          jobId,
          triggeredByUserId,
          screeningPayload as any,
        ),
        Applicant.findByIdAndUpdate(applicantId, {
          screening: {
            ...validatedData,
            languages: validatedData.languages,
            experience: validatedData.experience,
            education: validatedData.education,
            skills: validatedData.skills,
            certifications: validatedData.certifications,
            projects: validatedData.projects,
          },
          headline: validatedData.headline || applicant.headline,
          bio: validatedData.bio || applicant.bio,
          location: validatedData.location || applicant.location,
          skills:
            validatedData.skills.length > 0
              ? validatedData.skills
              : applicant.skills,
          experience:
            validatedData.experience.length > 0
              ? validatedData.experience
              : applicant.experience,
          education:
            validatedData.education.length > 0
              ? validatedData.education
              : applicant.education,
          languages:
            validatedData.languages.length > 0
              ? validatedData.languages
              : applicant.languages,
          certifications:
            validatedData.certifications.length > 0
              ? validatedData.certifications
              : applicant.certifications,
          projects:
            validatedData.projects.length > 0
              ? validatedData.projects
              : applicant.projects,
          status: buildApplicantStatus(validatedData.matchScore),
        }),
        syncJobMetrics(jobId),
      ]);

      if (triggererEmail) {
        sendScreeningCompletedEmail({
          email: triggererEmail,
          recruiterName: triggererName || "Recruiter",
          applicantName: `${applicant.firstName} ${applicant.lastName}`,
          jobTitle: job.title,
          matchScore: validatedData.matchScore,
          applicantId: applicant.id,
        }).catch((error) => console.error("[Screening] Email failed:", error));
      }

      return serializeScreening(savedRecord as any);
    } catch (error: any) {
      lastError = error;
      console.error(`[Screening] Attempt ${attempt} failed:`, error.message);

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = attempt * 2000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // If we reach here, all retries failed
  console.error(
    `[Screening] All ${maxRetries} attempts failed for Applicant ${applicantId}`,
  );

  await Applicant.findByIdAndUpdate(applicantId, {
    status: "failed",
  });

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `AI screening failed after ${maxRetries} attempts: ${lastError?.message || "Unknown error"}`,
    cause: lastError,
  });
}

export const screeningRouter = router({
  testConnection: protectedProcedure
    .input(z.void())
    .output(
      z.object({
        success: z.boolean(),
        message: z.string(),
        workingModel: z.string().optional(),
      }),
    )
    .query(async () => {
      try {
        const { text } = await generateText({
          model: google(WORKING_MODEL),
          prompt: "Respond with 'pong'",
        });
        return {
          success: true,
          message: `Gemini connected with ${WORKING_MODEL}: ${text}`,
          workingModel: WORKING_MODEL,
        };
      } catch (error: any) {
        console.error("[Screening] Connection Test Failed:", error.message);
        return {
          success: false,
          message: `Connection failed: ${error.message}`,
        };
      }
    }),

  generate: protectedProcedure
    .input(
      z.object({
        applicantId: z.string(),
        jobId: z.string(),
      }),
    )
    .output(ScreeningResultSchema)
    .mutation(async ({ input, ctx }) => {
      return runAIInternal({
        applicantId: input.applicantId,
        jobId: input.jobId,
        triggeredByUserId: ctx.session.user.id,
        triggererEmail: ctx.session.user.email,
        triggererName: ctx.session.user.name ?? undefined,
      });
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
