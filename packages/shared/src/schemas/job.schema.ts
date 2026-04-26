import { z } from "zod";

export const CreateJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  department: z.string().optional(),
  location: z.string().optional(),
  type: z
    .enum(["Full-time", "Part-time", "Contract", "Remote"])
    .default("Full-time"),
  requirements: z
    .array(z.string())
    .min(1, "At least one requirement is required"),
  skills: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  minExperience: z.number().min(0).default(0),
  educationLevel: z
    .enum(["High School", "Bachelor's", "Master's", "PhD", "Any"])
    .default("Bachelor's"),
  screeningFocus: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  currency: z.string().default("USD"),
  closingDate: z.string().optional(),
  status: z.enum(["active", "closed", "draft"]).default("active"),
  autoRejectThreshold: z.number().min(0).max(100).default(50),
  needsReviewThreshold: z.number().min(0).max(100).default(70),
  version: z.number().default(1),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type JobStatus = z.infer<typeof CreateJobSchema.shape.status>;

export const JobSchema = CreateJobSchema.extend({
  id: z.string(),
  applicantsCount: z.number().default(0),
  screenedCount: z.number().default(0),
  shortlistedCount: z.number().default(0),
  createdAt: z.date().optional().or(z.string()),
  updatedAt: z.date().optional().or(z.string()),
});

export type Job = z.infer<typeof JobSchema>;

export const JobAnalyticsSchema = z.object({
  jobId: z.string(),
  scoreDistribution: z.object({
    "90-100": z.number(),
    "80-89": z.number(),
    "70-79": z.number(),
    "60-69": z.number(),
    "<60": z.number(),
  }),
  topSkillsGaps: z.array(
    z.object({
      skill: z.string(),
      missingPercentage: z.number(),
    }),
  ),
  avgScores: z.object({
    technicalSkills: z.number(),
    experience: z.number(),
    education: z.number(),
    culturalFit: z.number(),
  }),
});

export type JobAnalytics = z.infer<typeof JobAnalyticsSchema>;
