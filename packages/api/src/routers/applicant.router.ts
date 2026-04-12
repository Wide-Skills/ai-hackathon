import { z } from "zod";
import { protectedProcedure, router } from "../index.js";
import { Applicant } from "@ai-hackathon/db";

export const applicantRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        jobId: z.string().min(1),
        name: z.string().min(1),
        email: z.string().email(),
        resumeText: z.string().optional(),
        resumeUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const applicant = new Applicant(input);
      await applicant.save();
      return applicant;
    }),

  listByJob: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ input }) => {
      return Applicant.find({ jobId: input.jobId }).sort({ createdAt: -1 });
    }),
    
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return Applicant.findById(input.id);
    }),
});
