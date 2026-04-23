"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCreateModalOpen } from "@/store/slices/jobsSlice";
import { trpc } from "@/utils/trpc";
import { JobCard } from "./job-card";
import { motion } from "framer-motion";

export function JobsList() {
  const dispatch = useDispatch();
  const { data: jobs, isLoading } = useQuery(trpc.jobs.list.queryOptions());

  if (isLoading) {
    return (
      <div className="w-full space-y-12 animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-lg bg-secondary/30" />
          ))}
        </div>
      </div>
    );
  }

  const activeJobs = jobs?.filter((j) => j.status === "active") ?? [];
  const otherJobs = jobs?.filter((j) => j.status !== "active") ?? [];

  return (
    <div className="w-full space-y-16 pb-20">
      <section>
        <div className="mb-8 flex items-end justify-between border-b border-border/50 pb-8 px-2">
          <div>
            <h2 className="font-display text-display-section font-light text-foreground uppercase tracking-[0.1em]">Active Pipelines</h2>
            <p className="text-[13px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">Managing {activeJobs.length} open roles</p>
          </div>
          <button 
            onClick={() => dispatch(setCreateModalOpen(true))}
            className="flex h-11 px-8 rounded-full bg-primary text-primary-foreground text-[12px] font-bold uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Job
          </button>
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
            <div className="flex py-24 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/5">
               <p className="text-[13px] text-muted-foreground font-medium uppercase tracking-widest">No active pipelines found</p>
            </div>
          )}
        </div>
      </section>

      {otherJobs.length > 0 && (
        <section>
          <div className="mb-8 border-b border-border/50 pb-8 px-2">
            <h2 className="font-display text-[20px] font-light text-foreground uppercase tracking-[0.1em] opacity-60">Archive</h2>
            <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-wider opacity-60">Completed and draft positions</p>
          </div>
          <div className="grid grid-cols-1 gap-4 opacity-50 grayscale-[50%] hover:grayscale-0 transition-all">
            {otherJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
