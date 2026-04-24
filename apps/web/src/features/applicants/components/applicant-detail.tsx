"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound, useRouter } from "next/navigation";
import { QueryErrorState } from "@/components/data/query-state";
import { trpc } from "@/utils/trpc";
import { AIAnalysisCard } from "./ai-analysis-card";
import { ApplicantSidebar } from "./applicant-sidebar";
import { CertificationsCard } from "./certifications-card";
import { EducationCard } from "./education-card";
import { ExperienceCard } from "./experience-card";
import { LanguagesCard } from "./languages-card";
import { ProjectsCard } from "./projects-card";
import { SkillsCard } from "./skills-card";

interface ApplicantDetailProps {
  id: string;
}

export function ApplicantDetail({ id }: ApplicantDetailProps) {
  const router = useRouter();
  const applicantQuery = useQuery(trpc.applicants.getById.queryOptions({ id }));
  const jobQuery = useQuery(
    trpc.jobs.getById.queryOptions(
      { id: applicantQuery.data?.jobId ?? "" },
      { enabled: !!applicantQuery.data?.jobId },
    ),
  );

  if (applicantQuery.isLoading || jobQuery.isLoading) {
    return (
      <div className="w-full animate-pulse space-y-12">
        <div className="h-8 w-40 rounded-full bg-secondary/30" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="h-[700px] rounded-3xl bg-secondary/30 lg:col-span-1" />
          <div className="h-[700px] rounded-3xl bg-secondary/30 lg:col-span-3" />
        </div>
      </div>
    );
  }

  if (applicantQuery.isError) {
    return (
      <QueryErrorState
        error={applicantQuery.error}
        title="Applicant details couldn't be loaded"
        onRetry={() => applicantQuery.refetch()}
      />
    );
  }

  if (jobQuery.isError) {
    return (
      <QueryErrorState
        error={jobQuery.error}
        title="Related job details couldn't be loaded"
        onRetry={() => jobQuery.refetch()}
      />
    );
  }

  const applicant = applicantQuery.data;
  const job = jobQuery.data;

  if (!applicant) notFound();

  return (
    <div className="w-full space-y-12 pb-20">
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 font-bold text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] transition-all hover:text-foreground"
        >
          Candidate Pool
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-4">
        <ApplicantSidebar applicant={applicant} jobTitle={job?.title} />

        <div className="space-y-16 lg:col-span-3">
          {applicant.screening && (
            <section>
              <div className="mb-8 px-2">
                <h3 className="font-display font-light text-[16px] text-foreground uppercase tracking-[0.15em] opacity-50">
                  Intelligence Evaluation
                </h3>
              </div>
              <AIAnalysisCard screening={applicant.screening} />
            </section>
          )}

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <ExperienceCard experience={applicant.experience} />
            <div className="space-y-12">
              <SkillsCard skills={applicant.skills} />
              <LanguagesCard languages={applicant.languages} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <EducationCard education={applicant.education} />
            <CertificationsCard certifications={applicant.certifications} />
          </div>

          <ProjectsCard projects={applicant.projects} />
        </div>
      </div>
    </div>
  );
}
