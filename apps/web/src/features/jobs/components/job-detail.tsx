"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  Cpu,
  DollarSign,
  ExternalLink,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { MatchScore } from "../../applicants/components/match-score";

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-success/10 text-success border-success/20",
  },
  draft: {
    label: "Draft",
    color: "bg-muted text-muted-foreground border-border",
  },
  closed: {
    label: "Closed",
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

interface JobDetailProps {
  id: string;
}

export function JobDetail({ id }: JobDetailProps) {
  const { data: job, isLoading: jobLoading } = useQuery(
    trpc.jobs.getById.queryOptions({ id }),
  );
  const { data: applicants, isLoading: appsLoading } = useQuery(
    trpc.applicants.list.queryOptions(),
  );

  if (jobLoading || appsLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 w-full lg:col-span-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

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
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/jobs">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-2xl text-foreground">
                {job.title}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-medium text-xs",
                  sc.color,
                )}
              >
                {sc.label}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              {job.department && (
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {job.department}
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {job.type}
              </span>
              {job.closingDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Closes {job.closingDate}
                </span>
              )}
            </div>
          </div>
        </div>
        <Link href="/dashboard/screening">
          <Button
            size="sm"
            className="gap-1.5 bg-primary font-semibold text-white hover:bg-primary/90"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Run AI Screening
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold text-base">
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground text-sm leading-relaxed">
                {job.description}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold text-base">
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements.map((req) => (
                  <li key={req} className="flex items-start gap-2 text-sm">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span className="text-foreground/80">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {job.skills.length > 0 && (
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-semibold text-base">
                  Required Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-primary/20 bg-primary/10 px-3 py-1 text-primary text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-semibold text-base">
                Applicants ({jobApplicants.length})
              </CardTitle>
              <Link
                href="/dashboard/applicants"
                className="flex items-center gap-1 font-medium text-primary text-sm hover:text-primary/90"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {jobApplicants.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground/70">
                  <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
                  <p className="font-medium">No applicants yet</p>
                  <p className="mt-1 text-sm">
                    Candidates will appear here once they apply
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {jobApplicants.slice(0, 10).map((applicant) => (
                    <Link
                      key={applicant.id}
                      href={`/dashboard/applicants/${applicant.id}` as Route}
                      className="group flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-muted/50"
                    >
                      {applicant.avatarUrl ? (
                        <img
                          src={applicant.avatarUrl}
                          alt=""
                          className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary font-bold text-sm text-white">
                          {applicant.firstName[0]}
                          {applicant.lastName[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground text-sm transition-colors group-hover:text-primary">
                          {applicant.firstName} {applicant.lastName}
                        </p>
                        <p className="truncate text-muted-foreground text-xs">
                          {applicant.headline}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {applicant.screening ? (
                          <MatchScore score={applicant.screening.matchScore} />
                        ) : (
                          <span className="flex items-center gap-1 text-muted-foreground/70 text-xs">
                            <Cpu className="h-3 w-3 animate-pulse" />
                            Pending
                          </span>
                        )}
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/30 transition-colors group-hover:text-primary" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold text-sm">
                Position Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Total Applicants
                </span>
                <span className="font-bold text-foreground text-sm">
                  {jobApplicants.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Screened</span>
                <span className="font-bold text-foreground text-sm">
                  {screenedApplicants.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Avg AI Score
                </span>
                <span className="font-bold text-primary text-sm">
                  {avgScore}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Shortlisted
                </span>
                <span className="font-bold text-sm text-success">
                  {
                    jobApplicants.filter((a) => a.status === "shortlisted")
                      .length
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {(job.salaryMin || job.salaryMax) && (
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-semibold text-sm">
                  Compensation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-foreground text-lg">
                    {job.salaryMin?.toLocaleString()}
                    {job.salaryMax
                      ? ` – ${job.salaryMax.toLocaleString()}`
                      : "+"}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {job.currency}/yr
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {screenedApplicants.length > 0 && (
            <Card className="border-border bg-foreground shadow-sm">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="font-semibold text-sm text-white">
                    AI Screening Summary
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Screened",
                      value: screenedApplicants.length.toString(),
                    },
                    { label: "Avg Score", value: `${avgScore}%` },
                    {
                      label: "Top Match",
                      value: `${Math.max(
                        ...screenedApplicants.map(
                          (a) => a.screening?.matchScore ?? 0,
                        ),
                      )}%`,
                    },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="font-bold text-lg text-white">{s.value}</p>
                      <p className="text-[10px] text-white/50">{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
