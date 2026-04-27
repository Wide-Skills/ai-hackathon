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

    // We update progress to 0 initially
    await job.updateProgress({
      total: applicantIds.length,
      completed: 0,
      failed: 0,
    });

    // Add all child jobs to the screening queue
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

    // Wait for all child jobs to complete
    let completed = 0;
    let failed = 0;

    // We could use BullMQ Flow to track this automatically,
    // but for simplicity we will poll the child jobs' state until they are all done.
    const childJobIds = childJobs.map((j) => j.id!);

    while (completed + failed < childJobIds.length) {
      // Sleep for a bit
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
    concurrency: 1, // Process one batch at a time
  },
);

batchScreeningWorker.on("failed", (job: any, err: any) => {
  console.error(
    `[Batch Screening Worker] Job ${job?.id} failed: ${err.message}`,
  );
});
