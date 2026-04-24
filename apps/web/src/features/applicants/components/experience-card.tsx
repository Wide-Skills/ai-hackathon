import type { Experience } from "@ai-hackathon/shared";
import { Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ExperienceCardProps {
  experience: Experience[];
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card variant="premium" className="p-8" size="none">
      <div className="mb-10 flex items-center gap-3 border-border/10 border-b pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/20 bg-secondary/30 text-foreground/30 shadow-md">
          <Briefcase className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display font-light text-[14px] text-foreground uppercase tracking-[0.2em] opacity-60">
          Career History
        </h3>
      </div>

      <div className="space-y-10">
        {experience.map((exp, i) => (
          <div key={i} className="group flex gap-6">
            <div className="flex flex-col items-center">
              <div className="mt-2 flex h-1.5 w-1.5 flex-shrink-0 items-center justify-center rounded-full bg-primary/40 shadow-md" />
              {i < experience.length - 1 && (
                <div className="mt-4 w-px flex-1 bg-border/10" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-bold text-[15px] text-foreground/80 tracking-tight transition-colors group-hover:text-primary">
                    {exp.role}
                  </p>
                  <p className="mt-1 font-bold text-[13px] text-muted-foreground/40 uppercase tracking-widest">
                    {exp.company}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right opacity-30 transition-opacity group-hover:opacity-100">
                  <p className="font-bold text-[11px] text-muted-foreground uppercase tracking-widest">
                    {exp.startDate} – {exp.endDate}
                  </p>
                  {exp.isCurrent && (
                    <Badge variant="success" size="xs" uppercase className="shadow-sm">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
              <p className="mt-4 font-medium text-[14px] text-muted-foreground/70 leading-relaxed tracking-tight">
                {exp.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {exp.technologies.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    size="xs"
                    uppercase
                    className="shadow-md"
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
