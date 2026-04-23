import { Star } from "lucide-react";

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const color =
    score >= 85
      ? "text-success-foreground bg-success/5 border-success/10"
      : score >= 70
        ? "text-info-foreground bg-info/5 border-info/10"
        : score >= 55
          ? "text-warning-foreground bg-warning/5 border-warning/10"
          : "text-destructive-foreground bg-destructive/5 border-destructive/10";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${color}`}
    >
      <Star className="h-3 w-3 fill-current opacity-80" />
      {score}%
    </span>
  );
}
