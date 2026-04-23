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
    color: "text-success-foreground bg-success/5 border-success/10",
    icon: CheckCircle2,
  },
  Recommend: {
    color: "text-info-foreground bg-info/5 border-info/10",
    icon: ThumbsUp,
  },
  Consider: {
    color: "text-warning-foreground bg-warning/5 border-warning/10",
    icon: ThumbsUp,
  },
  "Not Recommended": {
    color: "text-destructive-foreground bg-destructive/5 border-destructive/10",
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
    <div className="bg-background rounded-lg border border-border shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden">
      <div className="p-8 border-b border-border/50">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="mb-6 flex items-center gap-2.5 opacity-60">
              <Sparkles className="h-3.5 w-3.5 text-foreground" />
              <span className="text-[10px] font-bold text-foreground uppercase tracking-[0.2em]">
                Gemini 1.5 Pro Analysis
              </span>
            </div>
            
            <div className="flex items-end gap-6 mb-6">
              <div className="flex items-baseline gap-1.5">
                 <span className={cn("font-display text-[64px] font-light leading-none tracking-tighter", scoreColor)}>
                   {screening.matchScore}
                 </span>
                 <span className="text-[20px] text-muted-foreground/40 font-light font-display">%</span>
              </div>
              
              <div className="pb-2">
                <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5">Match Logic</p>
                {recConfig && (
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                    recConfig.color
                  )}>
                    <RecIcon className="h-3 w-3" />
                    {screening.recommendation}
                  </span>
                )}
              </div>
            </div>

            <p className="text-foreground/70 text-[15px] leading-relaxed max-w-[640px] font-medium tracking-tight">
              {screening.summary}
            </p>
          </div>

          <div className="hidden sm:block">
            <div className="relative h-24 w-24">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-secondary" />
                <motion.circle
                  cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="1.5"
                  strokeDasharray="100 100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - screening.matchScore }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  strokeLinecap="round"
                  className={scoreColor}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <BrainCircuit className={cn("h-6 w-6 opacity-20", scoreColor)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 bg-secondary/10">
        <div>
          <h4 className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            <ThumbsUp className="h-3.5 w-3.5 text-success" /> Strengths
          </h4>
          <ul className="space-y-3.5">
            {screening.strengths.map((s) => (
              <li key={s} className="flex items-start gap-3 text-[14px] font-medium text-foreground/80 tracking-tight">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-success/40 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="mb-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            <ThumbsDown className="h-3.5 w-3.5 text-destructive" /> Experience Gaps
          </h4>
          <ul className="space-y-3.5">
            {screening.gaps.map((g) => (
              <li key={g} className="flex items-start gap-3 text-[14px] font-medium text-foreground/80 tracking-tight">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive/30 flex-shrink-0" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-8 border-t border-border/40">
        <h4 className="mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          Neural Skill Breakdown
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
          {screening.skillBreakdown.map((sb) => (
            <div key={sb.skill} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-foreground/70 tracking-tight">{sb.skill}</span>
                <span className="text-[11px] font-bold text-muted-foreground/50">{sb.score}%</span>
              </div>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sb.score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
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
