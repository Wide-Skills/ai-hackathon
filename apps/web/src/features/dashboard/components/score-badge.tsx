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
      className={`inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 font-bold text-[10px] uppercase leading-none tracking-[0.1em] shadow-ethereal ${color}`}
    >
      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" />
      <span className="translate-y-[0.5px]">{score}% Match</span>
    </span>
  );
}
