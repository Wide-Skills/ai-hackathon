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
        <div className="flex items-start gap-hero">
          {/* Score Side */}
          <div className="flex w-20 shrink-0 flex-col items-center gap-base border-line border-r py-1 pr-comfortable">
            <div
              className={cn(
                "font-serif text-[36px] leading-none tracking-tight",
                scoreColor,
              )}
            >
              {screening.matchScore}
            </div>
            <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
              % Rank
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-comfortable flex items-start justify-between gap-base">
              <div>
                <p className="font-serif text-[20px] text-primary leading-tight transition-colors group-hover:text-primary-muted">
                  {applicant.firstName} {applicant.lastName}
                </p>
                <div className="mt-1 flex items-center gap-base">
                  <p className="truncate font-light font-sans text-[13px] text-ink-muted">
                    {applicant.headline}
                  </p>
                  <div className="size-1 rounded-full bg-line" />
                  <p className="truncate font-medium font-sans text-[10px] text-primary/40 uppercase tracking-wider">
                    {jobTitle}
                  </p>
                </div>
              </div>

              {rec && (
                <Badge variant={rec.variant} size="sm" uppercase>
                  <RecIcon className="mr-1 size-3 opacity-60" />
                  {rec.label}
                </Badge>
              )}
            </div>

            <p className="mb-comfortable line-clamp-2 max-w-[720px] font-light font-sans text-[14px] text-ink-muted leading-relaxed">
              {screening.summary}
            </p>

            <div className="flex flex-wrap items-center gap-hero">
              <div className="flex flex-wrap gap-small">
                {screening.strengths.slice(0, 3).map((s: string) => (
                  <Badge key={s} variant="secondary" size="sm">
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="hidden h-4 w-px bg-line sm:block" />
              <div className="flex items-center gap-hero">
                <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                  {new Date(applicant.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-micro font-medium font-sans text-[11px] text-primary/60 uppercase tracking-wider transition-all group-hover:text-primary">
                  Intelligence Report{" "}
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
