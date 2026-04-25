import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number;
}

export function MatchScore({ score }: MatchScoreProps) {
  const { bar, text } =
    score >= 85
      ? { bar: "bg-status-success-text", text: "text-status-success-text" }
      : score >= 70
        ? { bar: "bg-primary/60", text: "text-primary" }
        : score >= 55
          ? { bar: "bg-status-warning-text", text: "text-status-warning-text" }
          : { bar: "bg-status-error-text", text: "text-status-error-text" };

  return (
    <div className="flex items-center gap-small">
      <div className="h-1 w-12 shrink-0 overflow-hidden rounded-pill bg-bg-deep border border-line/30">
        <div
          className={cn("h-full transition-all duration-700", bar)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("font-medium font-sans text-[11px] tabular-nums tracking-tight", text)}>
        {score}%
      </span>
    </div>
  );
}
