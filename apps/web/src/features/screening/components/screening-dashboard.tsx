"use client";

import { RiBrainLine, RiLoader2Line, RiRefreshLine } from "@remixicon/react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { motion } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  QueryEmptyState,
  QueryErrorState,
} from "@/components/data/query-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { cn } from "@/lib/utils";
import { invalidateHiringData, trpc, trpcClient } from "@/utils/trpc";
import { ScreeningCard } from "./screening-card";

export function ScreeningDashboard() {
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const applicantsQuery = useQuery({
    ...trpc.applicants.list.queryOptions({ page: 1, limit: 100 }),
    placeholderData: keepPreviousData,
  });

  const jobsQuery = useQuery({
    ...trpc.jobs.list.queryOptions({ page: 1, limit: 100 }),
    placeholderData: keepPreviousData,
  });

  const batchScreenMutation = useMutation(
    trpc.screenings.batchGenerate.mutationOptions(),
  );

  const applicants = applicantsQuery.data?.items ?? [];
  const jobs = jobsQuery.data?.items ?? [];

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

    // Group applicants by jobId if we are screening "all" jobs, because batchGenerate takes a single jobId
    // To simplify, we will just use the first pending's jobId if "all" is selected
    // Note: The ideal solution would group and spawn multiple batches, but here we'll just batch per job
    const groupedByJob = pendingToScreen.reduce(
      (acc, a) => {
        acc[a.jobId] = acc[a.jobId] || [];
        acc[a.jobId].push(a.id);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    setRunning(true);
    setProgress(0);

    let totalCompleted = 0;
    let totalFailed = 0;
    const totalToScreen = pendingToScreen.length;

    try {
      for (const [jobId, applicantIds] of Object.entries(groupedByJob)) {
        const { batchJobId } = await batchScreenMutation.mutateAsync({
          jobId,
          applicantIds,
        });

        let done = false;
        while (!done) {
          // Poll every 2 seconds
          await new Promise((resolve) => setTimeout(resolve, 2000));

          try {
            // We use the TRPC client directly for polling inside the async function
            const state = await trpcClient.screenings.getBatchProgress.query({
              batchJobId,
            });

            const currentProgress = Math.round(
              ((totalCompleted + state.completed + state.failed) /
                totalToScreen) *
                100,
            );
            setProgress(currentProgress);

            if (state.status === "completed" || state.status === "failed") {
              totalCompleted += state.completed;
              totalFailed += state.failed;
              done = true;
            }
          } catch (e) {
            console.error("Polling failed", e);
            // Optionally break or retry
          }
        }
      }

      await invalidateHiringData(queryClient);

      if (totalFailed > 0) {
        toast.warning(
          `Screening finished. ${totalCompleted} succeeded, ${totalFailed} failed.`,
        );
      } else {
        toast.success(
          `AI screening complete! Analyzed ${totalCompleted} candidates.`,
        );
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to start batch screening.");
    } finally {
      setRunning(false);
      setProgress(0);
    }
  };

  const isLoading =
    (applicantsQuery.isPending && !applicantsQuery.data) ||
    (jobsQuery.isPending && !jobsQuery.data);

  if (isLoading) {
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
    <div className="w-full space-y-section-padding pb-section-padding">
      {/* Top Metrics row */}
      <div className="grid grid-cols-1 gap-comfortable sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Screened"
          value={screened.length}
          sublabel="Total Screened"
          trend="+15%"
        />
        <StatCard
          label="Avg Match"
          value={`${avgScore}%`}
          sublabel="Average match score"
          trend="+2%"
        />
        <StatCard
          label="Shortlisted"
          value={
            filtered.filter((a) => (a.screening?.matchScore ?? 0) >= 85).length
          }
          sublabel="Top quality matches"
          trend="+8%"
        />
        <StatCard
          label="Queue"
          value={pending.length}
          sublabel="Waiting to be screened"
          trend="-12%"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-comfortable lg:grid-cols-4">
        {/* Control Sidebar */}
        <div className="space-y-comfortable lg:col-span-1">
          {/* Engine Card */}
          <Card variant="default" size="none" className="overflow-hidden">
            <CardHeader>
              <CardDescription>Analysis</CardDescription>
              <CardTitle>Screening Engine</CardTitle>
            </CardHeader>

            <div className="space-y-comfortable p-comfortable">
              <p className="font-light font-sans text-[13px] text-ink-muted leading-relaxed">
                AI screening analysis powered by Gemini AI.
              </p>

              <Button
                onClick={handleRunScreening}
                disabled={running || pending.length === 0}
                variant="default"
                size="default"
                className="h-10 w-full"
              >
                {running ? (
                  <>
                    <RiLoader2Line className="mr-2 h-3.5 w-3.5 animate-spin" />{" "}
                    {progress > 0 ? `${progress}%` : "Analyzing..."}
                  </>
                ) : (
                  "Run AI Screening"
                )}
              </Button>

              <Link href={"/dashboard/ai-tasks" as Route} className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-full gap-base rounded-standard border-line font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider"
                >
                  <RiBrainLine className="size-3.5" />
                  System Health
                </Button>
              </Link>

              {running && (
                <div className="h-1 w-full overflow-hidden rounded-pill bg-bg-deep">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Distribution Card */}
          <Card variant="default" size="none" className="overflow-hidden">
            <CardHeader>
              <CardDescription>Metrics</CardDescription>
              <CardTitle>Match Ranges</CardTitle>
            </CardHeader>
            <div className="space-y-base bg-bg-alt/10 p-comfortable">
              {Object.entries(distribution).map(([rec, count]) => {
                const colors: Record<string, string> = {
                  "Strongly Recommend": "bg-status-success-text",
                  Recommend: "bg-primary/60",
                  Consider: "bg-status-warning-text",
                  "Not Recommended": "bg-status-error-text",
                };
                const pct =
                  filtered.length > 0
                    ? Math.round((count / filtered.length) * 100)
                    : 0;
                return (
                  <div key={rec} className="space-y-2">
                    <div className="flex items-center justify-between font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                      <span>{rec.split(" ")[0]}</span>
                      <span className="text-primary">{count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-pill bg-bg-deep">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          colors[rec],
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Filter Card */}
          <Card variant="default" size="none" className="overflow-hidden">
            <CardHeader>
              <CardDescription>Filter</CardDescription>
              <CardTitle>Select Job</CardTitle>
            </CardHeader>
            <div className="p-comfortable">
              <Select
                value={selectedJob}
                onValueChange={(value) => setSelectedJob(value ?? "all")}
              >
                <SelectTrigger className="h-10 w-full rounded-standard border-line bg-bg2 font-medium font-sans text-[12px] text-primary shadow-none transition-all">
                  <SelectValue placeholder="All Jobs">
                    {selectedJob === "all"
                      ? "All Jobs"
                      : jobs.find((j) => j.id === selectedJob)?.title}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="border-line bg-surface shadow-none">
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-section-gap flex items-end justify-between border-line border-b pb-base">
            <div>
              <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
                Analysis
              </span>
              <h2 className="font-serif text-[32px] text-primary leading-tight">
                Screening Results
              </h2>
            </div>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: [["applicants"]] })
              }
              className="flex h-9 w-9 items-center justify-center rounded-standard border border-line bg-surface text-ink-faint transition-all hover:bg-bg2 active:scale-[0.95]"
            >
              <RiRefreshLine className="h-4 w-4" />
            </button>
          </div>

          <div>
            <div className="flex flex-col gap-base">
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
