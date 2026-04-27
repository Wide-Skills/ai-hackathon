"use client";
import type { ApplicantScreening } from "@ai-hackathon/shared";
import {
  RiBrainLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiHistoryLine,
  RiLoader2Line,
  RiSaveLine,
  RiThumbUpLine,
} from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { invalidateHiringData, trpc } from "@/utils/trpc";

interface AIAnalysisCardProps {
  applicantId: string;
  jobId: string;
  screening: ApplicantScreening;
}

const recommendationConfig = {
  "Strongly Recommend": {
    color:
      "text-status-success-text bg-status-success-bg border-status-success-bg",
    icon: RiCheckboxCircleLine,
  },
  Recommend: {
    color: "text-primary bg-primary-alpha border-primary-alpha",
    icon: RiThumbUpLine,
  },
  Consider: {
    color:
      "text-status-warning-text bg-status-warning-bg border-status-warning-bg",
    icon: RiThumbUpLine,
  },
  "Not Recommended": {
    color: "text-status-error-text bg-status-error-bg border-status-error-bg",
    icon: RiCloseCircleLine,
  },
};

export function AIAnalysisCard({
  applicantId,
  jobId,
  screening,
}: AIAnalysisCardProps) {
  const queryClient = useQueryClient();
  const [manualScore, setManualScore] = useState<string>(
    screening.manualScore?.toString() || "",
  );
  const [recruiterNotes, setRecruiterNotes] = useState<string>(
    screening.recruiterNotes || "",
  );

  const updateFeedback = useMutation(
    trpc.screenings.updateFeedback.mutationOptions({
      onSuccess: () => {
        toast.success("Feedback saved successfully");
        void invalidateHiringData(queryClient);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to save feedback");
      },
    }),
  );

  const rescreen = useMutation(
    trpc.screenings.rescreen.mutationOptions({
      onSuccess: () => {
        toast.success("Rescreening initiated");
        void invalidateHiringData(queryClient);
      },
    }),
  );

  const recConfig =
    recommendationConfig[
      screening.recommendation as keyof typeof recommendationConfig
    ];

  const scoreColor =
    screening.matchScore >= 85
      ? "text-status-success-text"
      : screening.matchScore >= 70
        ? "text-primary"
        : screening.matchScore >= 55
          ? "text-status-warning-text"
          : "text-status-error-text";

  return (
    <Card variant="default" className="overflow-hidden shadow-none" size="none">
      <div className="border-line border-b p-comfortable">
        <div className="flex items-start justify-between gap-hero">
          <div className="flex-1">
            <div className="mb-comfortable flex items-center gap-2.5 opacity-40">
              <span className="font-medium font-sans text-[10px] text-primary uppercase tracking-[0.1em]">
                Assessment Summary
              </span>
            </div>

            <div className="mb-comfortable flex items-end gap-hero">
              <div className="flex items-baseline gap-1">
                <span
                  className={cn(
                    "font-serif text-[72px] leading-none tracking-tight",
                    scoreColor,
                  )}
                >
                  {screening.manualScore ?? screening.matchScore}
                </span>
                <span className="font-serif text-[24px] text-ink-faint">%</span>
                {screening.manualScore !== undefined && (
                  <Badge
                    variant="info"
                    size="xs"
                    className="mb-4 ml-2 font-mono text-[9px] uppercase tracking-tighter"
                  >
                    Overridden
                  </Badge>
                )}
              </div>

              <div className="pb-3">
                <p className="mb-2 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                  Recommendation
                </p>
                <div className="flex flex-wrap items-center gap-base">
                  {recConfig && (
                    <Badge
                      variant="outline"
                      size="default"
                      uppercase
                      className={cn(
                        "px-4 py-1 font-medium font-sans",
                        recConfig.color,
                      )}
                    >
                      {screening.recommendation}
                    </Badge>
                  )}
                  {screening.isOutdated && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rescreen.mutate({ applicantId, jobId })}
                      disabled={rescreen.isPending}
                      className="h-8 gap-base border-status-warning-text/30 bg-status-warning-bg font-medium font-sans text-[10px] text-status-warning-text uppercase tracking-wider hover:bg-status-warning-bg/80"
                    >
                      {rescreen.isPending ? (
                        "Analyzing..."
                      ) : (
                        <>
                          <RiHistoryLine className="size-3" />
                          Outdated - Rescreen
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <p className="max-w-[680px] font-light font-sans text-[16px] text-ink-muted leading-relaxed">
              {screening.summary}
            </p>
            {screening.recruiterNotes && (
              <div className="mt-base rounded-standard border border-line border-l-4 border-l-primary bg-bg-alt/5 p-base">
                <div className="mb-1 font-medium font-sans text-[10px] text-primary uppercase tracking-widest">
                  Recruiter Review Notes
                </div>
                <p className="font-sans text-[13px] text-ink-muted italic">
                  "{screening.recruiterNotes}"
                </p>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-bg-deep"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="100 100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - screening.matchScore }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  strokeLinecap="round"
                  className={cn(scoreColor)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <RiBrainLine className={cn("h-8 w-8 opacity-10", scoreColor)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-hero border-line border-b bg-bg-alt/10 p-comfortable md:grid-cols-2">
        <div>
          <h4 className="mb-comfortable font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
            Key Strengths
          </h4>
          <ul className="space-y-base">
            {screening.strengths.map((s) => (
              <li
                key={s}
                className="flex items-start gap-base font-light font-sans text-[14px] text-ink-muted leading-relaxed"
              >
                <RiCheckboxCircleLine className="mt-1 size-3.5 shrink-0 text-status-success-text" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-comfortable font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
            Critical Gaps
          </h4>
          <ul className="space-y-base">
            {screening.gaps.map((g) => (
              <li
                key={g}
                className="flex items-start gap-base font-light font-sans text-[14px] text-ink-muted leading-relaxed"
              >
                <RiCloseCircleLine className="mt-1 size-3.5 shrink-0 text-status-error-text" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-comfortable">
        <div className="grid grid-cols-1 gap-hero lg:grid-cols-2">
          <div>
            <div className="mb-comfortable flex items-center gap-base">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-alt/20">
                <RiBrainLine className="size-3 text-primary" />
              </div>
              <h4 className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                Score Justification (XAI)
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-small rounded-xl border border-line bg-bg-alt/5 p-base">
              {[
                {
                  label: "Technical Stack",
                  value: screening.scoreBreakdown?.technicalSkills ?? 0,
                },
                {
                  label: "Domain Experience",
                  value: screening.scoreBreakdown?.experience ?? 0,
                },
                {
                  label: "Education Fit",
                  value: screening.scoreBreakdown?.education ?? 0,
                },
                {
                  label: "Cultural Persona",
                  value: screening.scoreBreakdown?.culturalFit ?? 0,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="space-y-1.5 rounded-micro bg-surface/50 p-base shadow-sm"
                >
                  <div className="flex items-center justify-between font-medium font-sans text-[10px] text-ink-faint uppercase">
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-[20px] text-primary leading-none">
                      {item.value}
                    </span>
                    <span className="font-sans text-[10px] text-ink-faint">
                      %
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-bg-alt/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{
                        type: "spring",
                        duration: 1.5,
                        bounce: 0,
                        delay: 0.1,
                      }}
                      className="h-full bg-primary/30"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-comfortable flex items-center gap-base">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bg-alt/20">
                <RiThumbUpLine className="size-3 text-primary" />
              </div>
              <h4 className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                Human Oversight
              </h4>
            </div>
            <div className="flex flex-1 flex-col gap-base rounded-xl border border-line p-comfortable shadow-sm">
              <div className="grid grid-cols-1 gap-base sm:grid-cols-3">
                <div className="space-y-micro sm:col-span-1">
                  <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    Manual Score
                  </Label>
                  <Input
                    type="number"
                    placeholder="0-100"
                    value={manualScore}
                    onChange={(e) => setManualScore(e.target.value)}
                    className="h-10 border-line bg-transparent font-serif text-[18px] text-primary shadow-none focus:ring-primary/5"
                  />
                </div>
                <div className="space-y-micro sm:col-span-2">
                  <Label className="ml-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    Evaluation Notes
                  </Label>
                  <Textarea
                    placeholder="Record internal reasoning..."
                    value={recruiterNotes}
                    onChange={(e) => setRecruiterNotes(e.target.value)}
                    className="h-10 min-h-[40px] resize-none border-line bg-transparent p-2.5 font-sans text-[13px] leading-tight shadow-none focus:ring-primary/5"
                  />
                </div>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  updateFeedback.mutate({
                    applicantId,
                    manualScore: manualScore ? Number(manualScore) : undefined,
                    recruiterNotes,
                  })
                }
                disabled={updateFeedback.isPending}
                className="w-full gap-base rounded-standard bg-primary font-medium font-sans text-[11px] text-white uppercase tracking-wider shadow-md shadow-primary/10 transition-all hover:translate-y-[-1px] active:scale-[0.97]"
              >
                {updateFeedback.isPending ? (
                  <>
                    <RiLoader2Line className="size-3.5 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RiSaveLine className="size-3.5" />
                    Update Decision
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-comfortable">
        <h4 className="mb-comfortable font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
          AI Match Analysis
        </h4>
        <div className="grid grid-cols-1 gap-x-hero gap-y-base sm:grid-cols-2">
          {screening.skillBreakdown.map((sb) => (
            <div key={sb.skill} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium font-sans text-[13px] text-primary">
                  {sb.skill}
                </span>
                <span className="font-medium font-sans text-[11px] text-primary">
                  {sb.score}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full border border-line bg-bg-deep shadow-none">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sb.score}%` }}
                  transition={{ duration: 1.2, ease: "circOut" }}
                  className={cn(
                    "h-full rounded-full shadow-none",
                    sb.score >= 85
                      ? "bg-status-success-text"
                      : sb.score >= 70
                        ? "bg-primary/60"
                        : "bg-status-warning-text",
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
