import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../index.js";
import { Job } from "@ai-hackathon/db";

export const jobRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        department: z.string().optional(),
        requirements: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const job = new Job(input);
      await job.save();
      return job;
    }),

  list: protectedProcedure.query(async () => {
    return Job.find().sort({ createdAt: -1 });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return Job.findById(input.id);
    }),
});
