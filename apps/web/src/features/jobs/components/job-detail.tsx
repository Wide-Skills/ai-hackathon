"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { QueryErrorState } from "@/components/data/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { ScoreBadge } from "../../dashboard/components/score-badge";

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
  const jobQuery = useQuery(trpc.jobs.getById.queryOptions({ id }));
  const applicantsQuery = useQuery(trpc.applicants.list.queryOptions());

  if (jobQuery.isLoading || applicantsQuery.isLoading) {
    return (
      <div className="w-full animate-pulse space-y-12">
        <div className="h-8 w-40 rounded-pill bg-secondary/30" />
        <div className="h-24 w-full rounded-section bg-secondary/30" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="h-[600px] rounded-section bg-secondary/30 lg:col-span-2" />
          <div className="h-[600px] rounded-section bg-secondary/30" />
        </div>
      </div>
    );
  }

  if (jobQuery.isError) {
    return (
      <QueryErrorState
        error={jobQuery.error}
        title="Job details couldn't be loaded"
        onRetry={() => jobQuery.refetch()}
      />
    );
  }

  if (applicantsQuery.isError) {
    return (
      <QueryErrorState
        error={applicantsQuery.error}
        title="Applicants for this job couldn't be loaded"
        onRetry={() => applicantsQuery.refetch()}
      />
    );
  }

  const job = jobQuery.data;
  const applicants = applicantsQuery.data;

  if (!job) notFound();

  const jobApplicants = (applicants || []).filter((a) => a.jobId === id);
  const screenedApplicants = jobApplicants.filter((a) => a.screening);
  const avgScore = screenedApplicants.length
    ? Math.round(
        screenedApplicants.reduce(
          (acc, a) => acc + (a.screening?.matchScore ?? 0),
          0,
        ) / screenedApplicants.length,
      )
    : 0;

  const sc = statusConfig[job.status || "active"];

  return (
    <div className="w-full space-y-12 pb-20">
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 font-bold text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] transition-all hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Pipeline Overview
        </button>

        <div className="flex items-center gap-4">
          <Badge
            variant={(job.status as any) || "info"}
            className="shadow-ethereal"
          >
            {sc.label}
          </Badge>
          <Button
            variant="outline"
            size="icon-sm"
            className="h-9 w-9 rounded-full"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground/40" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-12 border-border/10 border-b px-2 pb-12 lg:flex-row lg:items-end">
        <div className="flex-1">
          <div className="mb-8 flex items-center gap-5">
            <div className="h-px w-10 rounded-full bg-border/20" />
            <span className="font-bold text-[10px] text-primary/40 uppercase tracking-[0.25em]">
              Neural Analysis Active
            </span>
          </div>

          <h1 className="mb-8 max-w-[900px] font-display font-light text-display-hero text-foreground leading-[1.05] tracking-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 font-medium text-[14px] tracking-tight opacity-40">
            <span>{job.location}</span>
            <div className="h-1 w-1 rounded-full bg-border/40" />
            <span>{job.type}</span>
            <div className="h-1 w-1 rounded-full bg-border/40" />
            <span>{job.department}</span>
          </div>
        </div>

        <Link href="/dashboard/screening">
          <Button variant="outline" size="lg">
            Neural Match Report
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          <section>
            <h3 className="mb-8 px-2 font-display font-light text-[16px] text-foreground uppercase tracking-[0.15em] opacity-50">
              Position Overview
            </h3>
            <Card className="border-border/50 p-10 shadow-premium">
              <p className="whitespace-pre-wrap font-medium text-[16px] text-foreground/70 leading-relaxed tracking-tight">
                {job.description}
              </p>
            </Card>
          </section>

          <section>
            <h3 className="mb-8 px-2 font-display font-light text-[16px] text-foreground uppercase tracking-[0.15em] opacity-50">
              Strategic Requirements
            </h3>
            <Card className="border-border/50 p-10 shadow-premium">
              <ul className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
                {job.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 font-medium text-[15px] text-foreground/60 leading-relaxed tracking-tight"
                  >
                    <div className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-info/30 shadow-ethereal" />
                    {req}
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section>
            <div className="mb-8 flex items-center justify-between px-2">
              <h3 className="font-display font-light text-[16px] text-foreground uppercase tracking-[0.15em] opacity-50">
                Expert Pipeline
              </h3>
              <Link
                href="/dashboard/applicants"
                className="font-bold text-[10px] text-info/70 uppercase tracking-[0.2em] transition-colors hover:text-info"
              >
                View Analysis{" "}
                <ChevronRight className="ml-1 inline-block h-3 w-3 opacity-40" />
              </Link>
            </div>
            <div className="space-y-4">
              {jobApplicants.length > 0 ? (
                jobApplicants.slice(0, 10).map((applicant, i) => (
                  <motion.div
                    key={applicant.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <Link
                      href={`/dashboard/applicants/${applicant.id}` as Route}
                      className="group flex items-center justify-between rounded-xl border border-border/50 bg-background p-6 shadow-ethereal transition-all hover:border-primary/20 hover:shadow-premium"
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/30 bg-secondary/30 font-bold text-[13px] text-muted-foreground/40 uppercase shadow-ethereal transition-transform group-hover:scale-[1.05]">
                          {applicant.firstName[0]}
                          {applicant.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-[15px] text-foreground tracking-tight transition-colors group-hover:text-primary">
                            {applicant.firstName} {applicant.lastName}
                          </p>
                          <p className="mt-0.5 font-medium text-[12px] text-muted-foreground/60 tracking-tight">
                            {applicant.headline}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <ScoreBadge
                          score={applicant.screening?.matchScore ?? 0}
                        />
                        <ChevronRight className="h-4 w-4 text-muted-foreground/10 transition-all group-hover:text-foreground" />
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-section border border-border/50 border-dashed bg-secondary/5 py-24 text-center">
                  <p className="font-bold text-[11px] text-muted-foreground/30 uppercase tracking-[0.2em]">
                    No applications recorded
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <Card className="border-border/50 p-10 shadow-premium">
            <h3 className="mb-10 border-border/10 border-b pb-6 font-display font-light text-[14px] text-foreground uppercase tracking-[0.2em] opacity-60">
              Neural Vitals
            </h3>
            <div className="space-y-8">
              {[
                { label: "Applicants", val: jobApplicants.length },
                { label: "Screened", val: screenedApplicants.length },
                {
                  label: "Shortlisted",
                  val: jobApplicants.filter((a) => a.status === "shortlisted")
                    .length,
                  color: "text-success/80",
                },
                {
                  label: "Match Index",
                  val: `${avgScore}%`,
                  color: "text-info/80",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between border-border/5 border-b pb-6 last:border-0 last:pb-0"
                >
                  <span className="font-bold text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">
                    {s.label}
                  </span>
                  <span
                    className={cn(
                      "font-display font-light text-[28px] leading-none tracking-tighter",
                      s.color || "text-foreground",
                    )}
                  >
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {(job.salaryMin || job.salaryMax) && (
            <Card className="border-border/50 bg-accent/[0.03] p-10 shadow-premium">
              <h3 className="mb-8 border-border/10 border-b pb-6 font-display font-light text-[14px] text-foreground uppercase tracking-[0.2em] opacity-60">
                Compensation
              </h3>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="font-display font-light text-[32px] text-foreground leading-none tracking-tighter">
                  {job.salaryMin?.toLocaleString()}
                  {job.salaryMax ? ` – ${job.salaryMax.toLocaleString()}` : "+"}
                </span>
                <span className="ml-1 font-display font-light text-[13px] text-muted-foreground/30">
                  {job.currency} /YR
                </span>
              </div>
            </Card>
          )}

          {screenedApplicants.length > 0 && (
            <div className="group relative overflow-hidden rounded-section border border-border/50 bg-accent/10 p-10 shadow-warm-lift transition-all hover:shadow-lift">
              <div className="relative z-10">
                <div className="mb-10 flex items-center justify-between border-border/10 border-b pb-6">
                  <h3 className="font-display font-light text-[14px] text-foreground uppercase tracking-[0.2em] opacity-60">
                    Intelligence
                  </h3>
                  <Sparkles className="h-4 w-4 text-info/40" />
                </div>
                <div className="space-y-6 pt-2">
                  <p className="font-medium text-[14px] text-foreground/70 leading-relaxed tracking-tight">
                    Pool architecture is{" "}
                    <span className="font-bold text-info">Optimal</span>.{" "}
                    {screenedApplicants.length} experts analyzed with Gemini 1.5
                    Pro.
                  </p>
                  <div className="mt-10 h-1 w-full overflow-hidden rounded-pill border border-border/10 bg-background/50 shadow-inset">
                    <div
                      className="h-full rounded-pill bg-info/40 shadow-ethereal"
                      style={{ width: `${avgScore}%` }}
                    />
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
