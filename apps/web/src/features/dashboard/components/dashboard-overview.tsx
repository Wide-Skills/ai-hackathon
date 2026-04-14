"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BrainCircuit,
  Briefcase,
  CircleCheck as CheckCircle2,
  ChevronRight,
  Cpu,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";
import { ScoreBadge } from "./score-badge";
import { StatCard } from "./stat-card";

const activityConfig = {
  screened: {
    label: "Screened",
    color: "bg-primary/10 text-primary",
    icon: BrainCircuit,
  },
  applied: {
    label: "Applied",
    color: "bg-muted text-muted-foreground",
    icon: Users,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-success/10 text-success",
    icon: CheckCircle2,
  },
};

export function DashboardOverview() {
  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.jobs.stats.queryOptions(),
  );
  const { data: jobs, isLoading: jobsLoading } = useQuery(
    trpc.jobs.list.queryOptions(),
  );
  const { data: applicants, isLoading: appsLoading } = useQuery(
    trpc.applicants.list.queryOptions(),
  );

  const isLoading = statsLoading || jobsLoading || appsLoading;

  const topApplicants = applicants
    ? [...applicants]
        .filter((a) => a.screening)
        .sort(
          (a, b) =>
            (b.screening?.matchScore ?? 0) - (a.screening?.matchScore ?? 0),
        )
        .slice(0, 4)
    : [];

  const activeJobs = jobs
    ? jobs.filter((j) => j.status === "active").slice(0, 3)
    : [];

  // Real recent activity logic (or fallback to dummy for visual)
  const recentActivity = [
    {
      id: "1",
      type: "screened",
      candidate: "Alice",
      job: "Engineering",
      score: 95,
      time: "1h ago",
    },
  ];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 w-full rounded-xl lg:col-span-2" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active Jobs"
          value={stats?.openPositions || 0}
          sublabel="total positions"
          icon={Briefcase}
          color="bg-primary/10 text-primary"
          trend="+2 this week"
        />
        <StatCard
          label="Total Applicants"
          value={stats?.totalCandidates || 0}
          sublabel="across all positions"
          icon={Users}
          color="bg-muted text-muted-foreground"
          trend="+18 today"
        />
        <StatCard
          label="Screened Today"
          value={stats?.screenedToday || 0}
          sublabel="by AI automatically"
          icon={Cpu}
          color="bg-accent text-accent-foreground"
          trend="Real-time"
        />
        <StatCard
          label="Average Match"
          value={`${stats?.avgMatchScore || 0}%`}
          sublabel="overall avg score"
          icon={CheckCircle2}
          color="bg-success/10 text-success"
          trend="+5% this week"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-semibold text-base text-foreground">
                Top AI-Ranked Candidates
              </CardTitle>
              <Link
                href="/dashboard/applicants"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary/90"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topApplicants.map((applicant, idx) => (
                  <Link
                    key={applicant.id}
                    href={`/dashboard/applicants/${applicant.id}`}
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground text-xs">
                      {idx + 1}
                    </div>
                    {applicant.avatarUrl ? (
                      <img
                        src={applicant.avatarUrl}
                        alt=""
                        className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary font-bold text-sm text-primary-foreground">
                        {applicant.firstName[0]}
                        {applicant.lastName[0]}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-sm transition-colors group-hover:text-primary">
                        {applicant.firstName} {applicant.lastName}
                      </p>
                      <p className="truncate text-muted-foreground text-xs">
                        {applicant.headline}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      <ScoreBadge
                        score={applicant.screening?.matchScore ?? 0}
                      />
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 transition-colors group-hover:text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-semibold text-base text-foreground">
                Active Positions
              </CardTitle>
              <Link
                href="/dashboard/jobs"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary/90"
              >
                All jobs <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {activeJobs.map((job) => {
                  const pct =
                    job.applicantsCount > 0
                      ? Math.round(
                          (job.screenedCount / job.applicantsCount) * 100,
                        )
                      : 0;
                  return (
                    <Link
                      key={job.id}
                      href={"/dashboard/jobs"}
                      className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground text-sm transition-colors group-hover:text-primary">
                            {job.title}
                          </p>
                          <Badge
                            variant="outline"
                            className="border-success/20 bg-success/10 px-1.5 text-[10px] text-success"
                          >
                            {job.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {job.location} · {job.department}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-bold text-foreground text-sm">
                          {job.applicantsCount}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {pct}% screened
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold text-base text-foreground">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentActivity.map((item) => {
                  const config =
                    activityConfig[item.type as keyof typeof activityConfig];
                  const Icon = config.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 px-5 py-3.5"
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${config.color}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground/80 text-xs leading-snug">
                          <span className="font-semibold">
                            {item.candidate}
                          </span>{" "}
                          {config.label === "Applied"
                            ? "applied for"
                            : `${config.label.toLowerCase()} for`}{" "}
                          <span className="text-primary">{item.job}</span>
                        </p>
                        {item.score && (
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            Score:{" "}
                            <span className="font-semibold text-success">
                              {item.score}%
                            </span>
                          </p>
                        )}
                        <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-foreground text-background shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <p className="font-semibold text-sm text-background">
                  AI Summary
                </p>
              </div>
              <p className="text-background/80 text-xs leading-relaxed">
                Today&apos;s AI screening identified{" "}
                <span className="font-semibold text-background">
                  3 standout candidates
                </span>{" "}
                for the Backend Engineer role. Avg match score is{" "}
                <span className="font-semibold text-primary">81%</span> — 14
                points above your historical average.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Screened", value: "18" },
                  { label: "Avg Score", value: "81%" },
                  { label: "Top Match", value: "96%" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-bold text-lg text-background">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-background/50">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
