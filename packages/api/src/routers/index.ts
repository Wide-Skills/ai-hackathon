import { batchScreeningQueue, screeningQueue } from "@ai-hackathon/queue";
import mongoose from "mongoose";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { applicantRouter } from "./applicant.router";
import { jobRouter } from "./job.router";
import { screeningRouter } from "./screening.router";
import { systemRouter } from "./system.router";

export const appRouter = router({
  healthCheck: publicProcedure.query(async () => {
    const dbStatus = mongoose.connection.readyState;
    const dbLabels = [
      "disconnected",
      "connected",
      "connecting",
      "disconnecting",
    ];

    let queueStatus = "unknown";
    try {
      const [sClient, bClient] = await Promise.all([
        screeningQueue.client,
        batchScreeningQueue.client,
      ]);
      const screeningStatus = sClient.status;
      const batchStatus = bClient.status;
      queueStatus = `Screening: ${screeningStatus}, Batch: ${batchStatus}`;
    } catch (_e) {
      queueStatus = "error connecting to redis";
    }

    return {
      status: dbStatus === 1 ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbLabels[dbStatus] || "unknown",
        connected: dbStatus === 1,
      },
      queues: {
        status: queueStatus,
      },
      system: {
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version,
      },
    };
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  jobs: jobRouter,
  applicants: applicantRouter,
  screenings: screeningRouter,
  system: systemRouter,
});
export type AppRouter = typeof appRouter;
