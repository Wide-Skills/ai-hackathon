import type { Experience } from "@ai-hackathon/shared";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExperienceCardProps {
  experience: Experience[];
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-semibold text-foreground text-sm">
          <Briefcase className="h-4 w-4 text-primary" /> Work Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-0">
        {experience.map((exp, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              {i < experience.length - 1 && (
                <div className="mt-2 w-px flex-1 bg-muted" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {exp.role}
                  </p>
                  <p className="font-medium text-primary text-sm">
                    {exp.company}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-muted-foreground text-xs">
                    {exp.startDate} – {exp.endDate}
                  </p>
                  {exp.isCurrent && (
                    <span className="font-semibold text-[10px] text-success">
                      Current
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {exp.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-muted px-2 py-0.5 font-medium text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
