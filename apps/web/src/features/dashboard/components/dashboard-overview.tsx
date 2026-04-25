"use client";

import {
  RiArrowRightUpLine,
  RiBriefcaseLine,
  RiGroupLine,
  RiSparklingLine,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Route } from "next";
import Link from "next/link";
import { QueryErrorState } from "@/components/data/query-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { ScoreBadge } from "./score-badge";
import { StatCard } from "./stat-card";

export function DashboardOverview() {
  const statsQuery = useQuery(trpc.jobs.stats.queryOptions());
  const applicantsQuery = useQuery(trpc.applicants.list.queryOptions());
  const jobsQuery = useQuery(trpc.jobs.list.queryOptions());

  if (
    statsQuery.isLoading ||
    applicantsQuery.isLoading ||
    jobsQuery.isLoading
  ) {
    return (
      <div className="w-full animate-pulse space-y-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-secondary/30" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="h-[600px] rounded-3xl bg-secondary/30 lg:col-span-2" />
          <div className="h-[600px] rounded-3xl bg-secondary/30" />
        </div>
      </div>
    );
  }

  if (statsQuery.isError || applicantsQuery.isError || jobsQuery.isError) {
    return (
      <QueryErrorState
        error={statsQuery.error || applicantsQuery.error || jobsQuery.error}
        title="Dashboard metrics could not be loaded"
        onRetry={() => {
          statsQuery.refetch();
          applicantsQuery.refetch();
          jobsQuery.refetch();
        }}
      />
    );
  }

  const stats = statsQuery.data;
  const allApplicants = applicantsQuery.data ?? [];
  const allJobs = jobsQuery.data ?? [];

  const topApplicants = [...allApplicants]
    .filter((a) => a.status === "shortlisted")
    .sort(
      (a, b) => (b.screening?.matchScore ?? 0) - (a.screening?.matchScore ?? 0),
    )
    .slice(0, 5);

  const activeJobs = allJobs.filter((j) => j.status === "active").slice(0, 3);

  const recentActivity = [...allApplicants]
    .filter((a) => a.screening && a.updatedAt)
    .sort(
      (a, b) =>
        new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime(),
    )
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      candidate: `${a.firstName} ${a.lastName}`,
      job: allJobs.find((j) => j.id === a.jobId)?.title || "Job",
      score: a.screening?.matchScore,
      time: new Date(a.updatedAt!).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

  return (
    <TooltipProvider>
      <div className="w-full space-y-section-padding pb-section-padding">
        {/* Primary Metrics Layer */}
        <section className="grid grid-cols-1 gap-comfortable md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <StatCard
              label="Total Talent"
              value={stats?.totalCandidates ?? 0}
              sublabel="Candidates in your pool"
              trend="Active"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard
              label="Active Jobs"
              value={activeJobs.length}
              sublabel="Pipelines currently open"
              trend="Live"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCard
              label="Activity"
              value={stats?.screenedToday ?? 0}
              sublabel="Candidates screened today"
              trend="Daily"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCard
              label="Match Quality"
              value={`${stats?.avgMatchScore ?? 0}%`}
              sublabel="Average score across pool"
              trend="Avg"
            />
          </motion.div>
        </section>

        {/* Strategic Layer */}
        <div className="grid grid-cols-1 items-start gap-comfortable lg:grid-cols-12">
          {/* Main Column */}
          <div className="space-y-comfortable lg:col-span-8">
            {/* Top Talent */}
            <Card variant="default" size="none" className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardDescription>Selection</CardDescription>
                  <CardTitle>Top Candidates</CardTitle>
                </div>
                <Button
                  render={<Link href="/dashboard/applicants">View All</Link>}
                  variant="outline"
                  size="default"
                />
              </CardHeader>
              <div className="divide-y divide-line">
                {topApplicants.length > 0 ? (
                  topApplicants.map((applicant) => (
                    <Link
                      key={applicant.id}
                      href={`/dashboard/applicants/${applicant.id}` as Route}
                      className="group flex min-h-[90px] items-center gap-base px-comfortable py-comfortable transition-all hover:bg-bg2"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-micro border border-line bg-bg2 font-medium font-sans text-[13px] text-ink-faint uppercase transition-transform group-hover:scale-[1.05]">
                        <span className="translate-y-[0.5px]">
                          {applicant.firstName[0]}
                          {applicant.lastName[0]}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="font-serif text-[18px] text-primary leading-tight transition-colors group-hover:text-primary-muted">
                          {applicant.firstName} {applicant.lastName}
                        </p>
                        <p className="mt-1 truncate font-light font-sans text-[13px] text-ink-muted leading-none">
                          {applicant.headline}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-comfortable">
                        <ScoreBadge
                          score={applicant.screening?.matchScore ?? 0}
                        />
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-micro border border-line text-ink-faint transition-all group-hover:border-line-emphasis group-hover:text-primary">
                          <RiArrowRightUpLine className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <Empty className="border-none bg-transparent py-32">
                    <EmptyHeader>
                      <EmptyMedia>
                        <RiSparklingLine className="size-4 text-ink-faint" />
                      </EmptyMedia>
                      <EmptyDescription className="text-ink-faint">
                        Awaiting screening results
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </Card>

            {/* Active Jobs */}
            <Card variant="default" size="none" className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardDescription>Open Positions</CardDescription>
                  <CardTitle>Active Jobs</CardTitle>
                </div>
                <Link
                  href="/dashboard/jobs"
                  className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider hover:text-ink-full"
                >
                  All Jobs
                </Link>
              </CardHeader>
              <div className="grid grid-cols-1 divide-x divide-y divide-line border-line border-b md:grid-cols-2">
                {activeJobs.length > 0 ? (
                  activeJobs.map((job) => {
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
                        className="group p-comfortable transition-all hover:bg-bg2"
                      >
                        <p className="mb-4 font-medium font-sans text-[15px] text-ink-full tracking-tight">
                          {job.title}
                        </p>
                        <div className="flex items-end justify-between gap-base">
                          <div className="space-y-1">
                            <p className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                              {job.location}
                            </p>
                            <p className="font-serif text-[20px] text-primary leading-none">
                              {job.applicantsCount}{" "}
                              <span className="text-[12px] opacity-40">
                                Applicants
                              </span>
                            </p>
                          </div>
                          <div className="space-y-3 text-right">
                            <p className="font-medium font-sans text-[10px] text-primary/60 uppercase tracking-wider">
                              {pct}% Screened
                            </p>
                            <div className="h-1 w-24 overflow-hidden rounded-full bg-bg-deep">
                              <div
                                className={cn(
                                  "h-full transition-all duration-1000",
                                  pct > 80
                                    ? "bg-status-success-text"
                                    : "bg-primary/40",
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <Empty className="col-span-2 border-none bg-transparent py-20">
                    <EmptyHeader>
                      <EmptyMedia>
                        <RiBriefcaseLine className="size-4 text-ink-faint" />
                      </EmptyMedia>
                      <EmptyDescription className="text-ink-faint">
                        No active jobs found
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </Card>
          </div>

          {/* Side Column */}
          <div className="space-y-comfortable lg:col-span-4">
            {/* Health Card */}
            <Card variant="default" className="overflow-hidden" size="none">
              <CardHeader>
                <CardDescription>Metrics</CardDescription>
                <CardTitle>Pool Health</CardTitle>
              </CardHeader>

              <div className="space-y-comfortable p-comfortable">
                <div className="space-y-base">
                  <div className="flex items-end justify-between">
                    <p className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                      Overall Score
                    </p>
                    <p className="font-serif text-[26px] text-primary leading-none tracking-tight">
                      {stats?.avgMatchScore ?? 0}%
                    </p>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-deep">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${stats?.avgMatchScore ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-base">
                  <div className="flex items-end justify-between">
                    <p className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                      Screening Coverage
                    </p>
                    <p className="font-serif text-[26px] text-primary leading-none tracking-tight">
                      {allApplicants.length > 0
                        ? Math.round(
                            (allApplicants.filter((a) => !!a.screening).length /
                              allApplicants.length) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-deep">
                    <div
                      className="h-full bg-status-success-text"
                      style={{
                        width: `${allApplicants.length > 0 ? Math.round((allApplicants.filter((a) => !!a.screening).length / allApplicants.length) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <Button
                  render={
                    <Link href="/dashboard/analytics" className="block" />
                  }
                  variant="outline"
                  size="default"
                  className="mt-comfortable h-10 w-full"
                >
                  Deep Analytics
                </Button>
              </div>
            </Card>

            {/* Activity Feed */}
            <Card
              variant="default"
              size="none"
              className="overflow-hidden shadow-none"
            >
              <CardHeader>
                <CardDescription>Real-time</CardDescription>
                <CardTitle>Activity Feed</CardTitle>
              </CardHeader>
              <div className="divide-y divide-line">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="group flex min-h-[95px] flex-col justify-center px-comfortable py-comfortable transition-all hover:bg-bg2"
                    >
                      <div className="flex items-center gap-base">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-status-success-text/60" />
                        <div className="min-w-0 flex-1 space-y-micro">
                          <p className="font-medium font-sans text-[13px] text-ink-full leading-tight">
                            {item.candidate}
                          </p>
                          <p className="truncate font-light font-sans text-[11px] text-ink-muted leading-none">
                            Applied for: {item.job}
                          </p>
                        </div>
                      </div>
                      <div className="mt-base flex items-center gap-base pl-comfortable opacity-40">
                        <span className="font-medium font-sans text-[9px] text-ink-faint uppercase tracking-wider">
                          {item.score}% Match
                        </span>
                        <div className="h-px w-small bg-line" />
                        <span className="font-medium font-sans text-[9px] text-ink-faint uppercase tracking-wider">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty className="border-none bg-transparent py-16">
                    <EmptyHeader>
                      <EmptyMedia>
                        <RiGroupLine className="size-4 text-ink-faint" />
                      </EmptyMedia>
                      <EmptyDescription className="text-ink-faint">
                        No recent activity
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
