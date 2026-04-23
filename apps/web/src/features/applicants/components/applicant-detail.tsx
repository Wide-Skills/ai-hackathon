"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { ApplicantSidebar } from "./applicant-sidebar";
import { ExperienceCard } from "./experience-card";
import { SkillsCard } from "./skills-card";
import { AIAnalysisCard } from "./ai-analysis-card";
import { EducationCard } from "./education-card";
import { CertificationsCard } from "./certifications-card";
import { ProjectsCard } from "./projects-card";

interface ApplicantDetailProps {
  id: string;
}

export function ApplicantDetail({ id }: ApplicantDetailProps) {
  const router = useRouter();
  const { data: applicant, isLoading: appLoading } = useQuery(
    trpc.applicants.getById.queryOptions({ id }),
  );
  const { data: job, isLoading: jobLoading } = useQuery(
    trpc.jobs.getById.queryOptions({ id: applicant?.jobId ?? "" }),
    { enabled: !!applicant?.jobId },
  );

  if (appLoading || jobLoading) {
    return (
      <div className="w-full space-y-12 animate-pulse">
        <div className="h-8 w-40 bg-secondary/30 rounded-full" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div className="h-[600px] bg-secondary/30 rounded-xl lg:col-span-1" />
          <div className="h-[600px] bg-secondary/30 rounded-xl lg:col-span-3" />
        </div>
      </div>
    );
  }

  if (!applicant) notFound();

  return (
    <div className="w-full space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Candidate Pool
        </button>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 items-start">
        <ApplicantSidebar applicant={applicant} jobTitle={job?.title} />

        <div className="lg:col-span-3 space-y-10">
          {applicant.screening && (
            <section>
               <div className="mb-6">
                  <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.12em]">Intelligence Analysis</h3>
               </div>
               <AIAnalysisCard screening={applicant.screening} />
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ExperienceCard experience={applicant.experience} />
            <SkillsCard skills={applicant.skills} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <EducationCard education={applicant.education} />
            <CertificationsCard certifications={applicant.certifications} />
          </div>

          <ProjectsCard projects={applicant.projects} />
        </div>
      </div>
    </div>
  );
}
