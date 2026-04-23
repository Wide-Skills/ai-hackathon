import { Applicant, Job } from "@ai-hackathon/db";
import { TRPCError } from "@trpc/server";

export async function ensureJobExists(jobId: string) {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Job not found",
    });
  }

  return job;
}

export async function syncJobMetrics(jobId: string) {
  const [applicantsCount, screenedCount, shortlistedCount] = await Promise.all([
    Applicant.countDocuments({ jobId }),
    Applicant.countDocuments({
      jobId,
      screening: { $exists: true, $ne: null },
    }),
    Applicant.countDocuments({
      jobId,
      status: "shortlisted",
    }),
  ]);

  await Job.findByIdAndUpdate(jobId, {
    applicantsCount,
    screenedCount,
    shortlistedCount,
  });

  return {
    applicantsCount,
    screenedCount,
    shortlistedCount,
  };
}
