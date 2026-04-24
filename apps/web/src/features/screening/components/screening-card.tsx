import type { Applicant } from "@ai-hackathon/shared";
import {
  CircleAlert as AlertCircle,
  ArrowUpRight,
  CircleCheck as CheckCircle2,
  ThumbsUp,
  Circle as XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const recommendationConfig: Record<
  string,
  { label: string; variant: "success" | "info" | "warning" | "destructive"; icon: any }
> = {
  "Strongly Recommend": {
    label: "Strongly Recommend",
    variant: "success",
    icon: CheckCircle2,
  },
  Recommend: {
    label: "Recommend",
    variant: "info",
    icon: ThumbsUp,
  },
  Consider: {
    label: "Consider",
    variant: "warning",
    icon: AlertCircle,
  },
  "Not Recommended": {
    label: "Not Recommended",
    variant: "destructive",
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

  const rec =
    recommendationConfig[
      screening.recommendation as keyof typeof recommendationConfig
    ];
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
      <Card
        variant="premium"
        className="group relative flex flex-col p-6"
      >
        <div className="flex items-start gap-8">
          {/* Score Side */}
          <div className="flex w-20 shrink-0 flex-col items-center gap-2 border-border/10 border-r pr-6">
            <div
              className={cn(
                "font-display font-light text-[32px] leading-none tracking-tighter",
                scoreColor,
              )}
            >
              {screening.matchScore}
            </div>
            <span className="font-bold text-[9px] text-muted-foreground/30 uppercase tracking-[0.2em]">
              % Rank
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-[16px] text-foreground tracking-tight transition-colors group-hover:text-primary">
                  {applicant.firstName} {applicant.lastName}
                </p>
                <div className="mt-1.5 flex items-center gap-3 opacity-40 transition-opacity group-hover:opacity-100">
                  <p className="truncate font-medium text-[12px] text-foreground tracking-tight">
                    {applicant.headline}
                  </p>
                  <div className="h-1 w-1 flex-shrink-0 rounded-full bg-foreground/30" />
                  <p className="truncate font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                    {jobTitle}
                  </p>
                </div>
              </div>

              {rec && (
                <Badge
                  variant={rec.variant}
                  size="default"
                  uppercase
                  className="shadow-md"
                >
                  <RecIcon className="h-3 w-3 opacity-60" />
                  {rec.label}
                </Badge>
              )}
            </div>

            <p className="mb-6 line-clamp-2 max-w-[720px] font-medium text-[13px] text-muted-foreground/70 leading-relaxed tracking-tight">
              {screening.summary}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-wrap gap-2">
                {screening.strengths.slice(0, 3).map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    size="xs"
                    uppercase
                    className="bg-secondary/30 text-muted-foreground/60 shadow-md"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="hidden h-4 w-px bg-border/10 sm:block" />
              <div className="flex items-center gap-6">
                <span className="font-bold text-[10px] text-muted-foreground/20 uppercase tracking-widest">
                  {new Date(applicant.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-2 font-bold text-[10px] text-info/70 uppercase tracking-[0.2em] transition-colors group-hover:text-info">
                  Insight Report{" "}
                  <ArrowUpRight className="h-3 w-3 opacity-20 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </Card>
    </Link>
  );
}
