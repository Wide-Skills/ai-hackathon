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
    trpc.jobs.getById.queryOptions(
      { id: applicant?.jobId ?? "" },
      { enabled: !!applicant?.jobId },
    ),
  );

  if (appLoading || jobLoading) {
    return (
      <div className="w-full space-y-12 animate-pulse">
        <div className="h-8 w-40 bg-secondary/30 rounded-pill" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="h-[700px] bg-secondary/30 rounded-section lg:col-span-1" />
          <div className="h-[700px] bg-secondary/30 rounded-section lg:col-span-3" />
        </div>
      </div>
    );
  }

  if (!applicant) notFound();

  return (
    <div className="w-full space-y-12 pb-20">
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground transition-all"
        >
          Candidate Pool
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 items-start">
        <ApplicantSidebar applicant={applicant} jobTitle={job?.title} />

        <div className="lg:col-span-3 space-y-16">
          {applicant.screening && (
            <section>
               <div className="mb-8 px-2">
                  <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.15em] opacity-50">Intelligence Evaluation</h3>
               </div>
               <AIAnalysisCard screening={applicant.screening} />
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ExperienceCard experience={applicant.experience} />
            <SkillsCard skills={applicant.skills} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <EducationCard education={applicant.education} />
            <CertificationsCard certifications={applicant.certifications} />
          </div>

          <ProjectsCard projects={applicant.projects} />
        </div>
      </div>
    </div>
  );
}
