"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BrainCircuit,
  Briefcase,
  ChevronRight,
  Cpu,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setCreateModalOpen } from "@/store/slices/jobsSlice";
import { trpc } from "@/utils/trpc";
import { ScoreBadge } from "./score-badge";
import { ScoreDistributionChart } from "./score-distribution-chart";
import { ScreeningTrendChart } from "./screening-trend-chart";
import { SkillsRadarChart } from "./skills-radar-chart";
import { StatCard } from "./stat-card";
import type { Route } from "next";

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
    icon: Sparkles,
  },
};

export function DashboardOverview() {
  const dispatch = useDispatch();
  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.jobs.stats.queryOptions(),
  );
  const { data: applicants, isLoading: appsLoading } = useQuery(
    trpc.applicants.list.queryOptions(),
  );
  const { data: jobs, isLoading: jobsLoading } = useQuery(
    trpc.jobs.list.queryOptions(),
  );

  if (statsLoading || appsLoading || jobsLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-96 rounded-2xl bg-muted lg:col-span-2" />
          <div className="h-96 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Candidates",
      value: stats?.totalCandidates ?? 0,
      trend: "+12% from last month",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Open Positions",
      value: stats?.openPositions ?? 0,
      trend: `${jobs?.filter((j) => j.status === "active").length} active`,
      icon: Sparkles,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Screened Today",
      value: stats?.screenedToday ?? 0,
      trend: "Across all pipelines",
      icon: Cpu,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Avg Match Score",
      value: `${stats?.avgMatchScore ?? 0}%`,
      trend: "Gemini 2.5 Analysis",
      icon: TrendingUp,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
  ];

  const topApplicants = (applicants ?? [])
    .filter((a) => a.screening)
    .sort(
      (a, b) => (b.screening?.matchScore ?? 0) - (a.screening?.matchScore ?? 0),
    )
    .slice(0, 5);

  const activeJobs = (jobs ?? [])
    .filter((j) => j.status === "active")
    .slice(0, 3);

  // Fallback / Placeholder for recent activity until backend provides real logs
  const recentActivity = topApplicants.slice(0, 3).map((a, i) => ({
    id: a.id,
    type: "screened",
    candidate: `${a.firstName} ${a.lastName}`,
    job: a.headline || "Engineering",
    score: a.screening?.matchScore,
    time: i === 0 ? "Just now" : `${i * 2}h ago`,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            label={stat.title}
            value={stat.value}
            sublabel={stat.trend}
            icon={stat.icon}
            color={`${stat.bg} ${stat.color}`}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Top Candidates Card */}
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-bold">Top AI-Ranked Candidates</CardTitle>
              <Link
                href="/dashboard/applicants"
                className="flex items-center gap-1 font-medium text-primary text-xs hover:text-primary/90"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topApplicants.map((applicant, idx) => (
                  <Link
                    key={applicant.id}
                    href={`/dashboard/applicants/${applicant.id}` as Route}
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
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
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary font-bold text-primary-foreground text-sm">
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

          {/* Active Positions Card */}
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
                      href={`/dashboard/jobs/${job.id}` as Route}
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
          {/* Recent Activity Card */}
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

          {/* AI Insights Card */}
          <Card className="border-border bg-foreground text-background shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <p className="font-semibold text-background text-sm">
                  AI Summary
                </p>
              </div>
              <p className="text-background/80 text-xs leading-relaxed">
                Today&apos;s AI screening identified{" "}
                <span className="font-semibold text-background">
                  {topApplicants.length} standout candidates
                </span>{" "}
                across your pipelines. Avg match score is{" "}
                <span className="font-semibold text-primary">
                  {stats?.avgMatchScore ?? 0}%
                </span>. AI processing is 100% complete for pending queue.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Screened", value: stats?.screenedToday ?? 0 },
                  { label: "Avg Score", value: `${stats?.avgMatchScore ?? 0}%` },
                  { label: "Top Match", value: `${topApplicants[0]?.screening?.matchScore ?? 0}%` },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-bold text-background text-lg">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-background/50">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                 <Button 
                   className="h-8 w-full bg-primary font-bold text-white text-xs"
                   onClick={() => dispatch(setCreateModalOpen(true))}
                 >
                   Post New Job
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <ScoreDistributionChart applicants={applicants ?? []} />
        <ScreeningTrendChart applicants={applicants ?? []} />
        <SkillsRadarChart applicants={applicants ?? []} />
      </div>
    </div>
  );
}
