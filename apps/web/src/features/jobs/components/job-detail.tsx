"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { ScoreBadge } from "../../dashboard/components/score-badge";
import { motion } from "framer-motion";

const statusConfig: Record<string, { label: string; color: string }> = {
  active: {
    label: "Active Posting",
    color: "text-success-foreground bg-success/5 border-success/10",
  },
  draft: {
    label: "Draft Mode",
    color: "text-warning-foreground bg-warning/5 border-warning/10",
  },
  closed: {
    label: "Closed Posting",
    color: "text-muted-foreground bg-secondary border-border/50",
  },
};

interface JobDetailProps {
  id: string;
}

export function JobDetail({ id }: JobDetailProps) {
  const router = useRouter();
  const { data: job, isLoading: jobLoading } = useQuery(
    trpc.jobs.getById.queryOptions({ id }),
  );
  const { data: applicants, isLoading: appsLoading } = useQuery(
    trpc.applicants.list.queryOptions(),
  );

  if (jobLoading || appsLoading) {
    return (
      <div className="w-full space-y-12 animate-pulse">
        <div className="h-8 w-40 bg-secondary/30 rounded-full" />
        <div className="h-16 w-3/4 bg-secondary/30 rounded-lg" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="h-[600px] bg-secondary/30 rounded-lg lg:col-span-2" />
          <div className="h-[600px] bg-secondary/30 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!job) notFound();

  const jobApplicants = (applicants || []).filter((a) => a.jobId === id);
  const screenedApplicants = jobApplicants.filter((a) => a.screening);
  const avgScore = screenedApplicants.length
    ? Math.round(
        screenedApplicants.reduce((acc, a) => acc + (a.screening?.matchScore ?? 0), 0) / screenedApplicants.length,
      )
    : 0;

  const sc = statusConfig[job.status || "active"];

  return (
    <div className="w-full space-y-12 pb-20">
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Pipeline Overview
        </button>

        <div className="flex items-center gap-4">
           <span className={cn("px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border", sc.color)}>
              {sc.label}
           </span>
           <button className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground/40" />
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-border/50 pb-12 px-2">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary border border-border/50 text-foreground/30 shadow-sm">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="h-1 w-12 bg-border/40 rounded-full" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-info/70">Job Definition</span>
          </div>
          
          <h1 className="font-display text-display-hero font-light text-foreground tracking-tight leading-[1.05] mb-8 max-w-[900px]">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 opacity-50">
             <div className="flex items-center gap-2.5 text-[14px] font-medium text-foreground tracking-tight">
                <MapPin className="h-4 w-4" />
                {job.location}
             </div>
             <div className="h-1.5 w-1.5 rounded-full bg-border" />
             <div className="flex items-center gap-2.5 text-[14px] font-medium text-foreground tracking-tight">
                <Clock className="h-4 w-4" />
                {job.type}
             </div>
             <div className="h-1.5 w-1.5 rounded-full bg-border" />
             <div className="flex items-center gap-2.5 text-[14px] font-medium text-foreground tracking-tight">
                <Briefcase className="h-4 w-4" />
                {job.department}
             </div>
          </div>
        </div>

        <Link href="/dashboard/screening">
          <button className="h-12 px-10 rounded-full bg-primary text-primary-foreground text-[13px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-[0.98] shadow-sm">
            <Sparkles className="h-4 w-4" />
            Generate Match Report
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 items-start">
        <div className="space-y-12 lg:col-span-2">
          <section>
             <h3 className="font-display text-display-card font-light text-foreground uppercase tracking-[0.1em] mb-8 px-2">Position Overview</h3>
             <div className="bg-background rounded-lg border border-border p-10 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <p className="whitespace-pre-wrap text-foreground/80 text-[16px] leading-relaxed font-medium tracking-tight">
                  {job.description}
                </p>
             </div>
          </section>

          <section>
             <h3 className="font-display text-display-card font-light text-foreground uppercase tracking-[0.1em] mb-8 px-2">Expertise Required</h3>
             <div className="bg-background rounded-lg border border-border p-10 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-4 text-[15px] font-medium text-foreground/70 tracking-tight">
                      <div className="mt-2 h-1.5 w-1.5 rounded-full bg-info/40 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
             </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8 px-2">
               <h3 className="font-display text-display-card font-light text-foreground uppercase tracking-[0.1em]">Candidate Pipeline</h3>
               <Link href="/dashboard/applicants" className="text-[11px] font-bold text-info hover:text-info/80 transition-colors uppercase tracking-[0.2em]">Enter pool <ChevronRight className="inline-block h-3 w-3 ml-1 opacity-40" /></Link>
            </div>
            <div className="space-y-3">
              {jobApplicants.length > 0 ? (
                jobApplicants.slice(0, 10).map((applicant, i) => (
                  <motion.div key={applicant.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                    <Link href={`/dashboard/applicants/${applicant.id}` as Route} className="group flex items-center justify-between bg-background rounded-lg border border-border p-6 transition-all hover:border-foreground/10 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                      <div className="flex items-center gap-6">
                         <div className="h-11 w-11 rounded-lg bg-secondary border border-border/50 flex items-center justify-center text-[13px] font-bold text-muted-foreground/60 uppercase shadow-sm">
                            {applicant.firstName[0]}{applicant.lastName[0]}
                         </div>
                         <div>
                            <p className="text-[15px] font-medium text-foreground tracking-tight">{applicant.firstName} {applicant.lastName}</p>
                            <p className="text-[13px] text-muted-foreground tracking-tight">{applicant.headline}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <ScoreBadge score={applicant.screening?.matchScore ?? 0} />
                         <ChevronRight className="h-4 w-4 text-muted-foreground/20 transition-all group-hover:text-foreground" />
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="py-24 text-center rounded-lg border border-dashed border-border bg-secondary/5">
                   <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground/40">No applications recorded</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <div className="bg-background rounded-lg border border-border p-10 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
             <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.1em] mb-10 border-b border-border/50 pb-6">Vitals</h3>
             <div className="space-y-8">
                {[
                  { label: "Applicants", val: jobApplicants.length },
                  { label: "Screened", val: screenedApplicants.length },
                  { label: "Shortlisted", val: jobApplicants.filter(a => a.status === "shortlisted").length, color: "text-success" },
                  { label: "Quality", val: `${avgScore}%`, color: "text-info" }
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-baseline border-b border-border/30 pb-5 last:border-0 last:pb-0">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">{s.label}</span>
                    <span className={cn("font-display text-[26px] font-light tracking-tighter leading-none", s.color || "text-foreground")}>{s.val}</span>
                  </div>
                ))}
             </div>
          </div>

          {(job.salaryMin || job.salaryMax) && (
            <div className="bg-background rounded-lg border border-border p-10 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
               <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.1em] mb-8 border-b border-border/50 pb-6">Compensation</h3>
               <div className="flex items-baseline gap-2 pt-2">
                  <span className="font-display text-[32px] font-light text-foreground tracking-tighter leading-none">
                    {job.salaryMin?.toLocaleString()}
                    {job.salaryMax ? ` – ${job.salaryMax.toLocaleString()}` : "+"}
                  </span>
                  <span className="text-[14px] text-muted-foreground/40 font-light font-display ml-1">{job.currency} /YR</span>
               </div>
            </div>
          )}

          {screenedApplicants.length > 0 && (
            <div className="bg-secondary/30 rounded-xl border border-border p-10 relative overflow-hidden group shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
               <div className="relative z-10">
                  <div className="mb-10 flex items-center justify-between border-b border-border/20 pb-6">
                    <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.1em]">Intelligence</h3>
                    <Sparkles className="h-4 w-4 text-info/60 opacity-60" />
                  </div>
                  <div className="space-y-6 pt-2">
                     <p className="text-[14px] text-foreground/80 font-medium leading-relaxed tracking-tight">
                       Pool health is <span className="text-info font-bold">Optimal</span>. {screenedApplicants.length} experts analyzed with Gemini 1.5 Pro.
                     </p>
                     <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden border border-border/10 mt-8">
                        <div className="h-full bg-info/40 rounded-full" style={{ width: `${avgScore}%` }} />
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
