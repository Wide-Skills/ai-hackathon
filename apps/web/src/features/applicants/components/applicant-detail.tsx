"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";
import { AIAnalysisCard } from "./ai-analysis-card";
import { ApplicantSidebar } from "./applicant-sidebar";
import { CertificationsCard } from "./certifications-card";
import { EducationCard } from "./education-card";
import { ExperienceCard } from "./experience-card";
import { ProjectsCard } from "./projects-card";
import { SkillsCard } from "./skills-card";

interface ApplicantDetailProps {
  id: string;
}

export function ApplicantDetail({ id }: ApplicantDetailProps) {
  const { data: applicants, isLoading: appsLoading } = useQuery(
    trpc.applicants.list.queryOptions(),
  );
  const { data: jobs, isLoading: jobsLoading } = useQuery(
    trpc.jobs.list.queryOptions(),
  );

  if (appsLoading || jobsLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 w-full lg:col-span-1" />
          <Skeleton className="h-96 w-full lg:col-span-2" />
        </div>
      </div>
    );
  }

  const applicant = (applicants || []).find((a) => a.id === id);
  if (!applicant) notFound();

  const job = (jobs || []).find((j) => j.id === applicant.jobId);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/applicants">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applicants
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ApplicantSidebar applicant={applicant} jobTitle={job?.title} />

        <div className="space-y-5 lg:col-span-2">
          {applicant.screening && (
            <AIAnalysisCard screening={applicant.screening} />
          )}

          <SkillsCard skills={applicant.skills} />

          <ExperienceCard experience={applicant.experience} />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <EducationCard education={applicant.education} />
            <CertificationsCard certifications={applicant.certifications} />
          </div>

          <ProjectsCard projects={applicant.projects} />
        </div>
      </div>
    </div>
  );
}
