import { z } from "zod";

export const PaginationInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  status: z.string().optional(),
  jobId: z.string().optional(),
});

export type PaginationInput = z.infer<typeof PaginationInputSchema>;

export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(
  schema: T,
) {
  return z.object({
    items: z.array(schema),
    totalCount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    hasMore: z.boolean(),
  });
}
