import type { Language } from "@ai-hackathon/shared";
import { Languages } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LanguagesCardProps {
  languages: Language[];
}

export function LanguagesCard({ languages }: LanguagesCardProps) {
  if (!languages || languages.length === 0) return null;

  return (
    <Card className="border-border/50 p-8 shadow-premium">
      <div className="mb-10 flex items-center gap-3 border-border/10 border-b pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/20 bg-secondary/30 text-foreground/30 shadow-ethereal">
          <Languages className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display font-light text-[14px] text-foreground uppercase tracking-[0.2em] opacity-60">
          Linguistic Mapping
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-6 pt-2 sm:grid-cols-2">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center justify-between">
            <span className="font-bold text-[13px] text-foreground/60 tracking-tight">
              {lang.name}
            </span>
            <span
              className={cn(
                "rounded-pill border px-3 py-1 font-bold text-[9px] uppercase tracking-widest",
                lang.proficiency.includes("Native") ||
                  lang.proficiency.includes("Fluent")
                  ? "border-success/10 bg-success/5 text-success"
                  : "border-border/50 bg-secondary text-muted-foreground",
              )}
            >
              {lang.proficiency}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
