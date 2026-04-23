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
    <Card className="shadow-premium border-border/50 p-8">
      <div className="mb-10 flex items-center gap-3 border-b border-border/10 pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/30 border border-border/20 text-foreground/30 shadow-ethereal">
          <Languages className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display text-[14px] font-light text-foreground uppercase tracking-[0.2em] opacity-60">Linguistic Mapping</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-2">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-foreground/60 tracking-tight">{lang.name}</span>
            <span className={cn(
              "rounded-pill px-3 py-1 text-[9px] font-bold uppercase tracking-widest border",
              lang.proficiency.includes("Native") || lang.proficiency.includes("Fluent") 
                ? "bg-success/5 text-success border-success/10" 
                : "bg-secondary text-muted-foreground border-border/50"
            )}>
              {lang.proficiency}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
