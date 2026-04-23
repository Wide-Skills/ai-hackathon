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
    { title: "Total Pool", value: stats?.totalCandidates ?? 0, trend: "+12.5%", icon: Users, desc: "Total active candidates" },
    { title: "Active Pipelines", value: jobs?.filter((j) => j.status === "active").length ?? 0, trend: "+4.2%", icon: Briefcase, desc: "Current open positions" },
    { title: "Processed Today", value: stats?.screenedToday ?? 0, trend: "+8.1%", icon: Cpu, desc: "AI screening volume" },
    { title: "Average Match", value: `${stats?.avgMatchScore ?? 0}%`, trend: "+2.4%", icon: Sparkles, desc: "Pool quality index" },
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
                icon={stat.icon}
                color="bg-secondary/50 text-foreground/40"
                trend={stat.trend}
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">
          <div className="space-y-10 lg:col-span-2">
            <div className="bg-background rounded-lg border border-border overflow-hidden shadow-premium">
              <div className="flex items-center justify-between px-8 py-6 border-b border-border/50 bg-secondary/[0.03]">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-display-card font-light text-foreground uppercase tracking-[0.12em]">Top Talent Pool</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground/40 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[240px] p-3 text-[12px] leading-relaxed">
                      Candidates automatically ranked by our Gemini engine based on technical expertise and role fit.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Link
                  href="/dashboard/applicants"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  View full pool <ChevronRight className="inline-block h-3 w-3 ml-1 opacity-40" />
                </Link>
              </div>
              <div className="divide-y divide-border/30">
                {topApplicants.length > 0 ? topApplicants.map((applicant, idx) => (
                  <Link
                    key={applicant.id}
                    href={`/dashboard/applicants/${applicant.id}` as Route}
                    className="group flex items-center gap-6 px-8 py-5 transition-colors hover:bg-secondary/20"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-muted-foreground/40">
                      {idx + 1}
                    </div>
                    <div className="h-11 w-11 flex-shrink-0 rounded-lg bg-secondary border border-border/50 flex items-center justify-center text-[12px] font-bold text-muted-foreground/60 uppercase">
                       {applicant.firstName[0]}{applicant.lastName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium text-foreground tracking-tight">
                        {applicant.firstName} {applicant.lastName}
                      </p>
                      <p className="truncate text-muted-foreground text-[13px] tracking-tight">
                        {applicant.headline}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-8">
                      <ScoreBadge score={applicant.screening?.matchScore ?? 0} />
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-foreground transition-colors" />
                    </div>
                  </Link>
                )) : (
                  <div className="py-20 text-center text-muted-foreground/40">
                    <Users className="mx-auto h-10 w-10 mb-4 opacity-20" />
                    <p className="text-[11px] font-bold uppercase tracking-widest">Awaiting First Applications</p>
                    <p className="text-[13px] font-medium tracking-tight mt-1">Shortlisted experts will appear here after AI screening.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-background rounded-lg border border-border overflow-hidden shadow-premium">
              <div className="flex items-center justify-between px-8 py-6 border-b border-border/50 bg-secondary/[0.03]">
                <h3 className="font-display text-display-card font-light text-foreground uppercase tracking-[0.12em]">Active Pipelines</h3>
                <Link
                  href="/dashboard/jobs"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  All postings <ChevronRight className="inline-block h-3 w-3 ml-1 opacity-40" />
                </Link>
              </div>
              <div className="divide-y divide-border/30">
                {activeJobs.length > 0 ? activeJobs.map((job) => {
                  const pct = job.applicantsCount > 0 ? Math.round((job.screenedCount / job.applicantsCount) * 100) : 0;
                  return (
                    <Link
                      key={job.id}
                      href={`/dashboard/jobs/${job.id}` as Route}
                      className="group flex items-center gap-6 px-8 py-6 transition-colors hover:bg-secondary/20"
                    >
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground/30">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-medium text-foreground tracking-tight mb-1.5">
                          {job.title}
                        </p>
                        <div className="flex items-center gap-4">
                           <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">{job.location}</span>
                           <div className="h-1.5 w-1.5 rounded-full bg-border/40" />
                           <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">{job.type}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right pr-2">
                        <p className="font-display text-[22px] font-light text-foreground leading-none mb-2">
                          {job.applicantsCount}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mb-2">Applicants</p>
                        <div className="h-1 w-20 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-success/30" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </Link>
                  );
                }) : (
                  <div className="py-20 text-center text-muted-foreground/40">
                    <Briefcase className="mx-auto h-10 w-10 mb-4 opacity-20" />
                    <p className="text-[11px] font-bold uppercase tracking-widest">No Open Positions</p>
                    <p className="text-[13px] font-medium tracking-tight mt-1">Create your first job posting to start building your pipeline.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="bg-background rounded-lg border border-border overflow-hidden shadow-premium">
              <div className="px-8 py-6 border-b border-border/50 bg-secondary/[0.03]">
                <h3 className="font-display text-display-card font-light text-foreground uppercase tracking-[0.12em]">Activity Stream</h3>
              </div>
              <div className="divide-y divide-border/30">
                {recentActivity.length > 0 ? recentActivity.map((item) => {
                  const config = activityConfig[item.type as keyof typeof activityConfig];
                  const Icon = config.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-5 px-8 py-5"
                    >
                      <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${config.color} border border-current/5 shadow-sm`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] leading-relaxed text-foreground/70 font-medium tracking-tight">
                          <span className="font-bold text-foreground">{item.candidate}</span>{" "}
                          processed for <span className="text-foreground">{item.job}</span>
                        </p>
                        <div className="flex items-center gap-4 mt-2 opacity-50">
                          {item.score && (
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.score}% Match</span>
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-12 text-center text-muted-foreground/30">
                     <p className="text-[11px] font-bold uppercase tracking-widest">Nothing to report</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-secondary/30 rounded-lg border border-border overflow-hidden shadow-premium group">
              <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between">
                <h3 className="font-display text-display-card font-light text-foreground uppercase tracking-[0.12em]">Intelligence</h3>
                <Zap className="h-4 w-4 text-info opacity-30 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-10">
                <div className="space-y-10">
                  <div>
                    <div className="flex items-end justify-between mb-3">
                       <div className="flex items-center gap-2">
                          <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">Global match quality</p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground/30 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="text-[11px] p-2">Average score across all screened talent.</TooltipContent>
                          </Tooltip>
                       </div>
                       <div className="flex items-baseline gap-1">
                          <p className="font-display text-[28px] font-light text-foreground leading-none">{stats?.avgMatchScore ?? 0}</p>
                          <span className="text-[14px] text-muted-foreground/40 font-light font-display">%</span>
                       </div>
                    </div>
                    <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden border border-border/20">
                       <div className="h-full bg-info/40" style={{ width: `${stats?.avgMatchScore ?? 0}%` }} />
                    </div>
                  </div>

                  <div>
                     <div className="flex items-end justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">AI Coverage</p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground/30 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="text-[11px] p-2">Percentage of candidates processed by AI.</TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <p className="font-display text-[28px] font-light text-foreground leading-none">
                            {allApplicants.length > 0 ? Math.round((topApplicants.length / allApplicants.length) * 100) : 0}
                          </p>
                          <span className="text-[14px] text-muted-foreground/40 font-light font-display">%</span>
                        </div>
                     </div>
                     <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden border border-border/20">
                        <div className="h-full bg-success/40" style={{ width: `${allApplicants.length > 0 ? Math.round((topApplicants.length / allApplicants.length) * 100) : 0}%` }} />
                     </div>
                  </div>
                </div>

                <Link href="/dashboard/analytics">
                  <button className="mt-14 w-full h-11 rounded-full bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-sm">
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
