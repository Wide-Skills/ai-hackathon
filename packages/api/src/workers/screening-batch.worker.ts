import { connection, screeningQueue } from "@ai-hackathon/queue";
import { Worker } from "bullmq";

export interface BatchScreeningJobData {
  applicantIds: string[];
  jobId: string;
  triggeredByUserId: string;
  triggererEmail?: string;
  triggererName?: string;
}

export const batchScreeningWorker = new Worker<BatchScreeningJobData>(
  "screening-batch",
  async (job: any) => {
    const {
      applicantIds,
      jobId,
      triggeredByUserId,
      triggererEmail,
      triggererName,
    } = job.data;

    console.log(
      `[Batch Screening] Starting batch job ${job.id} for ${applicantIds.length} applicants`,
    );

    await job.updateProgress({
      total: applicantIds.length,
      completed: 0,
      failed: 0,
    });

    const childJobs = await Promise.all(
      applicantIds.map((applicantId: string) =>
        screeningQueue.add(
          `screen:${applicantId}`,
          {
            applicantId,
            jobId,
            triggeredByUserId,
            triggererEmail,
            triggererName,
          },
          {
            parent: {
              id: job.id!,
              queue: job.queueQualifiedName,
            },
          },
        ),
      ),
    );

    let completed = 0;
    let failed = 0;

    const childJobIds = childJobs.map((j) => j.id!);

    while (completed + failed < childJobIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const states = await Promise.all(
        childJobIds.map((id) => screeningQueue.getJobState(id)),
      );

      completed = states.filter((s) => s === "completed").length;
      failed = states.filter((s) => s === "failed").length;

      await job.updateProgress({
        total: childJobIds.length,
        completed,
        failed,
      });
    }

    console.log(
      `[Batch Screening] Completed batch job ${job.id}: ${completed} succeeded, ${failed} failed`,
    );

    return {
      successCount: completed,
      failedCount: failed,
    };
  },
  {
    connection,
    concurrency: 1,
  },
);

batchScreeningWorker.on("failed", (job: any, err: any) => {
  console.error(
    `[Batch Screening Worker] Job ${job?.id} failed: ${err.message}`,
  );
});
