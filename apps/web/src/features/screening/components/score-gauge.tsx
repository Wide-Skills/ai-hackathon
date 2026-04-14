import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const color =
    score >= 85
      ? "#10b981"
      : score >= 70
        ? "#3b82f6"
        : score >= 55
          ? "#f59e0b"
          : "#ef4444";
  const textColor =
    score >= 85
      ? "text-success"
      : score >= 70
        ? "text-primary"
        : score >= 55
          ? "text-warning"
          : "text-destructive";
  return (
    <div className="relative h-14 w-14 flex-shrink-0">
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${score} ${100 - score}`}
          strokeLinecap="round"
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-black text-xs tabular-nums",
          textColor,
        )}
      >
        {score}
      </span>
    </div>
  );
}
