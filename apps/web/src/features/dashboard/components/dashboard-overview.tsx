"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BrainCircuit,
  Briefcase,
  ChevronRight,
  Cpu,
  Sparkles,
  Users,
  Zap,
  Info,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCreateModalOpen } from "@/store/slices/jobsSlice";
import { trpc } from "@/utils/trpc";
import { ScoreBadge } from "./score-badge";
import { StatCard } from "./stat-card";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const activityConfig = {
  screened: {
    label: "Screened",
    color: "bg-secondary text-muted-foreground/60",
    icon: BrainCircuit,
  },
  applied: {
    label: "Applied",
    color: "bg-secondary text-muted-foreground/60",
    icon: Users,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-success/5 text-success/60",
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
      <div className="w-full space-y-12 animate-pulse">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-secondary/30" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="h-[600px] rounded-lg bg-secondary/30 lg:col-span-2" />
          <div className="h-[600px] rounded-lg bg-secondary/30" />
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Pool", value: stats?.totalCandidates ?? 0, trend: "+12.5%", desc: "Active candidate profiles" },
    { title: "Active Pipelines", value: jobs?.filter((j) => j.status === "active").length ?? 0, trend: "+4.2%", desc: "Current open positions" },
    { title: "Processed Today", value: stats?.screenedToday ?? 0, trend: "+8.1%", desc: "AI screening throughput" },
    { title: "Average Match", value: `${stats?.avgMatchScore ?? 0}%`, trend: "+2.4%", desc: "Talent quality index" },
  ];

  const allApplicants = applicants ?? [];
  const topApplicants = allApplicants
    .filter((a) => a.screening)
    .sort((a, b) => (b.screening?.matchScore ?? 0) - (a.screening?.matchScore ?? 0))
    .slice(0, 5);

  const activeJobs = (jobs ?? [])
    .filter((j) => j.status === "active")
    .slice(0, 3);

  const recentActivity = topApplicants.slice(0, 3).map((a, i) => ({
    id: a.id,
    type: "screened",
    candidate: `${a.firstName} ${a.lastName}`,
    job: a.headline || "Engineering",
    score: a.screening?.matchScore,
    time: i === 0 ? "Just now" : `${i * 2}h ago`,
  }));

  return (
    <TooltipProvider>
      <div className="w-full space-y-12 pb-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <StatCard
                label={stat.title}
                value={stat.value}
                sublabel={stat.desc}
                trend={stat.trend}
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">
          <div className="space-y-10 lg:col-span-2">
            <div className="bg-background rounded-section border border-border/50 overflow-hidden shadow-premium">
              <div className="flex items-center justify-between px-8 py-6 border-b border-border/20 bg-secondary/[0.02]">
                <h3 className="font-display text-[15px] font-light text-foreground uppercase tracking-[0.12em]">Top Talent Pool</h3>
                <Link
                  href="/dashboard/applicants"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground transition-colors"
                >
                  View all <ChevronRight className="inline-block h-3 w-3 ml-1 opacity-30" />
                </Link>
              </div>
              <div className="divide-y divide-border/10">
                {topApplicants.length > 0 ? topApplicants.map((applicant, idx) => (
                  <Link
                    key={applicant.id}
                    href={`/dashboard/applicants/${applicant.id}` as Route}
                    className="group flex items-center gap-8 px-8 py-6 transition-all hover:bg-secondary/20"
                  >
                    <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-center text-[11px] font-bold text-muted-foreground/30 uppercase shadow-ethereal group-hover:scale-[1.05] transition-transform">
                       {applicant.firstName[0]}{applicant.lastName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {applicant.firstName} {applicant.lastName}
                      </p>
                      <p className="truncate text-muted-foreground/60 text-[12px] tracking-tight mt-0.5">
                        {applicant.headline}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-8">
                      <ScoreBadge score={applicant.screening?.matchScore ?? 0} />
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                )) : (
                  <div className="py-20 text-center text-muted-foreground/30">
                    <Users className="mx-auto h-10 w-10 mb-4 opacity-10" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting First Applications</p>
                    <p className="text-[12px] font-medium tracking-tight mt-1 opacity-60">Shortlisted experts will appear here after AI screening.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-background rounded-section border border-border/50 overflow-hidden shadow-premium">
              <div className="flex items-center justify-between px-8 py-6 border-b border-border/20 bg-secondary/[0.02]">
                <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.12em]">Active Pipelines</h3>
                <Link
                  href="/dashboard/jobs"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground transition-colors"
                >
                  All postings <ChevronRight className="inline-block h-3 w-3 ml-1 opacity-30" />
                </Link>
              </div>
              <div className="divide-y divide-border/10">
                {activeJobs.length > 0 ? activeJobs.map((job) => {
                  const pct = job.applicantsCount > 0 ? Math.round((job.screenedCount / job.applicantsCount) * 100) : 0;
                  return (
                    <Link
                      key={job.id}
                      href={`/dashboard/jobs/${job.id}` as Route}
                      className="group flex items-center gap-8 px-8 py-7 transition-all hover:bg-secondary/20"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-medium text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors">
                          {job.title}
                        </p>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">{job.location}</span>
                           <div className="h-0.5 w-0.5 rounded-full bg-border/40" />
                           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">{job.type}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-display text-[22px] font-light text-foreground leading-none mb-2">
                          {job.applicantsCount}
                        </p>
                        <div className="h-1 w-20 bg-secondary/50 rounded-pill overflow-hidden shadow-inset">
                          <div className="h-full bg-info/30" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </Link>
                  );
                }) : (
                  <div className="py-20 text-center text-muted-foreground/30">
                    <Briefcase className="mx-auto h-10 w-10 mb-4 opacity-10" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">No Open Positions</p>
                    <p className="text-[12px] font-medium tracking-tight mt-1 opacity-60">Create your first job posting to start building your pipeline.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="bg-background rounded-section border border-border/50 overflow-hidden shadow-premium">
              <div className="px-8 py-6 border-b border-border/20 bg-secondary/[0.02]">
                <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.12em]">Activity Stream</h3>
              </div>
              <div className="divide-y divide-border/10">
                {recentActivity.length > 0 ? recentActivity.map((item) => {
                  const config = activityConfig[item.type as keyof typeof activityConfig];
                  const Icon = config.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-5 px-8 py-6"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] leading-relaxed text-foreground/70 font-medium tracking-tight">
                          <span className="font-bold text-foreground">{item.candidate}</span>{" "}
                          processed for <span className="text-foreground">{item.job}</span>
                        </p>
                        <div className="flex items-center gap-4 mt-2.5 opacity-30">
                          {item.score && (
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em]">{item.score}% Match</span>
                          )}
                          <span className="text-[9px] font-bold uppercase tracking-[0.25em]">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-12 text-center text-muted-foreground/20">
                     <p className="text-[10px] font-bold uppercase tracking-widest">Nothing to report</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-accent/5 rounded-section border border-border/50 overflow-hidden shadow-warm-lift group transition-all hover:shadow-lift">
              <div className="px-8 py-6 border-b border-border/20 flex items-center justify-between bg-accent/[0.02]">
                <h3 className="font-display text-[15px] font-light text-foreground uppercase tracking-[0.12em]">Intelligence</h3>
              </div>
              <div className="p-10">
                <div className="space-y-10">
                  <div>
                    <div className="flex items-end justify-between mb-3">
                       <div className="flex items-center gap-2">
                          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Global quality</p>
                       </div>
                       <div className="flex items-baseline gap-1">
                          <p className="font-display text-[28px] font-light text-foreground leading-none">{stats?.avgMatchScore ?? 0}</p>
                          <span className="text-[12px] text-muted-foreground/30 font-light font-display">%</span>
                       </div>
                    </div>
                    <div className="h-1 w-full bg-background/50 rounded-pill overflow-hidden border border-border/10 shadow-inset">
                       <div className="h-full bg-info/40 shadow-ethereal" style={{ width: `${stats?.avgMatchScore ?? 0}%` }} />
                    </div>
                  </div>

                  <div>
                     <div className="flex items-end justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">AI Coverage</p>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <p className="font-display text-[28px] font-light text-foreground leading-none">
                            {allApplicants.length > 0 ? Math.round((topApplicants.length / allApplicants.length) * 100) : 0}
                          </p>
                          <span className="text-[12px] text-muted-foreground/30 font-light font-display">%</span>
                        </div>
                     </div>
                     <div className="h-1 w-full bg-background/50 rounded-pill overflow-hidden border border-border/10 shadow-inset">
                        <div className="h-full bg-success/40 shadow-ethereal" style={{ width: `${allApplicants.length > 0 ? Math.round((topApplicants.length / allApplicants.length) * 100) : 0}%` }} />
                     </div>
                  </div>
                </div>

                <Link href={"/dashboard/analytics" as Route}>
                  <button className="btn-pill-warm mt-14 w-full h-11 text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Enter Performance Hub
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
