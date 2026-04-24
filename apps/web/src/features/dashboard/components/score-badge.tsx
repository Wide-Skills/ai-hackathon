import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const variant =
    score >= 85
      ? ("success" as const)
      : score >= 70
        ? ("info" as const)
        : score >= 55
          ? ("warning" as const)
          : ("destructive" as const);

  return (
    <Badge
      variant={variant}
      size="default"
      uppercase
      className={cn("gap-2 px-3 py-1.5 leading-none shadow-md")}
    >
      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" />
      <span className="translate-y-[0.5px]">{score}% Match</span>
    </Badge>
  );
}
