import { createHash } from "node:crypto";
import mongoose from "mongoose";
import { sendScreeningCompletedEmail } from "@ai-hackathon/auth/email";
import {
  Applicant,
  Job,
  ScreeningCache,
  ScreeningResult,
  TaskLog,
} from "@ai-hackathon/db";

export async function logTaskStep(params: {
  taskId: string;
  type: "screening" | "batch-screening" | "extraction" | "system";
  step: string;
  message: string;
  status?: "info" | "success" | "warning" | "error";
  jobId?: string;
  applicantId?: string;
  details?: any;
}) {
  try {
    await TaskLog.create({
      taskId: params.taskId,
      type: params.type,
      step: params.step,
      message: params.message,
      status: params.status || "info",
      jobId: params.jobId,
      applicantId: params.applicantId,
      details: params.details,
    });
  } catch (err) {
    console.error("[TaskLog] Failed to create log:", err);
  }
}

import { env } from "@ai-hackathon/env/server";
import { enqueueBatchScreening, getBatchProgress } from "@ai-hackathon/queue";
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

const CACHE_TTL_DAYS = 7;
export const SYSTEM_USER_ID = "usr_automated_system";

const WORKING_MODEL = "gemini-2.5-flash";

export function buildApplicantStatus(
  matchScore: number,
  thresholds?: { autoReject: number; needsReview: number },
) {
  const { autoReject = 50, needsReview = 70 } = thresholds || {};

  if (matchScore >= 85) return "shortlisted";
  if (matchScore >= needsReview) return "screening";
  if (matchScore < autoReject) return "rejected";
  return "pending";
}

