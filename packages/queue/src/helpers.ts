import { batchScreeningQueue, screeningQueue } from "./queues";

export async function enqueueScreening(params: {
  applicantId: string;
  jobId: string;
  triggeredByUserId: string;
  triggererEmail?: string;
  triggererName?: string;
}) {
  const job = await screeningQueue.add(`screen:${params.applicantId}`, params);
  return { jobId: job.id };
}

export async function enqueueBatchScreening(params: {
  applicantIds: string[];
  jobId: string;
  triggeredByUserId: string;
  triggererEmail?: string;
  triggererName?: string;
}) {
  const job = await batchScreeningQueue.add(
    `batch-screen:${params.jobId}`,
    params,
  );
  return { batchJobId: job.id };
}

export async function getBatchProgress(batchJobId: string) {
  const job = await batchScreeningQueue.getJob(batchJobId);

  if (!job) {
    return { status: "not_found", total: 0, completed: 0, failed: 0 };
  }

  const state = await job.getState();
  const progress = job.progress as
    | { total: number; completed: number; failed: number }
    | number
    | undefined;

  if (typeof progress === "object" && progress !== null) {
    return {
      status: state,
      total: progress.total || 0,
      completed: progress.completed || 0,
      failed: progress.failed || 0,
    };
  }

  // fallback for initial state or simple numeric progress
  const total = job.data.applicantIds?.length || 0;
  return {
    status: state,
    total,
    completed: state === "completed" ? total : 0,
    failed: state === "failed" ? total : 0, // simplified
  };
}
