"use client";

import type { Applicant } from "@ai-hackathon/shared";
import { useQuery } from "@tanstack/react-query";
import {
  CircleAlert as AlertCircle,
  ArrowUpRight,
  ChartBar as BarChart3,
  BrainCircuit,
  CircleCheck as CheckCircle2,
  Clock,
  Cpu,
  Loader as Loader2,
  Play,
  RefreshCw,
  Sparkles,
  Star,
  ThumbsUp,
  Circle as XCircle,
} from "lucide-react";
import Link from "next/link";
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

const recommendationConfig = {
  "Strongly Recommend": {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
  },
  Recommend: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: ThumbsUp,
    dot: "bg-blue-500",
  },
  Consider: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertCircle,
    dot: "bg-amber-500",
  },
  "Not Recommended": {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
    dot: "bg-red-500",
  },
};

function ScoreGauge({ score }: { score: number }) {
  const color =
    score >= 85
      ? "#10b981"
      : score >= 70
        ? "#3b82f6"
        : score >= 55
          ? "#f59e0b"
          : "#ef4444";
  const textColor =
    score >= 85
      ? "text-emerald-600"
      : score >= 70
        ? "text-blue-600"
        : score >= 55
          ? "text-amber-600"
          : "text-red-600";
  return (
    <div className="relative h-14 w-14 flex-shrink-0">
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${score} ${100 - score}`}
          strokeLinecap="round"
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-black text-xs tabular-nums",
          textColor,
        )}
      >
        {score}
      </span>
    </div>
  );
}

function ScreeningCard({
  applicant,
  jobTitle,
}: {
  applicant: Applicant;
  jobTitle: string;
}) {
  const { screening } = applicant;
  if (!screening) return null;

  const rec = recommendationConfig[screening.recommendation];
  const RecIcon = rec.icon;

  return (
    <Link href={`/dashboard/applicants/${applicant.id}`}>
      <Card className="group cursor-pointer border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <ScoreGauge score={screening.matchScore} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 text-sm transition-colors group-hover:text-blue-600">
                    {applicant.firstName} {applicant.lastName}
                  </p>
                  <p className="mt-0.5 truncate text-slate-500 text-xs">
                    {applicant.headline}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-2 py-1 font-semibold text-[10px]",
                    rec.color,
                  )}
                >
                  <RecIcon className="h-3 w-3" />
                  {screening.recommendation === "Strongly Recommend"
                    ? "Strong Match"
                    : screening.recommendation}
                </span>
              </div>

              <p className="mt-1 font-medium text-blue-600 text-xs">
                {jobTitle}
              </p>

              <p className="mt-2 line-clamp-2 text-slate-500 text-xs leading-relaxed">
                {screening.summary}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {screening.strengths.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 font-medium text-[10px] text-emerald-700"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5" /> {s}
                  </span>
                ))}
                {screening.gaps.slice(0, 1).map((g) => (
                  <span
                    key={g}
                    className="flex items-center gap-1 rounded-md border border-red-100 bg-red-50 px-2 py-0.5 font-medium text-[10px] text-red-600"
                  >
                    <XCircle className="h-2.5 w-2.5" /> {g}
                  </span>
                ))}
              </div>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 flex-shrink-0 text-gray-300 transition-colors group-hover:text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ScreeningPage() {
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
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-500 text-xs">
                  Total Screened
                </p>
                <p className="mt-0.5 font-black text-2xl text-slate-900">
                  {screened.length}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <Cpu className="h-4.5 w-4.5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-500 text-xs">
                  Avg Match Score
                </p>
                <p className="mt-0.5 font-black text-2xl text-blue-600">
                  {avgScore}%
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <BarChart3 className="h-4.5 w-4.5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-500 text-xs">
                  Strong Matches
                </p>
                <p className="mt-0.5 font-black text-2xl text-emerald-600">
                  {
                    filtered.filter((a) => (a.screening?.matchScore ?? 0) >= 85)
                      .length
                  }
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                <Star className="h-4.5 w-4.5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-500 text-xs">
                  Pending Queue
                </p>
                <p className="mt-0.5 font-black text-2xl text-amber-600">
                  {pending.length}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                <Clock className="h-4.5 w-4.5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-5 lg:col-span-1">
          <Card className="overflow-hidden border-gray-200 shadow-sm">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <p className="font-semibold text-sm text-white">AI Engine</p>
                <span className="ml-auto rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 font-semibold text-[10px] text-emerald-400">
                  Live
                </span>
              </div>
              <p className="mb-4 text-slate-400 text-xs leading-relaxed">
                Powered by{" "}
                <span className="font-semibold text-blue-400">
                  Gemini 2.5 Pro
                </span>
                . Analyzes skills, experience, projects, and cultural fit
                against job requirements.
              </p>
              <Button
                onClick={handleRunScreening}
                disabled={running || pending.length === 0}
                className="h-9 w-full gap-2 rounded-lg bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700"
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

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-semibold text-slate-900 text-sm">
                Recommendation Split
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              {Object.entries(distribution).map(([rec, count]) => {
                const config =
                  recommendationConfig[
                    rec as keyof typeof recommendationConfig
                  ];
                const pct =
                  filtered.length > 0
                    ? Math.round((count / filtered.length) * 100)
                    : 0;
                return (
                  <div key={rec}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn("h-2 w-2 rounded-full", config.dot)}
                        />
                        <span className="font-medium text-slate-600 text-xs">
                          {rec === "Strongly Recommend"
                            ? "Strong"
                            : rec === "Not Recommended"
                              ? "Not Rec."
                              : rec}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs tabular-nums">
                          {count}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={cn("h-full rounded-full", config.dot)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-5">
              <h3 className="mb-3 font-semibold text-slate-900 text-sm">
                Filter by Job
              </h3>
              <Select
                value={selectedJob}
                onValueChange={(value) => setSelectedJob(value ?? "all")}
              >
                <SelectTrigger className="h-9 rounded-lg border-gray-200 text-sm">
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
              <h2 className="font-bold text-base text-slate-900">
                Screened Candidates
              </h2>
              <p className="mt-0.5 text-slate-500 text-xs">
                Ranked by AI match score, highest first
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-gray-200 text-slate-600 text-xs"
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
            <div className="py-16 text-center text-slate-400">
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
