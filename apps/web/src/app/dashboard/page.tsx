"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BrainCircuit,
  Briefcase,
  CircleCheck as CheckCircle2,
  ChevronRight,
  Cpu,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: string | number;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
}) {
  return (
    <Card className="border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-slate-500 text-sm">{label}</p>
            <p className="mt-1 font-bold text-3xl text-slate-900">{value}</p>
            <p className="mt-1 text-slate-400 text-xs">{sublabel}</p>
          </div>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1 border-gray-100 border-t pt-4">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-medium text-emerald-600 text-xs">
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : score >= 70
        ? "text-blue-700 bg-blue-50 border-blue-200"
        : score >= 55
          ? "text-amber-700 bg-amber-50 border-amber-200"
          : "text-red-700 bg-red-50 border-red-200";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-bold text-xs ${color}`}
    >
      <Star className="h-3 w-3" />
      {score}%
    </span>
  );
}

const activityConfig = {
  screened: {
    label: "Screened",
    color: "bg-blue-50 text-blue-600",
    icon: BrainCircuit,
  },
  applied: {
    label: "Applied",
    color: "bg-slate-50 text-slate-600",
    icon: Users,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle2,
  },
};

export default function DashboardPage() {
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
          color="bg-blue-50 text-blue-600"
          trend="+2 this week"
        />
        <StatCard
          label="Total Applicants"
          value={stats?.totalCandidates || 0}
          sublabel="across all positions"
          icon={Users}
          color="bg-slate-100 text-slate-600"
          trend="+18 today"
        />
        <StatCard
          label="Screened Today"
          value={stats?.screenedToday || 0}
          sublabel="by AI automatically"
          icon={Cpu}
          color="bg-violet-50 text-violet-600"
          trend="Real-time"
        />
        <StatCard
          label="Average Match"
          value={`${stats?.avgMatchScore || 0}%`}
          sublabel="overall avg score"
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-600"
          trend="+5% this week"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-semibold text-base text-slate-900">
                Top AI-Ranked Candidates
              </CardTitle>
              <Link
                href="/dashboard/applicants"
                className="flex items-center gap-1 font-medium text-blue-600 text-sm hover:text-blue-700"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {topApplicants.map((applicant, idx) => (
                  <Link
                    key={applicant.id}
                    href={`/dashboard/applicants/${applicant.id}`}
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-500 text-xs">
                      {idx + 1}
                    </div>
                    {applicant.avatarUrl ? (
                      <img
                        src={applicant.avatarUrl}
                        alt=""
                        className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 font-bold text-sm text-white">
                        {applicant.firstName[0]}
                        {applicant.lastName[0]}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 text-sm transition-colors group-hover:text-blue-600">
                        {applicant.firstName} {applicant.lastName}
                      </p>
                      <p className="truncate text-slate-500 text-xs">
                        {applicant.headline}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      <ScoreBadge score={applicant.screening?.matchScore ?? 0} />
                      <ArrowUpRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-blue-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-semibold text-base text-slate-900">
                Active Positions
              </CardTitle>
              <Link
                href="/dashboard/jobs"
                className="flex items-center gap-1 font-medium text-blue-600 text-sm hover:text-blue-700"
              >
                All jobs <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
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
                      className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 text-sm transition-colors group-hover:text-blue-600">
                            {job.title}
                          </p>
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 px-1.5 text-[10px] text-green-700"
                          >
                            {job.type}
                          </Badge>
                        </div>
                        <p className="text-slate-500 text-xs">
                          {job.location} · {job.department}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-bold text-slate-900 text-sm">
                          {job.applicantsCount}
                        </p>
                        <p className="text-[10px] text-slate-400">
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
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold text-base text-slate-900">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
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
                        <p className="font-medium text-slate-800 text-xs leading-snug">
                          <span className="font-semibold">
                            {item.candidate}
                          </span>{" "}
                          {config.label === "Applied"
                            ? "applied for"
                            : `${config.label.toLowerCase()} for`}{" "}
                          <span className="text-blue-600">{item.job}</span>
                        </p>
                        {item.score && (
                          <p className="mt-0.5 text-[10px] text-slate-500">
                            Score:{" "}
                            <span className="font-semibold text-emerald-600">
                              {item.score}%
                            </span>
                          </p>
                        )}
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gradient-to-br from-slate-900 to-slate-800 shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <p className="font-semibold text-sm text-white">AI Summary</p>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Today&apos;s AI screening identified{" "}
                <span className="font-semibold text-white">
                  3 standout candidates
                </span>{" "}
                for the Backend Engineer role. Avg match score is{" "}
                <span className="font-semibold text-blue-400">81%</span> — 14
                points above your historical average.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Screened", value: "18" },
                  { label: "Avg Score", value: "81%" },
                  { label: "Top Match", value: "96%" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-bold text-lg text-white">{s.value}</p>
                    <p className="text-[10px] text-slate-500">{s.label}</p>
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
