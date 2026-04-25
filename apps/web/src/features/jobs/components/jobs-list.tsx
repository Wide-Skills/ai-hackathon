"use client";

import { RiLayoutGridLine, RiListCheck, RiSearch2Line } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  QueryEmptyState,
  QueryErrorState,
} from "@/components/data/query-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/utils/trpc";
import { JobCard } from "./job-card";
import { JobsTable } from "./jobs-table";

export function JobsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [view, setView] = useState<"grid" | "table">("grid");

  const jobsQuery = useQuery(trpc.jobs.list.queryOptions());
  const jobs = jobsQuery.data ?? [];

  if (jobsQuery.isLoading) {
    return (
      <div className="w-full animate-pulse space-y-12">
        <div className="h-10 w-full rounded-standard bg-bg2" />
        <div className="space-y-base">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-standard bg-bg2" />
          ))}
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

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.department?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-section-padding pb-section-padding">
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-base border-line border-b pb-section-gap">
        <div className="relative min-w-[320px] flex-1">
          <div className="group flex h-10 items-center gap-3 rounded-standard border border-line bg-bg2/40 px-3.5 transition-all focus-within:border-primary/20 focus-within:bg-surface">
            <RiSearch2Line className="size-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search active pipelines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent font-normal font-sans text-[13px] outline-none placeholder:text-ink-faint"
            />
          </div>
        </div>

        <div className="flex items-center gap-base">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "grid" | "table")}
            className="hidden sm:block"
          >
            <TabsList className="h-10 rounded-standard bg-bg2/50 p-1">
              <TabsTrigger
                value="grid"
                className="h-8 rounded-micro border-none px-3 data-[state=active]:bg-surface data-[state=active]:shadow-none"
              >
                <RiLayoutGridLine className="size-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="h-8 rounded-micro border-none px-3 data-[state=active]:bg-surface data-[state=active]:shadow-none"
              >
                <RiListCheck className="size-3.5" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val || "all")}
          >
            <SelectTrigger className="h-10 w-44 rounded-standard border-line bg-bg2/40 font-medium font-sans text-[11px] text-ink-muted uppercase tracking-[0.06em] shadow-none">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent className="border-line bg-surface shadow-none">
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Button>New Pipeline</Button>
        </div>
      </div>

      <section>
        <div className="mb-small flex items-center justify-between px-comfortable">
          <div className="flex items-center gap-base font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
            Active Jobs
          </div>
          <div className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
            {filtered.length} positions open
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 gap-comfortable">
            {filtered.length > 0 ? (
              filtered.map((job, i) => (
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
                title="No pipelines match the current filters"
                description="Adjust the search or create a new technical pipeline."
              />
            )}
          </div>
        ) : (
          <JobsTable data={filtered} />
        )}
      </section>
    </div>
  );
}
 );
}
