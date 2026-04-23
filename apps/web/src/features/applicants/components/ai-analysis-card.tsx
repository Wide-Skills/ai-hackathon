import type { ApplicantScreening } from "@ai-hackathon/shared";
import {
  BrainCircuit,
  CircleCheck as CheckCircle2,
  ThumbsDown,
  ThumbsUp,
  Circle as XCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const recConfig = recommendationConfig[screening.recommendation as keyof typeof recommendationConfig];
  const RecIcon = recConfig?.icon || BrainCircuit;

  const scoreColor =
    screening.matchScore >= 85
      ? "text-success"
      : screening.matchScore >= 70
        ? "text-info"
        : screening.matchScore >= 55
          ? "text-warning"
          : "text-destructive";

  return (
    <div className="bg-background rounded-section border border-border/50 shadow-premium overflow-hidden">
      <div className="p-10 border-b border-border/10">
        <div className="flex items-start justify-between gap-10">
          <div className="flex-1">
            <div className="mb-8 flex items-center gap-2.5 opacity-40">
              <span className="text-[10px] font-bold text-foreground uppercase tracking-[0.2em]">
                Neural Architecture Evaluation
              </span>
            </div>
            
            <div className="flex items-end gap-10 mb-10">
              <div className="flex items-baseline gap-2">
                 <span className={cn("font-display text-[72px] font-light leading-none tracking-tighter", scoreColor)}>
                   {screening.matchScore}
                 </span>
                 <span className="text-[24px] text-muted-foreground/30 font-light font-display">%</span>
              </div>
              
              <div className="pb-3">
                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.25em] mb-2.5">AI Recommendation</p>
                {recConfig && (
                  <span className={cn(
                    "inline-flex items-center gap-2 rounded-pill border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] shadow-ethereal",
                    recConfig.color
                  )}>
                    {screening.recommendation}
                  </span>
                )}
              </div>
            </div>

            <p className="text-foreground/80 text-[16px] leading-relaxed max-w-[680px] font-medium tracking-tight">
              {screening.summary}
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="1" className="text-secondary/30" />
                <motion.circle
                  cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="1"
                  strokeDasharray="100 100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - screening.matchScore }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  strokeLinecap="round"
                  className={cn("shadow-premium", scoreColor)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <BrainCircuit className={cn("h-8 w-8 opacity-10", scoreColor)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-16 bg-secondary/[0.03]">
        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">
            Strategic Strengths
          </h4>
          <ul className="space-y-4">
            {screening.strengths.map((s) => (
              <li key={s} className="flex items-start gap-3.5 text-[14px] font-medium text-foreground/70 tracking-tight leading-relaxed">
                <div className="mt-2 h-1 w-1 rounded-full bg-success/30 flex-shrink-0 mt-2.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">
            Critical Gaps
          </h4>
          <ul className="space-y-4">
            {screening.gaps.map((g) => (
              <li key={g} className="flex items-start gap-3.5 text-[14px] font-medium text-foreground/70 tracking-tight leading-relaxed">
                <div className="mt-2 h-1 w-1 rounded-full bg-destructive/20 flex-shrink-0 mt-2.5" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-10 border-t border-border/10">
        <h4 className="mb-10 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">
          Neural Skill Mapping
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
          {screening.skillBreakdown.map((sb) => (
            <div key={sb.skill} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-foreground/60 tracking-tight">{sb.skill}</span>
                <span className="text-[11px] font-bold text-muted-foreground/30 tracking-widest">{sb.score}%</span>
              </div>
              <div className="h-1 w-full bg-secondary/50 rounded-pill overflow-hidden shadow-inset">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sb.score}%` }}
                  transition={{ duration: 1.2, ease: "circOut" }}
                  className={cn(
                    "h-full rounded-pill shadow-ethereal",
                    sb.score >= 85 ? "bg-success/40" : sb.score >= 70 ? "bg-info/40" : "bg-warning/40"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
