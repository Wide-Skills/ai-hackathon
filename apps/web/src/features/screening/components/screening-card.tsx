import type { Applicant } from "@ai-hackathon/shared";
import {
  CircleAlert as AlertCircle,
  ArrowUpRight,
  CircleCheck as CheckCircle2,
  ThumbsUp,
  Circle as XCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    icon: AlertCircle,
  },
  "Not Recommended": {
    color: "text-destructive-foreground bg-destructive/5 border-destructive/10",
    icon: XCircle,
  },
};

interface ScreeningCardProps {
  applicant: Applicant;
  jobTitle: string;
}

export function ScreeningCard({ applicant, jobTitle }: ScreeningCardProps) {
  const { screening } = applicant;
  if (!screening) return null;

  const rec = recommendationConfig[screening.recommendation as keyof typeof recommendationConfig];
  const RecIcon = rec?.icon || AlertCircle;

  const scoreColor =
    screening.matchScore >= 85
      ? "text-success"
      : screening.matchScore >= 70
        ? "text-info"
        : screening.matchScore >= 55
          ? "text-warning"
          : "text-destructive";

  return (
    <Link href={`/dashboard/applicants/${applicant.id}`}>
      <div className="group bg-background rounded-section border border-border/50 p-6 transition-all hover:border-primary/20 hover:shadow-premium shadow-ethereal relative overflow-hidden">
        <div className="flex items-start gap-8">
          {/* Score Side */}
          <div className="flex flex-col items-center gap-2 w-20 shrink-0 border-r border-border/10 pr-6">
             <div className={cn("font-display text-[32px] font-light leading-none tracking-tighter", scoreColor)}>
               {screening.matchScore}
             </div>
             <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">% Rank</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[16px] font-medium text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {applicant.firstName} {applicant.lastName}
                </p>
                <div className="flex items-center gap-3 mt-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                   <p className="truncate text-[12px] font-medium tracking-tight text-foreground">
                     {applicant.headline}
                   </p>
                   <div className="h-1 w-1 rounded-full bg-foreground/30 flex-shrink-0" />
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">{jobTitle}</p>
                </div>
              </div>
              
              {rec && (
                <span className={cn(
                  "inline-flex flex-shrink-0 items-center gap-2 rounded-pill border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.1em] shadow-ethereal",
                  rec.color
                )}>
                  <RecIcon className="h-3 w-3 opacity-60" />
                  {screening.recommendation}
                </span>
              )}
            </div>

            <p className="line-clamp-2 text-muted-foreground/70 text-[13px] leading-relaxed font-medium tracking-tight mb-6 max-w-[720px]">
              {screening.summary}
            </p>

            <div className="flex flex-wrap gap-6 items-center">
               <div className="flex flex-wrap gap-2">
                  {screening.strengths.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-secondary/30 border border-border/20 text-[9px] font-bold text-muted-foreground uppercase tracking-widest shadow-ethereal"
                    >
                      {s}
                    </span>
                  ))}
               </div>
               <div className="h-4 w-px bg-border/10 hidden sm:block" />
               <div className="flex items-center gap-6">
                  <span className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest">
                    {new Date(applicant.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-info/70 group-hover:text-info transition-colors uppercase tracking-[0.2em]">
                    Insight Report <ArrowUpRight className="h-3 w-3 opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
