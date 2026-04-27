"use client";

import { RiHistoryLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { notFound, useRouter } from "next/navigation";
import { QueryErrorState } from "@/components/data/query-state";
import { cn } from "@/lib/utils";
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

  const logsQuery = useQuery(
    trpc.system.listTaskLogs.queryOptions({ applicantId: id, limit: 10 }),
  );
  const logs = logsQuery.data?.items ?? [];

  if (applicantQuery.isLoading || jobQuery.isLoading) {
    return (
      <div className="w-full animate-pulse space-y-comfortable">
        <div className="h-6 w-32 rounded-micro bg-bg-deep" />
        <div className="grid grid-cols-1 gap-comfortable lg:grid-cols-4">
          <div className="h-[600px] rounded-card bg-bg-deep lg:col-span-1" />
          <div className="h-[600px] rounded-card bg-bg-deep lg:col-span-3" />
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
    <div className="w-full space-y-comfortable pb-section-padding">
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-base font-medium font-sans text-[11px] text-ink-faint uppercase tracking-widest transition-all hover:text-primary"
        >
          <span className="opacity-40 transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          Candidate Pool
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-comfortable lg:grid-cols-4">
        <ApplicantSidebar applicant={applicant} jobTitle={job?.title} />

        <div className="space-y-section-gap lg:col-span-3">
          {applicant.screening && (
            <section className="space-y-base">
              <div className="mb-comfortable border-line border-b px-1 pb-base">
                <span className="mb-micro block font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.06em]">
                  Intelligence Evaluation
                </span>
                <h3 className="font-serif text-[28px] text-primary leading-tight">
                  AI Fit Summary
                </h3>
              </div>
              <AIAnalysisCard
                applicantId={applicant.id}
                jobId={applicant.jobId}
                screening={applicant.screening}
              />

              {logs.length > 0 && (
                <div className="mt-base rounded-xl border border-line bg-bg-alt/5 p-comfortable shadow-sm">
                  <div className="mb-base flex items-center gap-base font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    <RiHistoryLine className="size-3.5" />
                    Detailed Process Logs (Reasoning)
                  </div>
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-start gap-base">
                        <div
                          className={cn(
                            "mt-1 size-1.5 shrink-0 rounded-full",
                            log.status === "error"
                              ? "bg-status-error-text"
                              : log.status === "success"
                                ? "bg-status-success-text"
                                : "bg-primary/40",
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-base">
                            <span className="font-medium font-sans text-[11px] text-primary uppercase">
                              {log.step}
                            </span>
                            <span className="text-[10px] text-ink-faint">
                              {log.createdAt
                                ? formatDistanceToNow(new Date(log.createdAt), {
                                    addSuffix: true,
                                  })
                                : "just now"}
                            </span>
                          </div>
                          <p className="font-sans text-[12px] text-ink-muted">
                            {log.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="space-y-base">
            <div className="mb-comfortable border-line border-b px-1 pb-base">
              <span className="mb-micro block font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.06em]">
                Background
              </span>
              <h3 className="font-serif text-[28px] text-primary leading-tight">
                Professional Journey
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-comfortable lg:grid-cols-2">
              <ExperienceCard experience={applicant.experience} />
              <div className="space-y-comfortable">
                <SkillsCard skills={applicant.skills} />
                <LanguagesCard languages={applicant.languages} />
              </div>
            </div>
          </section>

          <section className="space-y-base">
            <div className="mb-comfortable border-line border-b px-1 pb-base">
              <span className="mb-micro block font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.06em]">
                Credentials
              </span>
              <h3 className="font-serif text-[28px] text-primary leading-tight">
                Expertise &amp; Validation
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-comfortable lg:grid-cols-2">
              <EducationCard education={applicant.education} />
              <CertificationsCard certifications={applicant.certifications} />
            </div>
          </section>

          <section className="space-y-base">
            <div className="mb-comfortable border-line border-b px-1 pb-base">
              <span className="mb-micro block font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.06em]">
                Evidence
              </span>
              <h3 className="font-serif text-[28px] text-primary leading-tight">
                Strategic Projects
              </h3>
            </div>
            <ProjectsCard projects={applicant.projects} />
          </section>
        </div>
      </div>
    </div>
  );
}
