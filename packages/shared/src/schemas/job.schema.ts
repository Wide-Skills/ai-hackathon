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
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  currency: z.string().default("USD"),
  closingDate: z.string().optional(),
  status: z.enum(["active", "closed", "draft"]).default("active"),
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
