"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase, Sparkles, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { QueryErrorState } from "@/components/data/query-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
            <div key={i} className="h-40 rounded-section bg-secondary/30" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="h-[600px] rounded-section bg-secondary/30 lg:col-span-2" />
          <div className="h-[600px] rounded-section bg-secondary/30" />
        </div>
      </div>
    );
  }

  if (statsQuery.isError || applicantsQuery.isError || jobsQuery.isError) {
    return (
      <QueryErrorState
        error={statsQuery.error || applicantsQuery.error || jobsQuery.error}
        title="Dashboard analytics could not be synchronized"
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
      job: allJobs.find((j) => j.id === a.jobId)?.title || "Pipeline",
      score: a.screening?.matchScore,
      time: new Date(a.updatedAt!).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

  return (
    <TooltipProvider>
      <div className="w-full space-y-20 pb-20">
        {/* Primary Metrics Layer */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <StatCard
              label="Total Talent"
              value={stats?.totalCandidates ?? 0}
              sublabel="Cumulative experts in pool"
              trend="Active"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard
              label="Live Pipelines"
              value={activeJobs.length}
              sublabel="Recruitment cycles in motion"
              trend="Real-time"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCard
              label="Throughput"
              value={stats?.screenedToday ?? 0}
              sublabel="AI analyses completed today"
              trend="Sync"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCard
              label="Quality Index"
              value={`${stats?.avgMatchScore ?? 0}%`}
              sublabel="Aggregate candidate resonance"
              trend="Match"
            />
          </motion.div>
        </section>

        {/* Intelligence & Strategy Layer */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Main Strategic Column */}
          <div className="space-y-12 lg:col-span-8">
            {/* Top Talent: Asymmetric Layout */}
            <Card variant="exhibit" size="none">
              <header className="flex items-center justify-between border-border/10 border-b bg-secondary/[0.01] px-10 py-8">
                <div>
                  <h3 className="font-display font-light text-[18px] text-foreground uppercase tracking-[0.15em]">
                    Strategic Shortlist
                  </h3>
                  <p className="mt-1 font-bold text-[11px] text-muted-foreground/40 uppercase tracking-widest">
                    High-Resonance candidates
                  </p>
                </div>
                <Button
                  render={<Link href="/dashboard/applicants">Market View</Link>}
                  variant="outline"
                  className="rounded-full"
                  size="lg"
                />
              </header>
              <div className="divide-y divide-border/5">
                {topApplicants.length > 0 ? (
                  topApplicants.map((applicant) => (
                    <Link
                      key={applicant.id}
                      href={`/dashboard/applicants/${applicant.id}` as Route}
                      className="group flex h-[100px] items-center gap-10 px-10 transition-all hover:bg-secondary/[0.15]"
                    >
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-border/40 bg-background font-bold text-[13px] text-muted-foreground/30 uppercase shadow-ethereal transition-transform group-hover:scale-[1.05]">
                        <span className="translate-y-[0.5px]">
                          {applicant.firstName[0]}
                          {applicant.lastName[0]}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="font-medium text-[17px] text-foreground leading-tight tracking-tight transition-colors group-hover:text-primary">
                          {applicant.firstName} {applicant.lastName}
                        </p>
                        <p className="mt-1 truncate font-medium text-[13px] text-muted-foreground/50 leading-none tracking-tight">
                          {applicant.headline}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-10">
                        <ScoreBadge
                          score={applicant.screening?.matchScore ?? 0}
                        />
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/30 text-muted-foreground/20 transition-all group-hover:border-primary/30 group-hover:text-primary">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-32 text-center">
                    <Sparkles className="mx-auto mb-6 h-12 w-12 text-muted-foreground/10" />
                    <p className="px-20 font-bold text-[11px] text-muted-foreground/30 uppercase tracking-[0.25em]">
                      Awaiting High-Resolution Signal Analysis
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Active Pipelines: Compact List */}
            <div className="overflow-hidden rounded-section border border-border/50 bg-background shadow-premium">
              <header className="flex items-center justify-between border-border/10 border-b bg-secondary/[0.01] px-10 py-8">
                <h3 className="font-display font-light text-[18px] text-foreground uppercase tracking-[0.15em]">
                  Neural Pipelines
                </h3>
                <Link
                  href="/dashboard/jobs"
                  className="font-bold text-[10px] text-muted-foreground/40 uppercase tracking-widest hover:text-foreground"
                >
                  All Channels
                </Link>
              </header>
              <div className="grid grid-cols-1 divide-x divide-y divide-border/5 border-border/5 border-b md:grid-cols-2">
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
                        className="group p-10 transition-all hover:bg-secondary/[0.15]"
                      >
                        <p className="mb-4 font-medium text-[16px] text-foreground tracking-tight transition-colors group-hover:text-primary">
                          {job.title}
                        </p>
                        <div className="flex items-end justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-bold text-[10px] text-muted-foreground/30 uppercase tracking-widest">
                              {job.location}
                            </p>
                            <p className="font-display font-light text-[20px] text-foreground/80 leading-none">
                              {job.applicantsCount}{" "}
                              <span className="text-[12px] opacity-40">
                                Total
                              </span>
                            </p>
                          </div>
                          <div className="space-y-3 text-right">
                            <p className="font-bold text-[10px] text-info/50 uppercase tracking-widest">
                              {pct}% Screened
                            </p>
                            <div className="h-1 w-24 overflow-hidden rounded-pill bg-secondary/50 shadow-inset">
                              <div
                                className={cn(
                                  "h-full transition-all duration-1000",
                                  pct > 80 ? "bg-success/40" : "bg-info/30",
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
                  <div className="col-span-2 py-20 text-center opacity-30">
                    <Briefcase className="mx-auto mb-4 h-8 w-8" />
                    <p className="font-bold text-[10px] uppercase tracking-widest">
                      No Active Channels
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity & Health Column */}
          <div className="space-y-12 lg:col-span-4">
            {/* Health Index Card */}
            <div className="space-y-12 rounded-section border border-border/40 bg-accent/5 p-10 shadow-premium">
              <header>
                <h3 className="mb-1 font-display font-light text-[16px] text-foreground uppercase tracking-[0.12em]">
                  Intelligence Hub
                </h3>
                <p className="font-bold text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                  System Health & Coverage
                </p>
              </header>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <p className="pl-1 font-bold text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                      Talent Quality
                    </p>
                    <p className="font-display font-light text-[32px] text-foreground leading-none tracking-tighter">
                      {stats?.avgMatchScore ?? 0}%
                    </p>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-pill border border-border/10 bg-background/50">
                    <div
                      className="h-full bg-info/50 shadow-[0_0_15px_rgba(var(--color-info),0.3)]"
                      style={{ width: `${stats?.avgMatchScore ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <p className="pl-1 font-bold text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                      AI Saturation
                    </p>
                    <p className="font-display font-light text-[32px] text-foreground leading-none tracking-tighter">
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
                  <div className="h-1.5 w-full overflow-hidden rounded-pill border border-border/10 bg-background/50">
                    <div
                      className="h-full bg-success/50 shadow-[0_0_15px_rgba(var(--color-success),0.3)]"
                      style={{
                        width: `${allApplicants.length > 0 ? Math.round((allApplicants.filter((a) => !!a.screening).length / allApplicants.length) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <Button
                render={<Link href="/dashboard/analytics" className="block" />}
                className="w-full rounded-full"
                variant="outline"
                size="lg"
              >
                Deep Analytics
              </Button>
            </div>

            {/* Log Stream */}
            <div className="overflow-hidden rounded-section border border-border/50 bg-background shadow-premium">
              <header className="border-border/10 border-b bg-secondary/[0.01] px-8 py-6">
                <h3 className="font-display font-light text-[15px] text-foreground uppercase tracking-[0.12em]">
                  Neural Log
                </h3>
              </header>
              <div className="divide-y divide-border/5 px-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="group flex min-h-[95px] flex-col justify-center px-4 py-7 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-2 w-2 shrink-0 rounded-full bg-success/40 group-hover:animate-pulse" />
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="font-medium text-[13px] text-foreground/80 leading-tight">
                            <span className="font-bold text-foreground">
                              {item.candidate}
                            </span>{" "}
                            evaluated
                          </p>
                          <p className="mt-1 truncate font-medium text-[11px] text-muted-foreground/40 leading-none">
                            Channel: {item.job}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 pl-6 opacity-40">
                        <span className="font-bold text-[9px] uppercase leading-none tracking-widest">
                          {item.score}% Match
                        </span>
                        <div className="h-0.5 w-0.5 shrink-0 rounded-full bg-border" />
                        <span className="font-bold text-[9px] uppercase leading-none tracking-widest">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center opacity-10">
                    <Users className="mx-auto h-8 w-8" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
