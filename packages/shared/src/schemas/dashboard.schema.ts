import { z } from "zod";

export const DashboardStatsSchema = z.object({
  totalCandidates: z.number(),
  screenedToday: z.number(),
  avgMatchScore: z.number(),
  openPositions: z.number(),
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
