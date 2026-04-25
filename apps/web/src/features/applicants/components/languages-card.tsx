import type { Language } from "@ai-hackathon/shared";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LanguagesCardProps {
  languages: Language[];
}

export function LanguagesCard({ languages }: LanguagesCardProps) {
  if (!languages || languages.length === 0) return null;

  return (
    <Card variant="default" className="overflow-hidden shadow-none" size="none">
      <CardHeader>
        <CardDescription>Mapping</CardDescription>
        <CardTitle>Linguistic Mastery</CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 gap-x-hero gap-y-base p-comfortable sm:grid-cols-2">
        {languages.map((lang) => (
          <div
            key={lang.name}
            className="flex items-center justify-between border-line border-b pb-base last:border-0 last:pb-0"
          >
            <span className="font-medium font-sans text-[13px] text-primary">
              {lang.name}
            </span>
            <Badge
              variant="outline"
              size="sm"
              uppercase
              className={cn(
                "px-2 py-0.5 font-medium font-sans shadow-none",
                lang.proficiency.includes("Native") ||
                  lang.proficiency.includes("Fluent")
                  ? "border-status-success-bg bg-status-success-bg text-status-success-text"
                  : "border-line bg-bg2 text-ink-faint",
              )}
            >
              {lang.proficiency}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
