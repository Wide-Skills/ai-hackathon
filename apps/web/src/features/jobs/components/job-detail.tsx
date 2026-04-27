"use client";

import {
  RiArrowLeftLine,
  RiArrowRightSLine,
  RiMoreLine,
  RiSparklingLine,
} from "@remixicon/react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Route } from "next";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { QueryErrorState } from "@/components/data/query-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { invalidateHiringData, trpc } from "@/utils/trpc";
import { ScoreBadge } from "../../dashboard/components/score-badge";
import { CandidateComparison } from "./candidate-comparison";
import { JobAnalytics } from "./job-analytics";

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
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const jobQuery = useQuery(trpc.jobs.getById.queryOptions({ id }));
  const applicantsQuery = useQuery({
    ...trpc.applicants.list.queryOptions({ page: 1, limit: 100 }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation(
    trpc.jobs.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Job and related data deleted successfully");
        void invalidateHiringData(queryClient);
        router.push("/dashboard/jobs");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete job");
        setIsDeleting(false);
      },
    }),
  );

  const isLoading =
    (jobQuery.isPending && !jobQuery.data) ||
    (applicantsQuery.isPending && !applicantsQuery.data);

  if (isLoading) {
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

  if (!job) notFound();

  const jobApplicants = (applicantsQuery.data?.items || [])
    .filter((a) => a.jobId === id)
    .sort(
      (a, b) =>
        (b.screening?.manualScore ?? b.screening?.matchScore ?? 0) -
        (a.screening?.manualScore ?? a.screening?.matchScore ?? 0),
    );
  const topApplicantIds = jobApplicants
    .filter((a) => a.screening)
    .slice(0, 3)
    .map((a) => a.id);
  const screenedApplicants = jobApplicants.filter((a) => a.screening);
  const avgScore = screenedApplicants.length
    ? Math.round(
        screenedApplicants.reduce(
          (acc, a) =>
            acc + (a.screening?.manualScore ?? a.screening?.matchScore ?? 0),
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
          <Link href={`/dashboard/jobs/${id}/edit` as Route}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-micro border-line font-medium font-sans text-[11px] uppercase tracking-wider"
            >
              Edit Details
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  disabled={isDeleting}
                  variant="outline"
                  size="sm"
                  className="rounded-micro border-line font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider hover:border-status-error-text/30 hover:bg-status-error-bg hover:text-status-error-text"
                />
              }
            >
              {isDeleting ? "Deleting..." : "Delete Job"}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this job? All related
                  applicants and screenings will be permanently removed. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setIsDeleting(true);
                    deleteMutation.mutate({ id });
                  }}
                  className="bg-status-error-bg text-status-error-text hover:bg-status-error-bg/80"
                >
                  Delete Job & Related Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
              Active Pipeline
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
            AI Screening Report
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-hero lg:grid-cols-3">
        <div className="space-y-section-gap lg:col-span-2">
          <section>
            <div className="mb-base flex items-center justify-between border-line border-b pb-small">
              <div>
                <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
                  Performance
                </span>
                <h3 className="mt-micro font-serif text-[22px] text-primary">
                  Intelligence Overview
                </h3>
              </div>
            </div>
            {job.screeningFocus && (
              <div className="mb-comfortable rounded-standard border border-primary/20 bg-primary-alpha/5 p-base">
                <div className="flex items-center gap-base">
                  <RiSparklingLine className="size-3.5 text-primary/60" />
                  <span className="font-medium font-sans text-[10px] text-primary uppercase tracking-widest">
                    AI Custom Focus
                  </span>
                </div>
                <p className="mt-1 pl-7 font-sans text-[13px] text-ink-muted italic">
                  "{job.screeningFocus}"
                </p>
              </div>
            )}
            <JobAnalytics jobId={id} />
          </section>

          <section>
            <div className="mb-base flex items-center justify-between border-line border-b pb-small">
              <div>
                <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
                  Benchmarking
                </span>
                <h3 className="mt-micro font-serif text-[22px] text-primary">
                  Top Candidate Comparison
                </h3>
              </div>
            </div>
            <CandidateComparison jobId={id} applicantIds={topApplicantIds} />
          </section>

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
                    Awaiting AI Analysis
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
              <CardTitle>Statistics</CardTitle>
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
                  label: "Average Match",
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

          <Card
            variant="default"
            size="none"
            className="overflow-hidden border-primary/10"
          >
            <CardHeader className="bg-primary-alpha/5">
              <CardDescription>AI Target</CardDescription>
              <CardTitle className="text-primary">Benchmarks</CardTitle>
            </CardHeader>
            <div className="space-y-base bg-surface p-comfortable">
              <div className="flex items-center justify-between border-line border-b pb-base">
                <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                  Min. Experience
                </span>
                <span className="font-serif text-[20px] text-primary">
                  {job.minExperience} Years
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                  Required Education
                </span>
                <span className="font-serif text-[20px] text-primary">
                  {job.educationLevel}
                </span>
              </div>
              {job.techStack.length > 0 && (
                <div className="mt-base space-y-2 border-line border-t pt-base">
                  <span className="block font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                    Core Stack
                  </span>
                  <div className="flex flex-wrap gap-small">
                    {job.techStack.map((tech, i) => (
                      <Badge
                        key={i}
                        variant="success"
                        size="xs"
                        className="px-2 py-0"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
                  <span className="font-bold">
                    {avgScore >= 85
                      ? "Highly Qualified"
                      : avgScore >= 70
                        ? "Well Qualified"
                        : "Developing"}
                  </span>
                  . {screenedApplicants.length} experts analyzed with detailed
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
