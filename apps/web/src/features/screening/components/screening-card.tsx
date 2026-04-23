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
      <div className="group bg-background rounded-lg border border-border p-6 transition-all hover:border-foreground/10 shadow-[0_1px_3px_rgba(0,0,0,0.01)] relative overflow-hidden">
        <div className="flex items-start gap-6">
          {/* Score Side */}
          <div className="flex flex-col items-center gap-1.5 w-16 shrink-0">
             <div className={cn("font-display text-[28px] font-light leading-none tracking-tighter", scoreColor)}>
               {screening.matchScore}
             </div>
             <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">% Match</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[15px] font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {applicant.firstName} {applicant.lastName}
                </p>
                <div className="flex items-center gap-2.5 mt-1 opacity-60">
                   <p className="truncate text-[12px] font-medium tracking-tight text-foreground">
                     {applicant.headline}
                   </p>
                   <div className="h-1 w-1 rounded-full bg-foreground/20 flex-shrink-0" />
                   <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground truncate">{jobTitle}</p>
                </div>
              </div>
              
              {rec && (
                <span className={cn(
                  "inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                  rec.color
                )}>
                  <RecIcon className="h-3 w-3" />
                  {screening.recommendation}
                </span>
              )}
            </div>

            <p className="line-clamp-2 text-muted-foreground text-[13px] leading-relaxed font-medium tracking-tight mb-5 max-w-[720px]">
              {screening.summary}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
               <div className="flex flex-wrap gap-2">
                  {screening.strengths.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-success/5 border border-success/10 text-[10px] font-bold text-success-foreground uppercase tracking-widest"
                    >
                      {s}
                    </span>
                  ))}
               </div>
               <div className="h-4 w-px bg-border/40 hidden sm:block" />
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    Applied {new Date(applicant.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-info hover:text-info/80 transition-colors uppercase tracking-[0.1em] ml-2">
                    Review Analysis <ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
