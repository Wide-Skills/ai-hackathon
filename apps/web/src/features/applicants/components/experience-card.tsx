import type { Experience } from "@ai-hackathon/shared";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ExperienceCardProps {
  experience: Experience[];
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card variant="default" className="overflow-hidden shadow-none" size="none">
      <CardHeader>
        <CardDescription>History</CardDescription>
        <CardTitle>Career Journey</CardTitle>
      </CardHeader>

      <div className="space-y-comfortable p-comfortable">
        {experience.map((exp, i) => (
          <div key={i} className="group flex gap-base">
            <div className="flex flex-col items-center">
              <div className="mt-2 flex h-1.5 w-1.5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20" />
              {i < experience.length - 1 && (
                <div className="mt-4 w-px flex-1 bg-line" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between gap-base">
                <div>
                  <p className="font-medium font-sans text-[15px] text-primary tracking-tight transition-colors">
                    {exp.role}
                  </p>
                  <p className="mt-0.5 font-medium font-sans text-[12px] text-ink-faint uppercase tracking-wider">
                    {exp.company}
                  </p>
                </div>
                <div className="flex-shrink-0 space-y-1 text-right">
                  <p className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    {exp.startDate} – {exp.endDate}
                  </p>
                  {exp.isCurrent && (
                    <Badge variant="success" size="sm" uppercase>
                      Active
                    </Badge>
                  )}
                </div>
              </div>
              <p className="mt-comfortable max-w-[65ch] font-light font-sans text-[14px] text-ink-muted leading-relaxed">
                {exp.description}
              </p>
              <div className="mt-base flex flex-wrap gap-small">
                {exp.technologies.map((t) => (
                  <Badge key={t} variant="secondary" size="sm">
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
