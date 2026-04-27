import { connection } from "@ai-hackathon/queue";
import { Worker } from "bullmq";
import { runAIInternal } from "../routers/screening.router";

export interface ScreeningJobData {
  applicantId: string;
  jobId: string;
  triggeredByUserId: string;
  triggererEmail?: string;
  triggererName?: string;
}

export const screeningWorker = new Worker<ScreeningJobData>(
  "screening",
  async (job: any) => {
    console.log(
      `[Screening Worker] Starting job ${job.id} for applicant ${job.data.applicantId}`,
    );

    // We pass maxRetries: 1 because BullMQ handles retries for us.
    const result = await runAIInternal({
      ...job.data,
      maxRetries: 1,
      taskId: job.id,
    });

    console.log(
      `[Screening Worker] Completed job ${job.id} for applicant ${job.data.applicantId} with score ${result.matchScore}`,
    );

    return result;
  },
  {
    connection,
    concurrency: 2, // Configurable, limit to 2 to avoid Gemini rate limits
  },
);

screeningWorker.on("failed", (job: any, err: any) => {
  console.error(`[Screening Worker] Job ${job?.id} failed: ${err.message}`);
});
