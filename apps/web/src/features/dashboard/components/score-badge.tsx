import { Star } from "lucide-react";

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const color =
    score >= 85
      ? "text-success bg-success/10 border-success/20"
      : score >= 70
        ? "text-primary bg-primary/10 border-primary/20"
        : score >= 55
          ? "text-warning bg-warning/10 border-warning/20"
          : "text-destructive bg-destructive/10 border-destructive/20";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-bold text-xs ${color}`}
    >
      <Star className="h-3 w-3" />
      {score}%
    </span>
  );
}