function buildScreeningPrompt(
  job: {
    title: string;
    description: string;
    requirements: string[];
    skills: string[];
    techStack: string[];
    minExperience: number;
    educationLevel: string;
    screeningFocus?: string;
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
Requirements: ${(job.requirements || []).join(", ")}
Target Skills: ${(job.skills || []).join(", ")}
Primary Tech Stack: ${(job.techStack || []).join(", ")}
Minimum Experience Required: ${job.minExperience || 0} years
Required Education Level: ${job.educationLevel || "Bachelor's"}

${job.screeningFocus ? `### RECRUITER FOCUS AREA\n${job.screeningFocus}\n` : ""}

### APPLICANT DATA
Current Name: ${applicant.firstName} ${applicant.lastName}
Provided Bio: ${applicant.bio || "N/A"}

### RESUME SOURCE TEXT
[[START_RESUME]]
${applicant.resumeText || "No resume text provided."}
[[END_RESUME]]

### YOUR MISSION
1. **Screening Evaluation**: Provide a match score (0-100), strategic strengths, critical gaps, a formal recommendation, and a concise summary.
   - Strongly penalize if they don't meet the Minimum Experience or Education Level.
   - Heavily weight their proficiency in the Primary Tech Stack.
   - If a Custom Screening Focus is provided, prioritize those attributes in your summary and score.
2. **Score Justification (XAI)**: Provide a structured breakdown of the score (0-100 each) across:
   - technicalSkills: How well their tech stack matches.
   - experience: Relevance of their past roles and years of experience.
   - education: Academic background relevance.
   - culturalFit: Based on their bio, projects, and communication style in the resume.
3. **Skill Mapping**: Score the applicant's proficiency in each of the "Target Skills" listed above.
4. **Profile Extraction**: Extract the following data points FROM THE RESUME TEXT to build a structured profile:
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
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Overall match percentage (0-100) of the applicant against the job requirements.",
    ),
  scoreBreakdown: z.object({
    technicalSkills: z
      .number()
      .min(0)
      .max(100)
      .describe("Score for technical expertise and tech stack alignment."),
    experience: z
      .number()
      .min(0)
      .max(100)
      .describe("Score for relevance and depth of professional history."),
    education: z
      .number()
      .min(0)
      .max(100)
      .describe("Score for academic background and certification relevance."),
    culturalFit: z
      .number()
      .min(0)
      .max(100)
      .describe(
        "Score for soft skills, communication, and values alignment.",
      ),
  }),
  strengths: z
    .array(z.string())
    .describe("List of 3-5 specific technical or professional strengths."),
  gaps: z
    .array(z.string())
    .describe("List of critical skill gaps or missing requirements."),
  recommendation: z
    .string()
    .describe(
      "One of: Strongly Recommend, Recommend, Consider, or Not Recommended.",
    ),
  summary: z
    .string()
    .describe(
      "A 2-3 sentence executive summary of the candidate's suitability.",
    ),
  skillBreakdown: z
    .array(
      z.object({
        skill: z.string(),
        score: z.number().min(0).max(100),
      }),
    )
    .describe(
      "A detailed score for each specific target skill requested in the job.",
    ),
  firstName: z.string().optional().describe("Applicant's first name."),
  lastName: z.string().optional().describe("Applicant's last name."),
  headline: z
    .string()
    .optional()
    .describe("A professional headline (e.g., Senior Software Engineer)."),
  bio: z
    .string()
    .optional()
    .describe("A short professional bio extracted or summarized."),
  location: z
    .string()
    .optional()
    .describe("Current location (City, Country)."),
  skills: z
    .array(
      z.object({
        name: z.string().describe("Name of the skill."),
        level: z.enum(SKILL_LEVELS).describe("Proficiency level."),
        yearsOfExperience: z.number().describe("Estimated years using this skill."),
      }),
    )
    .default([])
    .describe("Comprehensive list of technical skills found in the resume."),
  experience: z
    .array(
      z.object({
        company: z.string(),
        role: z.string(),
        startDate: z.string().describe("Format: MMM YYYY or YYYY-MM."),
        endDate: z
          .string()
          .describe("Format: MMM YYYY, YYYY-MM, or 'Present'."),
        description: z
          .string()
          .describe("2-3 bullet points of key achievements."),
        technologies: z.array(z.string()),
        isCurrent: z.boolean(),
      }),
    )
    .default([])
    .describe("Chronological work history."),
  education: z
    .array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        fieldOfStudy: z.string(),
        startYear: z.number(),
        endYear: z.number().describe("Year of completion or expected."),
      }),
    )
    .default([])
    .describe("Academic history."),
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
        issueDate: z.string().describe("Format: YYYY or MMM YYYY."),
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
    techStack: string[];
    minExperience: number;
    educationLevel: string;
    screeningFocus?: string;
  },
  applicant: {
    firstName: string;
    lastName: string;
    bio?: string;
    skills?: { name: string }[];
    resumeText?: string;
  },
  options: { skipCache?: boolean } = {},
): Promise<AIScreeningOutput> {
  const applicantData =
    applicant instanceof mongoose.Document ? applicant.toObject() : applicant;
  const jobData = job instanceof mongoose.Document ? job.toObject() : job;

  // Safety: Truncate extremely large resumes to prevent token bloat
  const MAX_RESUME_CHARS = 15000;
  if (applicantData.resumeText && applicantData.resumeText.length > MAX_RESUME_CHARS) {
    console.warn(`[Screening] Truncating resume for ${applicantData.firstName} (Original: ${applicantData.resumeText.length} chars)`);
    applicantData.resumeText = applicantData.resumeText.substring(0, MAX_RESUME_CHARS) + "... [Truncated for screening]";
  }

  const prompt = buildScreeningPrompt(jobData, {
    ...applicantData,
    skills: applicantData.skills || [],
  });

  // Calculate hash of the prompt and model to use as cache key
  const promptHash = createHash("md5")
    .update(`${WORKING_MODEL}:${prompt}`)
    .digest("hex");

  // Check cache first
  if (!options.skipCache) {
    const cachedResult = await ScreeningCache.findOne({ promptHash });
    if (cachedResult) {
      console.log("[Screening] Cache HIT for promptHash:", promptHash);
      return cachedResult.output as AIScreeningOutput;
    }
    console.log("[Screening] Cache MISS for promptHash:", promptHash);
  } else {
    console.log("[Screening] Skipping cache as requested");
  }

  const systemPrompt =
    "You are a Senior Technical Recruiter with 20+ years of experience in talent acquisition and specialized technical screening. " +
    "Your objective is to provide a brutal, honest, and data-driven evaluation of candidates against job requirements. " +
    "Do not be overly lenient; prioritize candidates who demonstrate clear, verifiable evidence of the required skills and experience. " +
    "You are also a meticulous data extractor, ensuring that every professional detail from the resume is mapped into a structured profile with high accuracy.";

  console.log(`[Screening] Calling Gemini with model: ${WORKING_MODEL}`);

  const { output } = await generateText({
    model: google(WORKING_MODEL) as any,
    system: systemPrompt,
    prompt,
    output: Output.object({ schema: AIScreeningOutputSchema }),
    temperature: 0,
  });

  if (!output || output.matchScore === undefined) {
    console.error("[Screening] AI returned invalid or empty output:", output);
    throw new Error("AI failed to generate a valid screening result");
  }

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
  taskId?: string;
  skipCache?: boolean;
}) {
  const {
    applicantId,
    jobId,
    triggeredByUserId,
    triggererEmail,
    triggererName,
    maxRetries = 3,
    taskId = `manual-${Date.now()}`,
    skipCache = false,
  } = params;

  await logTaskStep({
    taskId,
    type: "screening",
    step: "start",
    message: `Starting AI screening for applicant ${applicantId}`,
    jobId,
    applicantId,
  });

  const [applicant, job] = await Promise.all([
    Applicant.findById(applicantId),
    ensureJobExists(jobId),
  ]);

  if (!applicant) {
    await logTaskStep({
      taskId,
      type: "screening",
      step: "error",
      message: "Applicant not found",
      status: "error",
      jobId,
      applicantId,
    });
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Applicant not found",
    });
  }

  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await logTaskStep({
        taskId,
        type: "screening",
        step: "extraction",
        message: `Attempt ${attempt}/${maxRetries}: Analyzing resume text and extracting profile`,
        jobId,
        applicantId,
      });

      const validatedData = await evaluateAndExtractProfile(job, applicant, {
        skipCache,
      });

      await logTaskStep({
        taskId,
        type: "screening",
        step: "extraction_complete",
        message: `Successfully extracted data. Match Score: ${validatedData.matchScore}`,
        status: "success",
        jobId,
        applicantId,
        details: {
          matchScore: validatedData.matchScore,
          recommendation: validatedData.recommendation,
          summary: validatedData.summary,
        },
      });


      console.log(
        `[Screening] AI Analysis Complete for Applicant ${applicantId}. Match Score: ${validatedData.matchScore}`,
      );

      const screeningPayload = {
        ...validatedData,
        applicantId,
        jobId,
        jobVersion: job.version || 1,
        isOutdated: false,
      };

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
            scoreBreakdown: validatedData.scoreBreakdown,
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
          status: buildApplicantStatus(validatedData.matchScore, {
            autoReject: job.autoRejectThreshold,
            needsReview: job.needsReviewThreshold,
          }),
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
  await logTaskStep({
    taskId,
    type: "screening",
    step: "failed",
    message: `All ${maxRetries} attempts failed: ${lastError?.message}`,
    status: "error",
    jobId,
    applicantId,
  });

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
        skipCache: z.boolean().optional(),
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
        skipCache: input.skipCache,
      });
    }),

  batchGenerate: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        applicantIds: z.array(z.string()),
      }),
    )
    .output(z.object({ batchJobId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { batchJobId } = await enqueueBatchScreening({
        applicantIds: input.applicantIds,
        jobId: input.jobId,
        triggeredByUserId: ctx.session.user.id,
        triggererEmail: ctx.session.user.email,
        triggererName: ctx.session.user.name ?? undefined,
      });

      return { batchJobId: batchJobId ?? "" };
    }),

  getBatchProgress: protectedProcedure
    .input(z.object({ batchJobId: z.string() }))
    .output(
      z.object({
        status: z.string(),
        total: z.number(),
        completed: z.number(),
        failed: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const progress = await getBatchProgress(input.batchJobId);
      return progress;
    }),

  rescreen: protectedProcedure
    .input(z.object({ applicantId: z.string(), jobId: z.string() }))
    .output(ScreeningResultSchema)
    .mutation(async ({ input, ctx }) => {
      return runAIInternal({
        applicantId: input.applicantId,
        jobId: input.jobId,
        triggeredByUserId: ctx.session.user.id,
        triggererEmail: ctx.session.user.email,
        triggererName: ctx.session.user.name ?? undefined,
        skipCache: true, // Rescreening should ALWAYS bypass cache
      });
    }),

  updateFeedback: protectedProcedure
    .input(
      z.object({
        applicantId: z.string(),
        manualScore: z.number().min(0).max(100).optional(),
        recruiterNotes: z.string().optional(),
      }),
    )
    .output(ScreeningResultSchema)
    .mutation(async ({ input }) => {
      const screening = await ScreeningResult.findOneAndUpdate(
        { applicantId: input.applicantId },
        {
          $set: {
            manualScore: input.manualScore,
            recruiterNotes: input.recruiterNotes,
          },
        },
        { new: true },
      );

      if (!screening) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Screening result not found",
        });
      }

      // If manual score is provided, we might want to update the applicant status too.
      if (input.manualScore !== undefined) {
        const job = await Job.findById(screening.jobId);
        if (job) {
          const status = buildApplicantStatus(input.manualScore, {
            autoReject: job.autoRejectThreshold,
            needsReview: job.needsReviewThreshold,
          });
          await Applicant.findByIdAndUpdate(input.applicantId, { status });
        }
      }

      return serializeScreening(screening);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      const screening = await ScreeningResult.findById(input.id);
      if (!screening) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Screening result not found",
        });
      }

      const jobId = screening.jobId.toString();
      await ScreeningResult.findByIdAndDelete(input.id);
      await syncJobMetrics(jobId);

      return { success: true };
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
