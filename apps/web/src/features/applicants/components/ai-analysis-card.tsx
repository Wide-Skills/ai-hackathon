import type { ApplicantScreening } from "@ai-hackathon/shared";
import {
  BrainCircuit,
  CircleCheck as CheckCircle2,
  ThumbsDown,
  ThumbsUp,
  Circle as XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    color: "text-primary bg-primary/10 border-primary/20",
    icon: ThumbsUp,
  },
  Consider: {
    color: "text-warning bg-warning/10 border-warning/20",
    icon: ThumbsUp, // fallback if needed
  },
  "Not Recommended": {
    color: "text-destructive bg-destructive/10 border-destructive/20",
    icon: XCircle,
  },
};

export function AIAnalysisCard({ screening }: AIAnalysisCardProps) {
  const recConfig = recommendationConfig[screening.recommendation];
  const RecIcon = recConfig?.icon || BrainCircuit;

  const scoreColor =
    screening.matchScore >= 85
      ? "text-success"
      : screening.matchScore >= 70
        ? "text-primary"
        : screening.matchScore >= 55
          ? "text-warning"
          : "text-destructive";

  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <div className="bg-gradient-to-br from-foreground to-foreground/90 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-primary/70" />
              <span className="font-semibold text-primary/70 text-xs uppercase tracking-wider">
                Gemini AI Analysis
              </span>
            </div>
            <div className="flex items-end gap-3">
              <span
                className={cn("font-black text-5xl tabular-nums", scoreColor)}
              >
                {screening.matchScore}%
              </span>
              <div className="mb-1">
                <p className="text-muted-foreground/70 text-xs">Match Score</p>
                {recConfig && (
                  <span
                    className={cn(
                      "mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold text-xs",
                      recConfig.color,
                    )}
                  >
                    <RecIcon className="h-3 w-3" />
                    {screening.recommendation}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="relative h-20 w-20 flex-shrink-0">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke={
                    screening.matchScore >= 85
                      ? "#10b981"
                      : screening.matchScore >= 70
                        ? "#3b82f6"
                        : screening.matchScore >= 55
                          ? "#f59e0b"
                          : "#ef4444"
                  }
                  strokeWidth="3"
                  strokeDasharray={`${screening.matchScore} ${100 - screening.matchScore}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground/50 text-sm leading-relaxed">
          {screening.summary}
        </p>
      </div>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <h4 className="mb-3 flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              <ThumbsUp className="h-3.5 w-3.5 text-success" /> Strengths
            </h4>
            <ul className="space-y-2">
              {screening.strengths.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-foreground/80 text-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              <ThumbsDown className="h-3.5 w-3.5 text-destructive/80" /> Gaps
            </h4>
            <ul className="space-y-2">
              {screening.gaps.map((g) => (
                <li
                  key={g}
                  className="flex items-start gap-2 text-foreground/80 text-sm"
                >
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive/80" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 border-border/50 border-t pt-4">
          <h4 className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
            Skill Breakdown
          </h4>
          <div className="space-y-2.5">
            {screening.skillBreakdown.map((sb) => (
              <div key={sb.skill}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground/80">
                    {sb.skill}
                  </span>
                  <span
                    className={cn(
                      "font-bold text-xs tabular-nums",
                      sb.score >= 85
                        ? "text-success"
                        : sb.score >= 70
                          ? "text-primary"
                          : "text-warning",
                    )}
                  >
                    {sb.score}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      sb.score >= 85
                        ? "bg-success"
                        : sb.score >= 70
                          ? "bg-primary"
                          : "bg-warning/80",
                    )}
                    style={{ width: `${sb.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
