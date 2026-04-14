import { z } from "zod";

export const ScreeningRecommendationSchema = z.enum([
  "Strongly Recommend",
  "Recommend",
  "Consider",
  "Not Recommended",
]);

export const ScreeningSkillBreakdownSchema = z.object({
  skill: z.string(),
  score: z.number(),
});

export const ScreeningResultSchema = z.object({
  id: z.string().optional(),
  applicantId: z.string(),
  jobId: z.string(),
  matchScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendation: ScreeningRecommendationSchema,
  summary: z.string().optional(),
  skillBreakdown: z.array(ScreeningSkillBreakdownSchema).default([]),
  createdAt: z.date().optional().or(z.string()),
  updatedAt: z.date().optional().or(z.string()),
});

export type ScreeningResult = z.infer<typeof ScreeningResultSchema>;
export type ScreeningRecommendation = z.infer<
  typeof ScreeningRecommendationSchema
>;
