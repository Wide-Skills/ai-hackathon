import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const colorClass =
    score >= 85
      ? "text-success"
      : score >= 70
        ? "text-info"
        : score >= 55
          ? "text-warning"
          : "text-destructive";

  return (
    <div className="relative h-12 w-12 flex-shrink-0">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-secondary/50"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${score} ${100 - score}`}
          strokeLinecap="round"
          className={cn("transition-all duration-1000", colorClass)}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-display font-light text-[13px] tabular-nums tracking-tighter",
          colorClass,
        )}
      >
        {score}
      </span>
    </div>
  );
}
