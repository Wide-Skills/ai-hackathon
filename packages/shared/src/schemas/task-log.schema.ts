import { z } from "zod";

export const TaskLogSchema = z.object({
  id: z.string().optional(),
  taskId: z.string(),
  jobId: z.string().optional(),
  applicantId: z.string().optional(),
  type: z.enum(["screening", "batch-screening", "extraction", "system"]),
  step: z.string(),
  message: z.string(),
  details: z.any().optional(),
  status: z.enum(["info", "success", "warning", "error"]),
  duration: z.number().optional(),
  createdAt: z.date().optional().or(z.string()),
});

export type TaskLog = z.infer<typeof TaskLogSchema>;
