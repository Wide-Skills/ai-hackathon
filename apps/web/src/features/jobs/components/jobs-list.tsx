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
      <div className="w-full space-y-16 pb-20">
        <div className="space-y-6">
          <div className="flex items-end justify-between border-b border-border/20 pb-10 px-2">
             <div className="space-y-3">
                <div className="h-8 w-64 bg-secondary/30 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-secondary/20 rounded-md animate-pulse" />
             </div>
             <div className="h-11 w-40 bg-secondary/30 rounded-pill animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[300px] rounded-section border border-border/10 bg-secondary/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeJobs = jobs?.filter((j) => j.status === "active") ?? [];
  const otherJobs = jobs?.filter((j) => j.status !== "active") ?? [];

  return (
    <div className="w-full space-y-16 pb-20">
      <section>
        <div className="mb-10 flex items-end justify-between border-b border-border/20 pb-10 px-2">
          <div>
            <h2 className="font-display text-display-section font-light text-foreground uppercase tracking-[0.1em]">Active Pipelines</h2>
            <p className="text-[12px] text-muted-foreground/30 font-bold mt-1 uppercase tracking-widest">{activeJobs.length} open roles</p>
          </div>
          <button 
            onClick={() => dispatch(setCreateModalOpen(true))}
            className="btn-pill-primary h-11 px-8 text-[12px] uppercase tracking-[0.2em] shadow-ethereal"
          >
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
            <div className="flex py-24 items-center justify-center rounded-section border border-dashed border-border/50 bg-secondary/5">
               <p className="text-[11px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">No active pipelines found</p>
            </div>
          )}
        </div>
      </section>

      {otherJobs.length > 0 && (
        <section>
          <div className="mb-10 border-b border-border/20 pb-10 px-2">
            <h2 className="font-display text-[20px] font-light text-foreground uppercase tracking-[0.1em] opacity-40">Archive</h2>
            <p className="text-[11px] text-muted-foreground/20 font-bold mt-1 uppercase tracking-widest">{otherJobs.length} positions</p>
          </div>
          <div className="grid grid-cols-1 gap-4 opacity-40 grayscale-[80%] hover:grayscale-0 transition-all duration-500">
            {otherJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
