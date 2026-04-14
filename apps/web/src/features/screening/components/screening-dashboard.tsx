"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  BrainCircuit,
  Clock,
  Cpu,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { ScreeningCard } from "./screening-card";

export function ScreeningDashboard() {
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [running, setRunning] = useState(false);

  const { data: applicantsData, isLoading: appsLoading } = useQuery(
    trpc.applicants.list.queryOptions(),
  );
  const { data: jobsData, isLoading: jobsLoading } = useQuery(
    trpc.jobs.list.queryOptions(),
  );

  const applicants = applicantsData || [];
  const jobs = jobsData || [];

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
    setRunning(true);
    await new Promise((r) => setTimeout(r, 2000));
    setRunning(false);
    toast.success(
      `AI screening complete! Analyzed ${pending.length} candidates.`,
    );
  };

  if (appsLoading || jobsLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Total Screened
                </p>
                <p className="mt-0.5 font-black text-2xl text-foreground">
                  {screened.length}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Cpu className="h-4.5 w-4.5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Avg Match Score
                </p>
                <p className="mt-0.5 font-black text-2xl text-primary">
                  {avgScore}%
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <BarChart3 className="h-4.5 w-4.5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Strong Matches
                </p>
                <p className="mt-0.5 font-black text-2xl text-success">
                  {
                    filtered.filter((a) => (a.screening?.matchScore ?? 0) >= 85)
                      .length
                  }
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10">
                <Star className="h-4.5 w-4.5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-muted-foreground text-xs">
                  Pending Queue
                </p>
                <p className="mt-0.5 font-black text-2xl text-warning">
                  {pending.length}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10">
                <Clock className="h-4.5 w-4.5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-5 lg:col-span-1">
          <Card className="overflow-hidden border-border shadow-sm">
            <div className="bg-gradient-to-br from-foreground to-foreground/90 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary/70" />
                <p className="font-semibold text-sm text-white">AI Engine</p>
                <span className="ml-auto rounded-full border border-success/20 bg-success/10 px-2 py-0.5 font-semibold text-[10px] text-success/80">
                  Live
                </span>
              </div>
              <p className="mb-4 text-muted-foreground/70 text-xs leading-relaxed">
                Powered by{" "}
                <span className="font-semibold text-primary/70">
                  Gemini 2.5 Pro
                </span>
                . Analyzes skills, experience, projects, and cultural fit
                against job requirements.
              </p>
              <Button
                onClick={handleRunScreening}
                disabled={running || pending.length === 0}
                className="h-9 w-full gap-2 rounded-lg bg-primary font-semibold text-sm text-white hover:bg-primary/90"
              >
                {running ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Screening...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" /> Screen {pending.length} Pending
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-semibold text-foreground text-sm">
                Recommendation Split
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              {Object.entries(distribution).map(([rec, count]) => {
                const colors: Record<string, string> = {
                  "Strongly Recommend": "bg-success",
                  Recommend: "bg-primary",
                  Consider: "bg-warning",
                  "Not Recommended": "bg-destructive",
                };
                const dotColor = colors[rec] || "bg-muted-foreground";
                const pct =
                  filtered.length > 0
                    ? Math.round((count / filtered.length) * 100)
                    : 0;
                return (
                  <div key={rec}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn("h-2 w-2 rounded-full", dotColor)}
                        />
                        <span className="font-medium text-muted-foreground text-xs">
                          {rec === "Strongly Recommend"
                            ? "Strong"
                            : rec === "Not Recommended"
                              ? "Not Rec."
                              : rec}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground text-xs tabular-nums">
                          {count}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70">
                          ({pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full", dotColor)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="p-5">
              <h3 className="mb-3 font-semibold text-foreground text-sm">
                Filter by Job
              </h3>
              <Select
                value={selectedJob}
                onValueChange={(value) => setSelectedJob(value ?? "all")}
              >
                <SelectTrigger className="h-9 rounded-lg border-border text-sm">
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-foreground">
                Screened Candidates
              </h2>
              <p className="mt-0.5 text-muted-foreground text-xs">
                Ranked by AI match score, highest first
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-border text-muted-foreground text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>

          <div className="space-y-3">
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

          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground/70">
              <BrainCircuit className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p className="font-medium">No screened candidates</p>
              <p className="mt-1 text-sm">
                Run the AI screening engine to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
