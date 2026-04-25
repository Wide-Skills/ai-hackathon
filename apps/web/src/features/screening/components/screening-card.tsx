import type { Applicant } from "@ai-hackathon/shared";
import {
  RiArrowRightUpLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiThumbUpLine,
} from "@remixicon/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const recommendationConfig: Record<
  string,
  {
    label: string;
    variant: "success" | "info" | "warning" | "destructive";
    icon: any;
  }
> = {
  "Strongly Recommend": {
    label: "Strongly Recommend",
    variant: "success",
    icon: RiCheckboxCircleLine,
  },
  Recommend: {
    label: "Recommend",
    variant: "info",
    icon: RiThumbUpLine,
  },
  Consider: {
    label: "Consider",
    variant: "warning",
    icon: RiThumbUpLine,
  },
  "Not Recommended": {
    label: "Not Recommended",
    variant: "destructive",
    icon: RiCloseCircleLine,
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
  const RecIcon = rec?.icon || RiThumbUpLine;

  const scoreColor =
    screening.matchScore >= 85
      ? "text-status-success-text"
      : screening.matchScore >= 70
        ? "text-primary"
        : screening.matchScore >= 55
          ? "text-status-warning-text"
          : "text-status-error-text";

  return (
    <Link href={`/dashboard/applicants/${applicant.id}`}>
      <Card
        variant="default"
        className="group flex flex-col border-line p-comfortable shadow-none transition-all hover:border-line-medium"
        size="none"
      >
        <div className="flex flex-col gap-base sm:flex-row sm:items-start sm:gap-hero">
          {/* Score Side */}
          <div className="flex shrink-0 flex-row items-center justify-between gap-base border-line border-b pb-base sm:w-20 sm:flex-col sm:border-b-0 sm:border-r sm:pb-0 sm:py-1 sm:pr-comfortable">
            <div className="flex items-baseline gap-1">
              <div
                className={cn(
                  "font-serif text-[36px] leading-none tracking-tight",
                  scoreColor,
                )}
              >
                {screening.matchScore}
              </div>
              <span className="font-serif text-[18px] text-ink-faint sm:hidden">%</span>
            </div>
            <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
              % Rank
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-comfortable flex flex-col items-start justify-between gap-base sm:flex-row">
              <div>
                <p className="font-serif text-[20px] text-primary leading-tight transition-colors group-hover:text-primary-muted">
                  {applicant.firstName} {applicant.lastName}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-base">
                  <p className="truncate font-light font-sans text-[13px] text-ink-muted">
                    {applicant.headline}
                  </p>
                  <div className="hidden size-1 rounded-full bg-line sm:block" />
                  <p className="truncate font-medium font-sans text-[10px] text-primary/40 uppercase tracking-wider">
                    {jobTitle}
                  </p>
                </div>
              </div>

              {rec && (
                <div className="mt-base sm:mt-0">
                  <Badge variant={rec.variant} size="sm" uppercase>
                    <RecIcon className="mr-1 size-3 opacity-60" />
                    {rec.label}
                  </Badge>
                </div>
              )}
            </div>

            <p className="mb-comfortable line-clamp-2 max-w-[720px] font-light font-sans text-[14px] text-ink-muted leading-relaxed">
              {screening.summary}
            </p>

            <div className="flex flex-col gap-base sm:flex-row sm:items-center sm:gap-hero">
              <div className="flex flex-wrap gap-small">
                {screening.strengths.slice(0, 3).map((s: string) => (
                  <Badge key={s} variant="secondary" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="hidden h-4 w-px bg-line sm:block" />
              <div className="flex items-center justify-between gap-hero sm:justify-start">
                <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                  {new Date(applicant.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-micro font-medium font-sans text-[11px] text-primary/60 uppercase tracking-wider transition-all group-hover:text-primary">
                  AI Fit Report{" "}
                  <RiArrowRightUpLine className="size-3 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
