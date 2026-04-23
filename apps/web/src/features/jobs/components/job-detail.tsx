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
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
        <div className="h-8 w-40 bg-secondary/30 rounded-pill" />
        <div className="h-24 w-full bg-secondary/30 rounded-section" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="h-[600px] bg-secondary/30 rounded-section lg:col-span-2" />
          <div className="h-[600px] bg-secondary/30 rounded-section" />
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
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground transition-all"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Pipeline Overview
        </button>

        <div className="flex items-center gap-4">
           <Badge variant={job.status as any || "info"} className="shadow-ethereal">
              {sc.label}
           </Badge>
           <Button variant="outline" size="icon-sm" className="rounded-full h-9 w-9">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground/40" />
           </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-border/10 pb-12 px-2">
        <div className="flex-1">
          <div className="flex items-center gap-5 mb-8">
            <div className="h-px w-10 bg-border/20 rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/40">Neural Analysis Active</span>
          </div>
          
          <h1 className="font-display text-display-hero font-light text-foreground tracking-tight leading-[1.05] mb-8 max-w-[900px]">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 opacity-40 font-medium tracking-tight text-[14px]">
             <span>{job.location}</span>
             <div className="h-1 w-1 rounded-full bg-border/40" />
             <span>{job.type}</span>
             <div className="h-1 w-1 rounded-full bg-border/40" />
             <span>{job.department}</span>
          </div>
        </div>

        <Link href="/dashboard/screening">
          <button className="btn-pill-warm h-12 px-10 text-[12px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Sparkles className="h-4 w-4" />
            Neural Match Report
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 items-start">
        <div className="space-y-12 lg:col-span-2">
          <section>
             <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.15em] mb-8 px-2 opacity-50">Position Overview</h3>
             <Card className="p-10 shadow-premium border-border/50">
                <p className="whitespace-pre-wrap text-foreground/70 text-[16px] leading-relaxed font-medium tracking-tight">
                  {job.description}
                </p>
             </Card>
          </section>

          <section>
             <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.15em] mb-8 px-2 opacity-50">Strategic Requirements</h3>
             <Card className="p-10 shadow-premium border-border/50">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-4 text-[15px] font-medium text-foreground/60 tracking-tight leading-relaxed">
                      <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-info/30 flex-shrink-0 shadow-ethereal" />
                      {req}
                    </li>
                  ))}
                </ul>
             </Card>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8 px-2">
               <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.15em] opacity-50">Expert Pipeline</h3>
               <Link href="/dashboard/applicants" className="text-[10px] font-bold text-info/70 hover:text-info transition-colors uppercase tracking-[0.2em]">View Analysis <ChevronRight className="inline-block h-3 w-3 ml-1 opacity-40" /></Link>
            </div>
            <div className="space-y-4">
              {jobApplicants.length > 0 ? (
                jobApplicants.slice(0, 10).map((applicant, i) => (
                  <motion.div key={applicant.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                    <Link href={`/dashboard/applicants/${applicant.id}` as Route} className="group flex items-center justify-between bg-background rounded-xl border border-border/50 p-6 transition-all hover:border-primary/20 hover:shadow-premium shadow-ethereal">
                      <div className="flex items-center gap-6">
                         <div className="h-12 w-12 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-center text-[13px] font-bold text-muted-foreground/40 uppercase shadow-ethereal group-hover:scale-[1.05] transition-transform">
                            {applicant.firstName[0]}{applicant.lastName[0]}
                         </div>
                         <div>
                            <p className="text-[15px] font-medium text-foreground tracking-tight group-hover:text-primary transition-colors">{applicant.firstName} {applicant.lastName}</p>
                            <p className="text-[12px] text-muted-foreground/60 font-medium tracking-tight mt-0.5">{applicant.headline}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <ScoreBadge score={applicant.screening?.matchScore ?? 0} />
                         <ChevronRight className="h-4 w-4 text-muted-foreground/10 transition-all group-hover:text-foreground" />
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="py-24 text-center rounded-section border border-dashed border-border/50 bg-secondary/5">
                   <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">No applications recorded</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <Card className="p-10 shadow-premium border-border/50">
             <h3 className="font-display text-[14px] font-light text-foreground uppercase tracking-[0.2em] mb-10 border-b border-border/10 pb-6 opacity-60">Neural Vitals</h3>
             <div className="space-y-8">
                {[
                  { label: "Applicants", val: jobApplicants.length },
                  { label: "Screened", val: screenedApplicants.length },
                  { label: "Shortlisted", val: jobApplicants.filter(a => a.status === "shortlisted").length, color: "text-success/80" },
                  { label: "Match Index", val: `${avgScore}%`, color: "text-info/80" }
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-baseline border-b border-border/5 last:border-0 pb-6 last:pb-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">{s.label}</span>
                    <span className={cn("font-display text-[28px] font-light tracking-tighter leading-none", s.color || "text-foreground")}>{s.val}</span>
                  </div>
                ))}
             </div>
          </Card>

          {(job.salaryMin || job.salaryMax) && (
            <Card className="p-10 shadow-premium border-border/50 bg-accent/[0.03]">
               <h3 className="font-display text-[14px] font-light text-foreground uppercase tracking-[0.2em] mb-8 border-b border-border/10 pb-6 opacity-60">Compensation</h3>
               <div className="flex items-baseline gap-2 pt-2">
                  <span className="font-display text-[32px] font-light text-foreground tracking-tighter leading-none">
                    {job.salaryMin?.toLocaleString()}
                    {job.salaryMax ? ` – ${job.salaryMax.toLocaleString()}` : "+"}
                  </span>
                  <span className="text-[13px] text-muted-foreground/30 font-light font-display ml-1">{job.currency} /YR</span>
               </div>
            </Card>
          )}

          {screenedApplicants.length > 0 && (
            <div className="bg-accent/10 rounded-section border border-border/50 p-10 relative overflow-hidden group shadow-warm-lift transition-all hover:shadow-lift">
               <div className="relative z-10">
                  <div className="mb-10 flex items-center justify-between border-b border-border/10 pb-6">
                    <h3 className="font-display text-[14px] font-light text-foreground uppercase tracking-[0.2em] opacity-60">Intelligence</h3>
                    <Sparkles className="h-4 w-4 text-info/40" />
                  </div>
                  <div className="space-y-6 pt-2">
                     <p className="text-[14px] text-foreground/70 font-medium leading-relaxed tracking-tight">
                       Pool architecture is <span className="text-info font-bold">Optimal</span>. {screenedApplicants.length} experts analyzed with Gemini 1.5 Pro.
                     </p>
                     <div className="h-1 w-full bg-background/50 rounded-pill overflow-hidden border border-border/10 mt-10 shadow-inset">
                        <div className="h-full bg-info/40 rounded-pill shadow-ethereal" style={{ width: `${avgScore}%` }} />
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
