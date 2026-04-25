import type { ApplicantScreening } from "@ai-hackathon/shared";
import {
  RiBrainLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiThumbUpLine,
} from "@remixicon/react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AIAnalysisCardProps {
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

export function AIAnalysisCard({ screening }: AIAnalysisCardProps) {
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
                  {screening.matchScore}
                </span>
                <span className="font-serif text-[24px] text-ink-faint">%</span>
              </div>

              <div className="pb-3">
                <p className="mb-2 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                  Recommendation
                </p>
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
              </div>
            </div>

            <p className="max-w-[680px] font-light font-sans text-[16px] text-ink-muted leading-relaxed">
              {screening.summary}
            </p>
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
          <h4 className="mb-base font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
            Key Strengths
          </h4>
          <ul className="space-y-base">
            {screening.strengths.map((s) => (
              <li
                key={s}
                className="flex items-start gap-base font-light font-sans text-[14px] text-ink-muted leading-relaxed"
              >
                <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-status-success-text/30" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-base font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
            Critical Gaps
          </h4>
          <ul className="space-y-base">
            {screening.gaps.map((g) => (
              <li
                key={g}
                className="flex items-start gap-base font-light font-sans text-[14px] text-ink-muted leading-relaxed"
              >
                <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-status-error-text/30" />
                {g}
              </li>
            ))}
          </ul>
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
                <span className="font-medium font-sans text-[11px] text-ink-faint">
                  {sb.score}%
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full border border-line/50 bg-bg-deep">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sb.score}%` }}
                  transition={{ duration: 1.2, ease: "circOut" }}
                  className={cn(
                    "h-full rounded-full",
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
