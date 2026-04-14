"use client";

import type { SkillLevel } from "@ai-hackathon/shared";
import { useQuery } from "@tanstack/react-query";
import {
  CircleAlert as AlertCircle,
  ArrowLeft,
  Award,
  BrainCircuit,
  Briefcase,
  CircleCheck as CheckCircle2,
  Code as Code2,
  ExternalLink,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  ThumbsDown,
  ThumbsUp,
  Circle as XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";

const skillColors: Record<SkillLevel, string> = {
  Expert: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Advanced: "bg-blue-50 text-blue-700 border-blue-200",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  Beginner: "bg-gray-100 text-gray-600 border-gray-200",
};

const recommendationConfig = {
  "Strongly Recommend": {
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  Recommend: {
    color: "text-blue-700 bg-blue-50 border-blue-200",
    icon: ThumbsUp,
  },
  Consider: {
    color: "text-amber-700 bg-amber-50 border-amber-200",
    icon: AlertCircle,
  },
  "Not Recommended": {
    color: "text-red-700 bg-red-50 border-red-200",
    icon: XCircle,
  },
};

export default function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
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
  const { screening } = applicant;
  const recConfig = screening
    ? recommendationConfig[screening.recommendation]
    : null;
  const RecIcon = recConfig?.icon;

  const scoreColor =
    (screening?.matchScore ?? 0) >= 85
      ? "text-emerald-600"
      : (screening?.matchScore ?? 0) >= 70
        ? "text-blue-600"
        : (screening?.matchScore ?? 0) >= 55
          ? "text-amber-600"
          : "text-red-600";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/applicants">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5 text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applicants
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6 text-center">
              {applicant.avatarUrl ? (
                <img
                  src={applicant.avatarUrl}
                  alt={`${applicant.firstName} ${applicant.lastName}`}
                  className="mx-auto h-20 w-20 rounded-full object-cover shadow-md ring-4 ring-blue-100"
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 font-bold text-2xl text-white shadow-md ring-4 ring-blue-100">
                  {applicant.firstName[0]}
                  {applicant.lastName[0]}
                </div>
              )}
              <h2 className="mt-4 font-bold text-slate-900 text-xl">
                {applicant.firstName} {applicant.lastName}
              </h2>
              <p className="mt-1 text-slate-500 text-sm leading-snug">
                {applicant.headline}
              </p>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-slate-400 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {applicant.location}
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                {applicant.socialLinks.linkedin && (
                  <a
                    href={applicant.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-400 transition-colors hover:border-blue-200 hover:text-blue-600"
                  >
                    <Briefcase className="h-4 w-4" />
                  </a>
                )}
                {applicant.socialLinks.github && (
                  <a
                    href={applicant.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-800"
                  >
                    <Code2 className="h-4 w-4" />
                  </a>
                )}
                {applicant.socialLinks.portfolio && (
                  <a
                    href={applicant.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-400 transition-colors hover:border-emerald-200 hover:text-emerald-600"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                <a
                  href={`mailto:${applicant.email}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-400 transition-colors hover:border-red-200 hover:text-red-500"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-5 space-y-2 border-gray-100 border-t pt-5">
                <Button className="h-9 w-full gap-2 rounded-lg bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Shortlist Candidate
                </Button>
                <Button
                  variant="outline"
                  className="h-9 w-full border-gray-200 text-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="space-y-3 p-5">
              <h3 className="font-semibold text-slate-900 text-sm">
                Application Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applied to</span>
                  <span className="max-w-[160px] text-right font-medium text-slate-800">
                    {job?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date applied</span>
                  <span className="font-medium text-slate-800">
                    {new Date(applicant.appliedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Availability</span>
                  <span className="font-medium text-slate-800">
                    {applicant.availability.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-semibold text-xs",
                      {
                        "bg-emerald-100 text-emerald-700":
                          applicant.status === "shortlisted",
                        "bg-blue-100 text-blue-700":
                          applicant.status === "screening",
                        "bg-gray-100 text-gray-600":
                          applicant.status === "pending",
                        "bg-red-100 text-red-600":
                          applicant.status === "rejected",
                      },
                    )}
                  >
                    {applicant.status.charAt(0).toUpperCase() +
                      applicant.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-5">
              <h3 className="mb-3 font-semibold text-slate-900 text-sm">
                Languages
              </h3>
              <div className="space-y-2">
                {applicant.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-slate-700 text-sm">{lang.name}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-slate-500 text-xs">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5 lg:col-span-2">
          {screening && (
            <Card className="overflow-hidden border-gray-200 shadow-sm">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4 text-blue-400" />
                      <span className="font-semibold text-blue-400 text-xs uppercase tracking-wider">
                        Gemini AI Analysis
                      </span>
                    </div>
                    <div className="flex items-end gap-3">
                      <span
                        className={cn(
                          "font-black text-5xl tabular-nums",
                          scoreColor,
                        )}
                      >
                        {screening.matchScore}%
                      </span>
                      <div className="mb-1">
                        <p className="text-slate-400 text-xs">Match Score</p>
                        {recConfig && RecIcon && (
                          <span
                            className={cn(
                              "mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold text-xs",
                              recConfig.color,
                            )}
                          >
                            <RecIcon className="h-3 w-3" />
                            {screening.recommendation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="#334155"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke={
                            screening.matchScore >= 85
                              ? "#10b981"
                              : screening.matchScore >= 70
                                ? "#3b82f6"
                                : screening.matchScore >= 55
                                  ? "#f59e0b"
                                  : "#ef4444"
                          }
                          strokeWidth="3"
                          strokeDasharray={`${screening.matchScore} ${100 - screening.matchScore}`}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                  {screening.summary}
                </p>
              </div>

              <CardContent className="bg-white p-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-3 flex items-center gap-1.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-500" />{" "}
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {screening.strengths.map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-slate-700 text-sm"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-3 flex items-center gap-1.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                      <ThumbsDown className="h-3.5 w-3.5 text-red-400" /> Gaps
                    </h4>
                    <ul className="space-y-2">
                      {screening.gaps.map((g) => (
                        <li
                          key={g}
                          className="flex items-start gap-2 text-slate-700 text-sm"
                        >
                          <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 border-gray-100 border-t pt-4">
                  <h4 className="mb-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    Skill Breakdown
                  </h4>
                  <div className="space-y-2.5">
                    {screening.skillBreakdown.map((sb) => (
                      <div key={sb.skill}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            {sb.skill}
                          </span>
                          <span
                            className={cn(
                              "font-bold text-xs tabular-nums",
                              sb.score >= 85
                                ? "text-emerald-600"
                                : sb.score >= 70
                                  ? "text-blue-600"
                                  : "text-amber-600",
                            )}
                          >
                            {sb.score}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              sb.score >= 85
                                ? "bg-emerald-500"
                                : sb.score >= 70
                                  ? "bg-blue-500"
                                  : "bg-amber-400",
                            )}
                            style={{ width: `${sb.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <Code2 className="h-4 w-4 text-blue-500" /> Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium text-xs",
                      skillColors[skill.level],
                    )}
                  >
                    {skill.name}
                    <span className="opacity-60">·</span>
                    <span className="opacity-80">
                      {skill.yearsOfExperience}yr
                    </span>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <Briefcase className="h-4 w-4 text-blue-500" /> Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              {applicant.experience.map((exp, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                    </div>
                    {i < applicant.experience.length - 1 && (
                      <div className="mt-2 w-px flex-1 bg-gray-100" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {exp.role}
                        </p>
                        <p className="font-medium text-blue-600 text-sm">
                          {exp.company}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-slate-500 text-xs">
                          {exp.startDate} – {exp.endDate}
                        </p>
                        {exp.isCurrent && (
                          <span className="font-semibold text-[10px] text-emerald-600">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-slate-500 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-[11px] text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                  <GraduationCap className="h-4 w-4 text-blue-500" /> Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {applicant.education.map((edu, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50">
                      <GraduationCap className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {edu.degree} in {edu.fieldOfStudy}
                      </p>
                      <p className="font-medium text-blue-600 text-xs">
                        {edu.institution}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {edu.startYear} – {edu.endYear}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {applicant.certifications.length > 0 && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                    <Award className="h-4 w-4 text-blue-500" /> Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {applicant.certifications.map((cert, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        <Award className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {cert.name}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {cert.issuer} · {cert.issueDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {applicant.projects.length > 0 && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                  <Code2 className="h-4 w-4 text-blue-500" /> Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {applicant.projects.map((proj, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-slate-900 text-sm">
                        {proj.name}
                      </p>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 transition-colors hover:text-blue-600"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="mt-0.5 font-medium text-blue-600 text-xs">
                      {proj.role}
                    </p>
                    <p className="mt-2 text-slate-500 text-sm leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {proj.technologies.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 font-medium text-[11px] text-blue-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
