"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  QueryEmptyState,
  QueryErrorState,
} from "@/components/data/query-state";
import { trpc } from "@/utils/trpc";
import { JobCard } from "./job-card";

export function JobsList() {
  const _router = useRouter();
  const jobsQuery = useQuery(trpc.jobs.list.queryOptions());
  const jobs = jobsQuery.data;

  if (jobsQuery.isLoading) {
    return (
      <div className="w-full space-y-16 pb-20">
        <div className="space-y-6">
          <div className="flex items-end justify-between border-border/20 border-b px-2 pb-10">
            <div className="space-y-3">
              <div className="h-8 w-64 animate-pulse rounded-lg bg-secondary/30" />
              <div className="h-4 w-32 animate-pulse rounded-md bg-secondary/20" />
            </div>
            <div className="h-11 w-40 animate-pulse rounded-pill bg-secondary/30" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[300px] animate-pulse rounded-section border border-border/10 bg-secondary/5"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (jobsQuery.isError) {
    return (
      <QueryErrorState
        error={jobsQuery.error}
        title="Jobs couldn't be loaded"
        onRetry={() => jobsQuery.refetch()}
      />
    );
  }

  const activeJobs = jobs?.filter((j) => j.status === "active") ?? [];
  const otherJobs = jobs?.filter((j) => j.status !== "active") ?? [];

  return (
    <div className="w-full space-y-16 pb-20">
      <section>
        <div className="mb-10 flex items-end justify-between border-border/20 border-b px-2 pb-10">
          <div>
            <h2 className="font-display font-light text-display-section text-foreground uppercase tracking-[0.1em]">
              Active Pipelines
            </h2>
            <p className="mt-1 font-bold text-[12px] text-muted-foreground/30 uppercase tracking-widest">
              {activeJobs.length} open roles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {activeJobs.length > 0 ? (
            activeJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))
          ) : (
            <QueryEmptyState
              title="No active pipelines found"
              description="Create a job to start receiving applicants and screening results."
            />
          )}
        </div>
      </section>

      {otherJobs.length > 0 && (
        <section>
          <div className="mb-10 border-border/20 border-b px-2 pb-10">
            <h2 className="font-display font-light text-[20px] text-foreground uppercase tracking-[0.1em] opacity-40">
              Archive
            </h2>
            <p className="mt-1 font-bold text-[11px] text-muted-foreground/20 uppercase tracking-widest">
              {otherJobs.length} positions
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 opacity-40 grayscale-[80%] transition-all duration-500 hover:grayscale-0">
            {otherJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
