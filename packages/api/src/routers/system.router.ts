import { TaskLog } from "@ai-hackathon/db";
import {
  createPaginatedResponseSchema,
  PaginationInputSchema,
  TaskLogSchema,
} from "@ai-hackathon/shared";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const systemRouter = router({
  listTaskLogs: protectedProcedure
    .input(
      PaginationInputSchema.extend({
        taskId: z.string().optional(),
        type: z.string().optional(),
        jobId: z.string().optional(),
        applicantId: z.string().optional(),
      }).optional(),
    )
    .output(createPaginatedResponseSchema(TaskLogSchema))
    .query(async ({ input }) => {
      const {
        page = 1,
        limit = 20,
        taskId,
        type,
        jobId,
        applicantId,
      } = input || {};
      const skip = (page - 1) * limit;

      const query: any = {};
      if (taskId) query.taskId = taskId;
      if (type) query.type = type;
      if (jobId) query.jobId = jobId;
      if (applicantId) query.applicantId = applicantId;

      const [logs, totalCount] = await Promise.all([
        TaskLog.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        TaskLog.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        items: logs.map((log: any) => ({
          ...log,
          id: log._id.toString(),
          jobId: log.jobId?.toString(),
          applicantId: log.applicantId?.toString(),
        })),
        totalCount,
        totalPages,
        currentPage: page,
        hasMore: page < totalPages,
      };
    }),

  getQueueStats: protectedProcedure.query(async () => {
    // in a real production app we'd get actual bullmq stats here.
    // for now returning mock data.
    return {
      active: 0,
      waiting: 0,
      completed: 124,
      failed: 2,
    };
  }),
});
