"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { RootState } from "@/store";
import { setSearchKeyword } from "@/store/slices/jobsSlice";
import { trpc } from "@/utils/trpc";
import { JobCard } from "./job-card";

const tabs = ["All", "Active", "Draft", "Closed"] as const;

export function JobsList() {
  const dispatch = useDispatch();
  const search = useSelector((state: RootState) => state.jobs.searchKeyword);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const { data: jobs, isLoading } = useQuery(trpc.jobs.list.queryOptions());

  const jobsList = jobs || [];

  const filtered = jobsList.filter((j) => {
    const matchesTab =
      activeTab === "All" || j.status === activeTab.toLowerCase();
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.department ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    All: jobsList.length,
    Active: jobsList.filter((j) => j.status === "active").length,
    Draft: jobsList.filter((j) => j.status === "draft").length,
    Closed: jobsList.filter((j) => j.status === "closed").length,
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-foreground p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-2 font-medium text-sm transition-all",
                activeTab === tab
                  ? "bg-foreground text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground/80",
              )}
            >
              {tab}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-bold text-[10px]",
                  activeTab === tab
                    ? "bg-foreground/20 text-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
              className="h-9 w-52 rounded-lg border-border bg-foreground pl-9 text-sm focus-visible:ring-primary"
            />
          </div>
          <Button
            size="sm"
            className="h-9 gap-1.5 rounded-lg bg-primary font-semibold text-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground/70">
          <Plus className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="font-medium">No jobs found</p>
          <p className="mt-1 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
