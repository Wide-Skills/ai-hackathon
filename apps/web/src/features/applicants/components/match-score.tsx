import { cn } from "@/lib/utils";

interface MatchScoreProps {
  score: number;
}

export function MatchScore({ score }: MatchScoreProps) {
  const { bar, text } =
    score >= 85
      ? { bar: "bg-success", text: "text-success" }
      : score >= 70
        ? { bar: "bg-primary", text: "text-primary" }
        : score >= 55
          ? { bar: "bg-warning", text: "text-warning" }
          : { bar: "bg-destructive/80", text: "text-destructive" };

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", bar)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("font-bold text-sm tabular-nums", text)}>
        {score}%
      </span>
    </div>
  );
}
