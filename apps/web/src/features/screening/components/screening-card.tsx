import type { Applicant } from "@ai-hackathon/shared";
import {
  CircleAlert as AlertCircle,
  ArrowUpRight,
  CircleCheck as CheckCircle2,
  ThumbsUp,
  Circle as XCircle,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScoreGauge } from "./score-gauge";

const recommendationConfig = {
  "Strongly Recommend": {
    color: "bg-success/10 text-success border-success/20",
    icon: CheckCircle2,
    dot: "bg-success",
  },
  Recommend: {
    color: "bg-primary/10 text-primary border-primary/20",
    icon: ThumbsUp,
    dot: "bg-primary",
  },
  Consider: {
    color: "bg-warning/10 text-warning border-warning/20",
    icon: AlertCircle,
    dot: "bg-warning",
  },
  "Not Recommended": {
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
    dot: "bg-destructive",
  },
};

interface ScreeningCardProps {
  applicant: Applicant;
  jobTitle: string;
}

export function ScreeningCard({ applicant, jobTitle }: ScreeningCardProps) {
  const { screening } = applicant;
  if (!screening) return null;

  const rec = recommendationConfig[screening.recommendation];
  const RecIcon = rec.icon;

  return (
    <Link href={`/dashboard/applicants/${applicant.id}`}>
      <Card className="group cursor-pointer border-border shadow-sm transition-all duration-200 hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <ScoreGauge score={screening.matchScore} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-foreground text-sm transition-colors group-hover:text-primary">
                    {applicant.firstName} {applicant.lastName}
                  </p>
                  <p className="mt-0.5 truncate text-muted-foreground text-xs">
                    {applicant.headline}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-2 py-1 font-semibold text-[10px]",
                    rec.color,
                  )}
                >
                  <RecIcon className="h-3 w-3" />
                  {screening.recommendation === "Strongly Recommend"
                    ? "Strong Match"
                    : screening.recommendation}
                </span>
              </div>

              <p className="mt-1 font-medium text-primary text-xs">
                {jobTitle}
              </p>

              <p className="mt-2 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                {screening.summary}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {screening.strengths.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 rounded-md border border-success/10 bg-success/10 px-2 py-0.5 font-medium text-[10px] text-success"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5" /> {s}
                  </span>
                ))}
                {screening.gaps.slice(0, 1).map((g) => (
                  <span
                    key={g}
                    className="flex items-center gap-1 rounded-md border border-destructive/10 bg-destructive/10 px-2 py-0.5 font-medium text-[10px] text-destructive"
                  >
                    <XCircle className="h-2.5 w-2.5" /> {g}
                  </span>
                ))}
              </div>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
