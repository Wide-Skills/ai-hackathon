import { Applicant } from "@ai-hackathon/db";
import { ApplicantSchema, CreateApplicantSchema } from "@ai-hackathon/shared";
import { z } from "zod";
import { ensureJobExists, syncJobMetrics } from "../router-helpers/job-metrics";
import { serializeApplicant } from "../serializers";
import { protectedProcedure, router } from "../trpc";

export const applicantRouter = router({
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
