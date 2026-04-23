"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BrainCircuit,
  Briefcase,
  ChevronRight,
  Sparkles,
  Users,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { QueryErrorState } from "@/components/data/query-state";
import { trpc } from "@/utils/trpc";
import { ScoreBadge } from "./score-badge";
import { StatCard } from "./stat-card";
import { motion } from "framer-motion";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function DashboardOverview() {
  const statsQuery = useQuery(trpc.jobs.stats.queryOptions());
  const applicantsQuery = useQuery(trpc.applicants.list.queryOptions());
  const jobsQuery = useQuery(trpc.jobs.list.queryOptions());

  if (statsQuery.isLoading || applicantsQuery.isLoading || jobsQuery.isLoading) {
    return (
      <div className="w-full space-y-16 animate-pulse">
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
    .sort((a, b) => (b.screening?.matchScore ?? 0) - (a.screening?.matchScore ?? 0))
    .slice(0, 5);

  const activeJobs = allJobs.filter((j) => j.status === "active").slice(0, 3);

  const recentActivity = [...allApplicants]
    .filter((a) => a.screening && a.updatedAt)
    .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      candidate: `${a.firstName} ${a.lastName}`,
      job: allJobs.find(j => j.id === a.jobId)?.title || "Pipeline",
      score: a.screening?.matchScore,
      time: new Date(a.updatedAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

  return (
    <TooltipProvider>
      <div className="w-full space-y-20 pb-20">
        {/* Primary Metrics Layer */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <StatCard label="Total Talent" value={stats?.totalCandidates ?? 0} sublabel="Cumulative experts in pool" trend="Active" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StatCard label="Live Pipelines" value={activeJobs.length} sublabel="Recruitment cycles in motion" trend="Real-time" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <StatCard label="Throughput" value={stats?.screenedToday ?? 0} sublabel="AI analyses completed today" trend="Sync" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <StatCard label="Quality Index" value={`${stats?.avgMatchScore ?? 0}%`} sublabel="Aggregate candidate resonance" trend="Match" />
          </motion.div>
        </section>

        {/* Intelligence & Strategy Layer */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* Main Strategic Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Top Talent: Asymmetric Layout */}
            <div className="bg-background rounded-section border border-border/50 shadow-premium overflow-hidden">
              <header className="flex items-center justify-between px-10 py-8 border-b border-border/10 bg-secondary/[0.01]">
                <div>
                  <h3 className="font-display text-[18px] font-light text-foreground uppercase tracking-[0.15em]">Strategic Shortlist</h3>
                  <p className="text-[11px] text-muted-foreground/40 font-bold uppercase tracking-widest mt-1">High-Resonance candidates</p>
                </div>
                <Link href="/dashboard/applicants" className="btn-pill-outline h-9 px-5 text-[10px] uppercase tracking-widest">
                  Market View
                </Link>
              </header>
              <div className="divide-y divide-border/5">
                {topApplicants.length > 0 ? topApplicants.map((applicant) => (
                  <Link
                    key={applicant.id}
                    href={`/dashboard/applicants/${applicant.id}` as Route}
                    className="group flex h-[100px] items-center gap-10 px-10 transition-all hover:bg-secondary/[0.15]"
                  >
                    <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-background border border-border/40 flex items-center justify-center text-[13px] font-bold text-muted-foreground/30 uppercase shadow-ethereal group-hover:scale-[1.05] transition-transform">
                       <span className="translate-y-[0.5px]">{applicant.firstName[0]}{applicant.lastName[0]}</span>
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <p className="text-[17px] font-medium text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight">
                        {applicant.firstName} {applicant.lastName}
                      </p>
                      <p className="truncate text-muted-foreground/50 text-[13px] font-medium tracking-tight mt-1 leading-none">
                        {applicant.headline}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-10">
                      <ScoreBadge score={applicant.screening?.matchScore ?? 0} />
                      <div className="h-9 w-9 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground/20 group-hover:text-primary group-hover:border-primary/30 transition-all shrink-0">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="py-32 text-center">
                    <Sparkles className="mx-auto h-12 w-12 mb-6 text-muted-foreground/10" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground/30 px-20">Awaiting High-Resolution Signal Analysis</p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Pipelines: Compact List */}
            <div className="bg-background rounded-section border border-border/50 shadow-premium overflow-hidden">
              <header className="px-10 py-8 border-b border-border/10 bg-secondary/[0.01] flex items-center justify-between">
                <h3 className="font-display text-[18px] font-light text-foreground uppercase tracking-[0.15em]">Neural Pipelines</h3>
                <Link href="/dashboard/jobs" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-foreground">All Channels</Link>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-border/5 border-b border-border/5">
                {activeJobs.length > 0 ? activeJobs.map((job) => {
                  const pct = job.applicantsCount > 0 ? Math.round((job.screenedCount / job.applicantsCount) * 100) : 0;
                  return (
                    <Link
                      key={job.id}
                      href={`/dashboard/jobs/${job.id}` as Route}
                      className="group p-10 transition-all hover:bg-secondary/[0.15]"
                    >
                      <p className="text-[16px] font-medium text-foreground tracking-tight mb-4 group-hover:text-primary transition-colors">
                        {job.title}
                      </p>
                      <div className="flex items-end justify-between gap-4">
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">{job.location}</p>
                           <p className="text-[20px] font-display font-light text-foreground/80 leading-none">{job.applicantsCount} <span className="text-[12px] opacity-40">Total</span></p>
                        </div>
                        <div className="text-right space-y-3">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-info/50">{pct}% Screened</p>
                           <div className="h-1 w-24 bg-secondary/50 rounded-pill overflow-hidden shadow-inset">
                             <div className={cn("h-full transition-all duration-1000", pct > 80 ? "bg-success/40" : "bg-info/30")} style={{ width: `${pct}%` }} />
                           </div>
                        </div>
                      </div>
                    </Link>
                  );
                }) : (
                  <div className="col-span-2 py-20 text-center opacity-30">
                    <Briefcase className="mx-auto h-8 w-8 mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">No Active Channels</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity & Health Column */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Health Index Card */}
            <div className="bg-accent/5 rounded-section border border-border/40 p-10 shadow-premium space-y-12">
               <header>
                 <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.12em] mb-1">Intelligence Hub</h3>
                 <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">System Health & Coverage</p>
               </header>

               <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                       <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest pl-1">Talent Quality</p>
                       <p className="font-display text-[32px] font-light text-foreground leading-none tracking-tighter">{stats?.avgMatchScore ?? 0}%</p>
                    </div>
                    <div className="h-1.5 w-full bg-background/50 rounded-pill overflow-hidden border border-border/10">
                       <div className="h-full bg-info/50 shadow-[0_0_15px_rgba(var(--color-info),0.3)]" style={{ width: `${stats?.avgMatchScore ?? 0}%` }} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                       <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest pl-1">AI Saturation</p>
                       <p className="font-display text-[32px] font-light text-foreground leading-none tracking-tighter">
                         {allApplicants.length > 0 ? Math.round((allApplicants.filter(a => !!a.screening).length / allApplicants.length) * 100) : 0}%
                       </p>
                    </div>
                    <div className="h-1.5 w-full bg-background/50 rounded-pill overflow-hidden border border-border/10">
                       <div className="h-full bg-success/50 shadow-[0_0_15px_rgba(var(--color-success),0.3)]" style={{ width: `${allApplicants.length > 0 ? Math.round((allApplicants.filter(a => !!a.screening).length / allApplicants.length) * 100) : 0}%` }} />
                    </div>
                  </div>
               </div>

               <Link href="/dashboard/analytics" className="block">
                  <button className="w-full h-12 rounded-pill bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:shadow-lift hover:scale-[1.01] active:scale-[0.99]">
                    Deep Analytics
                  </button>
               </Link>
            </div>

            {/* Log Stream */}
            <div className="bg-background rounded-section border border-border/50 shadow-premium overflow-hidden">
              <header className="px-8 py-6 border-b border-border/10 bg-secondary/[0.01]">
                <h3 className="font-display text-[15px] font-light text-foreground uppercase tracking-[0.12em]">Neural Log</h3>
              </header>
              <div className="divide-y divide-border/5 px-4">
                {recentActivity.length > 0 ? recentActivity.map((item) => (
                  <div key={item.id} className="py-7 px-4 group transition-colors flex flex-col justify-center min-h-[95px]">
                    <div className="flex items-center gap-4">
                       <div className="h-2 w-2 rounded-full bg-success/40 shrink-0 group-hover:animate-pulse" />
                       <div className="space-y-1 min-w-0 flex-1">
                         <p className="text-[13px] leading-tight text-foreground/80 font-medium">
                           <span className="font-bold text-foreground">{item.candidate}</span> evaluated
                         </p>
                         <p className="text-[11px] text-muted-foreground/40 font-medium truncate leading-none mt-1">Channel: {item.job}</p>
                       </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 pl-6 opacity-40">
                      <span className="text-[9px] font-bold uppercase tracking-widest leading-none">{item.score}% Match</span>
                      <div className="h-0.5 w-0.5 rounded-full bg-border shrink-0" />
                      <span className="text-[9px] font-bold uppercase tracking-widest leading-none">{item.time}</span>
                    </div>
                  </div>
                )) : (
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
