"use client";

import {
  RiArrowLeftLine,
  RiArrowRightSLine,
  RiMoreLine,
  RiSparklingLine,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Route } from "next";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { QueryErrorState } from "@/components/data/query-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { ScoreBadge } from "../../dashboard/components/score-badge";

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "secondary" }
> = {
  active: {
    label: "Active Posting",
    variant: "success",
  },
  draft: {
    label: "Draft Mode",
    variant: "warning",
  },
  closed: {
    label: "Closed Posting",
    variant: "secondary",
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
        <div className="h-8 w-40 rounded-standard bg-bg2" />
        <div className="h-24 w-full rounded-card bg-bg2" />
        <div className="grid grid-cols-1 gap-comfortable lg:grid-cols-3">
          <div className="h-[600px] rounded-card bg-bg2 lg:col-span-2" />
          <div className="h-[600px] rounded-card bg-bg2" />
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

  const jobApplicants = (applicants || [])
    .filter((a) => a.jobId === id)
    .sort(
      (a, b) => (b.screening?.matchScore ?? 0) - (a.screening?.matchScore ?? 0),
    );
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
    <div className="w-full space-y-section-padding pb-section-padding">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-base font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em] transition-all hover:text-primary"
        >
          <RiArrowLeftLine className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Operations Overview
        </button>

        <div className="flex items-center gap-base">
          <Badge variant={sc.variant} size="default" uppercase>
            {sc.label}
          </Badge>
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-micro border-line"
          >
            <RiMoreLine className="h-4 w-4 text-ink-faint" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-hero border-line border-b pb-section-gap lg:flex-row lg:items-end">
        <div className="flex-1">
          <div className="mb-comfortable flex items-center gap-base">
            <span className="font-medium font-sans text-[10px] text-primary/40 uppercase tracking-[0.1em]">
              Neural Pipeline Active
            </span>
          </div>

          <h1 className="mb-base max-w-[900px] font-serif text-[42px] text-primary leading-tight">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-base gap-y-2 font-medium font-sans text-[13px] text-ink-muted uppercase tracking-wider">
            <span>{job.location}</span>
            <div className="size-1 rounded-full bg-line" />
            <span>{job.type}</span>
            <div className="size-1 rounded-full bg-line" />
            <span>{job.department}</span>
          </div>
        </div>

        <Link href="/dashboard/screening">
          <Button
            variant="outline"
            size="default"
            className="h-10 px-6 font-medium font-sans"
          >
            Neural Match Report
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-hero lg:grid-cols-3">
        <div className="space-y-section-gap lg:col-span-2">
          <section>
            <div className="mb-base">
              <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
                Architecture
              </span>
              <h3 className="mt-micro font-serif text-[22px] text-primary">
                Position Overview
              </h3>
            </div>
            <Card
              variant="default"
              className="border-line bg-bg-alt/10 p-comfortable"
            >
              <p className="whitespace-pre-wrap font-light font-sans text-[15px] text-ink-muted leading-relaxed">
                {job.description}
              </p>
            </Card>
          </section>

          <section>
            <div className="mb-base">
              <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
                Requirements
              </span>
              <h3 className="mt-micro font-serif text-[22px] text-primary">
                Strategic Benchmarks
              </h3>
            </div>
            <Card
              variant="default"
              className="border-line bg-bg-alt/10 p-comfortable"
            >
              <ul className="grid grid-cols-1 gap-x-12 gap-y-comfortable md:grid-cols-2">
                {job.requirements.map((req, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-base font-light font-sans text-[14px] text-ink-muted leading-relaxed"
                  >
                    <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary/30" />
                    {req}
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <section>
            <div className="mb-base flex items-end justify-between border-line border-b pb-small">
              <div>
                <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
                  Channel
                </span>
                <h3 className="mt-micro font-serif text-[22px] text-primary">
                  Expert Pipeline
                </h3>
              </div>
              <Link
                href="/dashboard/applicants"
                className="flex items-center gap-micro font-medium font-sans text-[11px] text-primary/60 uppercase tracking-wider transition-colors hover:text-primary"
              >
                View Full Analysis{" "}
                <RiArrowRightSLine className="size-3.5 opacity-40" />
              </Link>
            </div>
            <div className="space-y-base">
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
                      className="group flex items-center justify-between rounded-standard border border-line bg-surface p-base transition-all hover:bg-bg2"
                    >
                      <div className="flex items-center gap-base">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-micro border border-line bg-bg-alt/30 font-medium font-sans text-[13px] text-ink-faint uppercase transition-transform group-hover:scale-[1.05]">
                          <span className="absolute -top-1.5 -left-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary font-mono text-[9px] text-white">
                            {i + 1}
                          </span>
                          {applicant.firstName[0]}
                          {applicant.lastName[0]}
                        </div>
                        <div>
                          <p className="font-serif text-[18px] text-primary leading-tight transition-colors group-hover:text-primary-muted">
                            {applicant.firstName} {applicant.lastName}
                          </p>
                          <p className="mt-1 font-light font-sans text-[12px] text-ink-muted tracking-tight">
                            {applicant.headline}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-comfortable">
                        <ScoreBadge
                          score={applicant.screening?.matchScore ?? 0}
                        />
                        <RiArrowRightSLine className="h-4 w-4 text-ink-faint opacity-20 transition-all group-hover:text-primary group-hover:opacity-100" />
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-card border border-line border-dashed bg-bg-alt/10 py-20 text-center">
                  <p className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                    Awaiting Signal Analysis
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-comfortable">
          <Card variant="default" size="none" className="overflow-hidden">
            <CardHeader>
              <CardDescription>Metrics</CardDescription>
              <CardTitle>Neural Vitals</CardTitle>
            </CardHeader>
            <div className="space-y-comfortable bg-surface p-comfortable">
              {[
                { label: "Applicants", val: jobApplicants.length },
                { label: "Screened Today", val: screenedApplicants.length },
                {
                  label: "Shortlisted",
                  val: jobApplicants.filter((a) => a.status === "shortlisted")
                    .length,
                  color: "text-status-success-text",
                },
                {
                  label: "Quality Index",
                  val: `${avgScore}%`,
                  color: "text-primary",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between border-line border-b pb-base last:border-0 last:pb-0"
                >
                  <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                    {s.label}
                  </span>
                  <span
                    className={cn(
                      "font-serif text-[26px] leading-none",
                      s.color || "text-primary",
                    )}
                  >
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {(job.salaryMin || job.salaryMax) && (
            <Card variant="default" size="none" className="overflow-hidden">
              <CardHeader>
                <CardDescription>Market Rate</CardDescription>
                <CardTitle>Compensation</CardTitle>
              </CardHeader>
              <div className="bg-surface px-comfortable py-base">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-[28px] text-primary leading-none">
                    {job.salaryMin?.toLocaleString()}
                    {job.salaryMax
                      ? ` – ${job.salaryMax.toLocaleString()}`
                      : "+"}
                  </span>
                  <span className="font-medium font-sans text-[11px] text-ink-faint">
                    {job.currency} / YR
                  </span>
                </div>
              </div>
            </Card>
          )}

          {screenedApplicants.length > 0 && (
            <Card
              variant="default"
              className="group relative overflow-hidden border-line bg-primary-alpha p-comfortable"
              size="none"
            >
              <div className="relative z-10 space-y-base">
                <div className="flex items-center justify-between">
                  <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-widest">
                    Intelligence Summary
                  </span>
                  <RiSparklingLine className="size-4 text-primary/20" />
                </div>
                <p className="font-light font-sans text-[14px] text-primary leading-relaxed">
                  The candidate pool is{" "}
                  <span className="font-bold">Highly Qualified</span>.{" "}
                  {screenedApplicants.length} experts analyzed with detailed
                  reasoning.
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${avgScore}%` }}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
