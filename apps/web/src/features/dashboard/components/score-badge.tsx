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
      size="sm"
      uppercase
      className={cn("gap-1.5 px-2 py-1 leading-none")}
    >
      <div className="h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
      <span className="font-medium font-sans text-[10px]">{score}% Match</span>
    </Badge>
  );
}
