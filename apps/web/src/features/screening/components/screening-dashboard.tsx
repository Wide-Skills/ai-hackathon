"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  QueryEmptyState,
  QueryErrorState,
} from "@/components/data/query-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { cn } from "@/lib/utils";
import { invalidateHiringData, trpc } from "@/utils/trpc";
import { ScreeningCard } from "./screening-card";

export function ScreeningDashboard() {
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const applicantsQuery = useQuery(trpc.applicants.list.queryOptions());
  const jobsQuery = useQuery(trpc.jobs.list.queryOptions());

  const screenMutation = useMutation(
    trpc.screenings.generate.mutationOptions(),
  );

  const applicants = applicantsQuery.data ?? [];
  const jobs = jobsQuery.data ?? [];

  const screened = applicants.filter((a) => a.screening);
  const pending = applicants.filter((a) => !a.screening);

  const filtered = screened
    .filter((a) => selectedJob === "all" || a.jobId === selectedJob)
    .sort(
      (a, b) => (b.screening?.matchScore ?? 0) - (a.screening?.matchScore ?? 0),
    );

  const avgScore = Math.round(
    filtered.reduce((acc, a) => acc + (a.screening?.matchScore ?? 0), 0) /
      (filtered.length || 1),
  );

  const distribution = {
    "Strongly Recommend": filtered.filter(
      (a) => a.screening?.recommendation === "Strongly Recommend",
    ).length,
    Recommend: filtered.filter(
      (a) => a.screening?.recommendation === "Recommend",
    ).length,
    Consider: filtered.filter((a) => a.screening?.recommendation === "Consider")
      .length,
    "Not Recommended": filtered.filter(
      (a) => a.screening?.recommendation === "Not Recommended",
    ).length,
  };

  const handleRunScreening = async () => {
    const pendingToScreen =
      selectedJob === "all"
        ? pending
        : pending.filter((a) => a.jobId === selectedJob);
    if (pendingToScreen.length === 0) {
      toast.info("No pending candidates to screen.");
      return;
    }
    setRunning(true);
    setProgress(0);
    let completed = 0;
    const errors: string[] = [];
    for (const applicant of pendingToScreen) {
      try {
        await screenMutation.mutateAsync({
          applicantId: applicant.id,
          jobId: applicant.jobId,
        });
        completed++;
        setProgress(Math.round((completed / pendingToScreen.length) * 100));
      } catch {
        errors.push(`${applicant.firstName} ${applicant.lastName}`);
      }
    }
    await invalidateHiringData(queryClient);
    setRunning(false);
    setProgress(0);
    if (errors.length > 0) {
      toast.warning(
        `Screened ${completed} candidates. ${errors.length} failed.`,
      );
    } else {
      toast.success(`AI screening complete! Analyzed ${completed} candidates.`);
    }
  };

  if (applicantsQuery.isLoading || jobsQuery.isLoading) {
    return (
      <div className="w-full animate-pulse space-y-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-secondary/30" />
          ))}
        </div>
        <div className="h-[600px] w-full rounded-xl bg-secondary/30" />
      </div>
    );
  }

  if (applicantsQuery.isError) {
    return (
      <QueryErrorState
        error={applicantsQuery.error}
        title="Screening data couldn't be loaded"
        onRetry={() => applicantsQuery.refetch()}
      />
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

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Top Metrics row */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <StatCard
          label="Total Screened"
          value={screened.length}
          sublabel="Analysis throughput"
          trend="+15%"
        />
        <StatCard
          label="Avg Match"
          value={`${avgScore}%`}
          sublabel="Pool quality"
          trend="+2%"
        />
        <StatCard
          label="Shortlisted"
          value={
            filtered.filter((a) => (a.screening?.matchScore ?? 0) >= 85).length
          }
          sublabel="Top tier matches"
          trend="+8%"
        />
        <StatCard
          label="Queue"
          value={pending.length}
          sublabel="Awaiting review"
          trend="-12%"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-4">
        {/* Control Sidebar */}
        <div className="space-y-10 lg:col-span-1">
          <div className="group overflow-hidden rounded-3xl border border-border/50 bg-background shadow-lg transition-all hover:shadow-xl">
            <div className="flex items-center justify-between border-border/20 border-b bg-secondary/[0.02] px-8 py-5">
              <h3 className="font-display font-light text-[15px] text-foreground uppercase tracking-[0.1em]">
                Engine
              </h3>
            </div>
            <div className="p-8">
              <p className="mb-10 font-medium text-[13px] text-muted-foreground/50 leading-relaxed tracking-tight">
                Neural architecture analysis powered by Gemini 1.5 Pro.
              </p>

              <Button
                onClick={handleRunScreening}
                disabled={running || pending.length === 0}
                variant="default"
                size="xl"
                className="w-full shadow-lg"
              >
                {running ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> {progress}%
                  </>
                ) : (
                  "Initiate Analysis"
                )}
              </Button>
              {running && (
                <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-secondary/50 shadow-inset">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border/50 bg-background shadow-lg">
            <div className="border-border/20 border-b bg-secondary/[0.02] px-8 py-5">
              <h3 className="font-display font-light text-[15px] text-foreground uppercase tracking-[0.1em]">
                Distribution
              </h3>
            </div>
            <div className="space-y-7 p-8">
              {Object.entries(distribution).map(([rec, count]) => {
                const colors: Record<string, string> = {
                  "Strongly Recommend": "bg-success/40",
                  Recommend: "bg-info/40",
                  Consider: "bg-warning/40",
                  "Not Recommended": "bg-destructive/40",
                };
                const pct =
                  filtered.length > 0
                    ? Math.round((count / filtered.length) * 100)
                    : 0;
                return (
                  <div key={rec} className="space-y-3">
                    <div className="flex items-center justify-between font-bold text-[10px] text-muted-foreground/50 uppercase tracking-[0.15em]">
                      <span>{rec.split(" ")[0]}</span>
                      <span className="text-foreground/70">{count}</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-secondary/50 shadow-inset">
                      <div
                        className={cn(
                          "h-full rounded-full shadow-md",
                          colors[rec],
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border/50 bg-background shadow-lg">
            <div className="border-border/20 border-b bg-secondary/[0.02] px-8 py-5">
              <h3 className="font-display font-light text-[15px] text-foreground uppercase tracking-[0.1em]">
                Pipeline
              </h3>
            </div>
            <div className="p-8">
              <Select
                value={selectedJob}
                onValueChange={(value) => setSelectedJob(value ?? "all")}
              >
                <SelectTrigger className="h-11 rounded-full border-border/50 bg-background font-bold text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] shadow-md">
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent className="border-border/50 shadow-lg">
                  <SelectItem value="all">All Pipelines</SelectItem>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-5 flex items-end justify-between border-border/20 border-b px-2 pb-10">
            <div>
              <h2 className="font-display font-light text-[24px] text-foreground uppercase tracking-[0.1em]">
                Screening Report
              </h2>
              <p className="mt-1 font-bold text-[12px] text-muted-foreground/30 uppercase tracking-widest">
                {filtered.length} experts analyzed
              </p>
            </div>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: [["applicants"]] })
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background text-muted-foreground/20 shadow-md transition-all hover:bg-secondary active:scale-[0.95]"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div>
            <div className="flex flex-col gap-4">
              {filtered.map((applicant) => {
                const job = jobs.find((j) => j.id === applicant.jobId);
                return (
                  <ScreeningCard
                    key={applicant.id}
                    applicant={applicant}
                    jobTitle={job?.title ?? ""}
                  />
                );
              })}
            </div>

            {filtered.length === 0 ? (
              <QueryEmptyState
                title="No screening results"
                description="Run the screening engine to evaluate pending candidates."
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
