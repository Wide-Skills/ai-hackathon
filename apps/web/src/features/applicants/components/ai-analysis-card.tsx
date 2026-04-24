import type { ApplicantScreening } from "@ai-hackathon/shared";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  CircleCheck as CheckCircle2,
  ThumbsUp,
  Circle as XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface AIAnalysisCardProps {
  screening: ApplicantScreening;
}

const recommendationConfig = {
  "Strongly Recommend": {
    color: "text-success bg-success/10 border-success/20",
    icon: CheckCircle2,
  },
  Recommend: {
    color: "text-info bg-info/10 border-info/20",
    icon: ThumbsUp,
  },
  Consider: {
    color: "text-warning bg-warning/10 border-warning/20",
    icon: ThumbsUp,
  },
  "Not Recommended": {
    color: "text-destructive bg-destructive/10 border-destructive/20",
    icon: XCircle,
  },
};

export function AIAnalysisCard({ screening }: AIAnalysisCardProps) {
  const recConfig =
    recommendationConfig[
      screening.recommendation as keyof typeof recommendationConfig
    ];
  const _RecIcon = recConfig?.icon || BrainCircuit;

  const scoreColor =
    screening.matchScore >= 85
      ? "text-success"
      : screening.matchScore >= 70
        ? "text-info"
        : screening.matchScore >= 55
          ? "text-warning"
          : "text-destructive";

  return (
    <Card variant="premium" className="overflow-hidden">
      <div className="border-border/10 border-b p-10">
        <div className="flex items-start justify-between gap-10">
          <div className="flex-1">
            <div className="mb-8 flex items-center gap-2.5 opacity-40">
              <span className="font-bold text-[10px] text-foreground uppercase tracking-[0.2em]">
                Neural Architecture Evaluation
              </span>
            </div>

            <div className="mb-10 flex items-end gap-10">
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "font-display font-light text-[72px] leading-none tracking-tighter",
                    scoreColor,
                  )}
                >
                  {screening.matchScore}
                </span>
                <span className="font-display font-light text-[24px] text-muted-foreground/30">
                  %
                </span>
              </div>

              <div className="pb-3">
                <p className="mb-2.5 font-bold text-[10px] text-muted-foreground/40 uppercase tracking-[0.25em]">
                  AI Recommendation
                </p>
                {recConfig && (
                  <Badge
                    variant="outline"
                    size="sm"
                    uppercase
                    className={cn(
                      "px-4 py-1.5 font-bold shadow-md",
                      recConfig.color,
                    )}
                  >
                    {screening.recommendation}
                  </Badge>
                )}
              </div>
            </div>

            <p className="max-w-[680px] font-medium text-[16px] text-foreground/80 leading-relaxed tracking-tight">
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
                  className="text-secondary/30"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="100 100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - screening.matchScore }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  strokeLinecap="round"
                  className={cn("shadow-lg", scoreColor)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit
                  className={cn("h-8 w-8 opacity-10", scoreColor)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16 bg-secondary/[0.03] p-10 md:grid-cols-2">
        <div>
          <h4 className="mb-8 font-bold text-[10px] text-muted-foreground/50 uppercase tracking-[0.25em]">
            Strategic Strengths
          </h4>
          <ul className="space-y-4">
            {screening.strengths.map((s) => (
              <li
                key={s}
                className="flex items-start gap-3.5 font-medium text-[14px] text-foreground/70 leading-relaxed tracking-tight"
              >
                <div className="mt-2 mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-success/30" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-8 font-bold text-[10px] text-muted-foreground/50 uppercase tracking-[0.25em]">
            Critical Gaps
          </h4>
          <ul className="space-y-4">
            {screening.gaps.map((g) => (
              <li
                key={g}
                className="flex items-start gap-3.5 font-medium text-[14px] text-foreground/70 leading-relaxed tracking-tight"
              >
                <div className="mt-2 mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-destructive/20" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-border/10 border-t p-10">
        <h4 className="mb-10 font-bold text-[10px] text-muted-foreground/50 uppercase tracking-[0.25em]">
          Neural Skill Mapping
        </h4>
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 sm:grid-cols-2">
          {screening.skillBreakdown.map((sb) => (
            <div key={sb.skill} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13px] text-foreground/60 tracking-tight">
                  {sb.skill}
                </span>
                <span className="font-bold text-[11px] text-muted-foreground/30 tracking-widest">
                  {sb.score}%
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-secondary/50 shadow-inset">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sb.score}%` }}
                  transition={{ duration: 1.2, ease: "circOut" }}
                  className={cn(
                    "h-full rounded-full shadow-md",
                    sb.score >= 85
                      ? "bg-success/40"
                      : sb.score >= 70
                        ? "bg-info/40"
                        : "bg-warning/40",
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
