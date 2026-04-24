import type { Experience } from "@ai-hackathon/shared";
import { Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExperienceCardProps {
  experience: Experience[];
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card variant="exhibit" size="none" className="p-8">
      <div className="mb-10 flex items-center gap-3 border-b border-border/10 pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/30 border border-border/20 text-foreground/30 shadow-ethereal">
          <Briefcase className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display text-[14px] font-light text-foreground uppercase tracking-[0.2em] opacity-60">Career History</h3>
      </div>
      
      <div className="space-y-10">
        {experience.map((exp, i) => (
          <div key={i} className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="flex h-1.5 w-1.5 flex-shrink-0 items-center justify-center rounded-full bg-primary/40 shadow-ethereal mt-2" />
              {i < experience.length - 1 && (
                <div className="mt-4 w-px flex-1 bg-border/10" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-foreground/80 text-[15px] tracking-tight group-hover:text-primary transition-colors">
                    {exp.role}
                  </p>
                  <p className="text-[13px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">
                    {exp.company}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right opacity-30 group-hover:opacity-100 transition-opacity">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    {exp.startDate} – {exp.endDate}
                  </p>
                  {exp.isCurrent && (
                    <Badge variant="success" size="technical" className="mt-1">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
              <p className="mt-4 text-muted-foreground/70 text-[14px] leading-relaxed font-medium tracking-tight">
                {exp.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {exp.technologies.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    size="technical"
                    className="bg-secondary/30 border-border/10 px-2.5 py-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest shadow-ethereal"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
