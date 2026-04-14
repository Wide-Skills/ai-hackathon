import { Applicant } from "@ai-hackathon/db";
import { ApplicantSchema, CreateApplicantSchema } from "@ai-hackathon/shared";
import { z } from "zod";
import { protectedProcedure, router } from "../index.js";
import { serializeApplicant } from "../serializers.js";

export const applicantRouter = router({
  create: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/applicants",
        tags: ["applicants"],
        summary: "Create a new Applicant",
      },
    })
    .input(CreateApplicantSchema)
    .output(ApplicantSchema)
    .mutation(async ({ input }) => {
      const applicant = new Applicant(input);
      await applicant.save();
      return serializeApplicant(applicant);
    }),

  list: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/applicants",
        tags: ["applicants"],
        summary: "List all Applicants",
      },
    })
    .input(z.void())
    .output(z.array(ApplicantSchema))
    .query(async () => {
      const applicants = await Applicant.find().sort({ createdAt: -1 });
      return applicants.map(serializeApplicant);
    }),

  listByJob: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/applicants/job/{jobId}",
        tags: ["applicants"],
        summary: "List Applicants for a specific Job",
      },
    })
    .input(z.object({ jobId: z.string() }))
    .output(z.array(ApplicantSchema))
    .query(async ({ input }) => {
      const applicants = await Applicant.find({ jobId: input.jobId }).sort({
        createdAt: -1,
      });
      return applicants.map(serializeApplicant);
    }),

  getById: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/applicants/{id}",
        tags: ["applicants"],
        summary: "Get a specific Applicant",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(ApplicantSchema.nullable())
    .query(async ({ input }) => {
      const applicant = await Applicant.findById(input.id);
      return applicant ? serializeApplicant(applicant) : null;
    }),
});
