import type { Education } from "@ai-hackathon/shared";
import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EducationCardProps {
  education: Education[];
}

export function EducationCard({ education }: EducationCardProps) {
  return (
    <Card variant="premium" className="p-8">
      <div className="mb-10 flex items-center gap-3 border-border/10 border-b pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/20 bg-secondary/30 text-foreground/30 shadow-md">
          <GraduationCap className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display font-light text-[14px] text-foreground uppercase tracking-[0.2em] opacity-60">
          Academic Background
        </h3>
      </div>

      <div className="space-y-8">
        {education.map((edu, i) => (
          <div key={i} className="group flex gap-5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-border/5 bg-secondary/30 text-muted-foreground/30 shadow-md transition-all group-hover:scale-[1.05]">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-bold text-[15px] text-foreground/80 tracking-tight transition-colors group-hover:text-primary">
                {edu.degree} in {edu.fieldOfStudy}
              </p>
              <p className="mt-1 font-bold text-[12px] text-muted-foreground/40 uppercase tracking-widest">
                {edu.institution}
              </p>
              <p className="mt-2.5 font-bold text-[11px] text-muted-foreground/20 uppercase tracking-[0.2em]">
                {edu.startYear} – {edu.endYear}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
