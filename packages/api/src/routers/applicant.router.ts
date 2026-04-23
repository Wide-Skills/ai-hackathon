import { Applicant } from "@ai-hackathon/db";
import { sendApplicationReceivedEmail } from "@ai-hackathon/auth/email";
import { ApplicantSchema, CreateApplicantSchema } from "@ai-hackathon/shared";
import { z } from "zod";
import { ensureJobExists, syncJobMetrics } from "../router-helpers/job-metrics";
import { serializeApplicant } from "../serializers";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { runAIInternal, SYSTEM_USER_ID } from "./screening.router";

export const applicantRouter = router({
  publicApply: publicProcedure
    .input(CreateApplicantSchema)
    .output(ApplicantSchema)
    .mutation(async ({ input }) => {
      const job = await ensureJobExists(input.jobId);

      const applicant = new Applicant({
        ...input,
        name: `${input.firstName} ${input.lastName}`,
        appliedAt: new Date().toISOString(),
      });
      await applicant.save();
      await syncJobMetrics(input.jobId);

      // 1. Send confirmation email (non-blocking)
      sendApplicationReceivedEmail({
        email: input.email,
        firstName: input.firstName,
        jobTitle: job.title,
      }).catch((err) => console.error("Email error:", err));

      // 2. Trigger AI screening automatically (non-blocking)
      // Note: We don't have a specific recruiter email here, 
      // but runAIInternal will skip email if triggererEmail is missing.
      runAIInternal({
        applicantId: applicant.id,
        jobId: job.id,
        triggeredByUserId: SYSTEM_USER_ID,
      }).catch((err) => console.error("Auto-screening error:", err));

      return serializeApplicant(applicant);
    }),

  create: protectedProcedure
    .input(CreateApplicantSchema)
    .output(ApplicantSchema)
    .mutation(async ({ input, ctx }) => {
      await ensureJobExists(input.jobId);

      const applicant = new Applicant({
        ...input,
        userId: ctx.session.user.id,
        name: `${input.firstName} ${input.lastName}`,
        appliedAt: new Date().toISOString(),
      });
      await applicant.save();
      await syncJobMetrics(input.jobId);
      return serializeApplicant(applicant);
    }),

  list: protectedProcedure
    .input(z.void())
    .output(z.array(ApplicantSchema))
    .query(async () => {
      const applicants = await Applicant.find().sort({ createdAt: -1 });
      return applicants.map(serializeApplicant);
    }),

  listByJob: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .output(z.array(ApplicantSchema))
    .query(async ({ input }) => {
      const applicants = await Applicant.find({ jobId: input.jobId }).sort({
        createdAt: -1,
      });
      return applicants.map(serializeApplicant);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(ApplicantSchema.nullable())
    .query(async ({ input }) => {
      const applicant = await Applicant.findById(input.id);
      return applicant ? serializeApplicant(applicant) : null;
    }),
});
