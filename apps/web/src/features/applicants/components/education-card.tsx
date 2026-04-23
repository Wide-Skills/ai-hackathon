import type { Education } from "@ai-hackathon/shared";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EducationCardProps {
  education: Education[];
}

export function EducationCard({ education }: EducationCardProps) {
  return (
    <Card className="shadow-premium border-border/50 p-8">
      <div className="mb-10 flex items-center gap-3 border-b border-border/10 pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/30 border border-border/20 text-foreground/30 shadow-ethereal">
          <GraduationCap className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display text-[14px] font-light text-foreground uppercase tracking-[0.2em] opacity-60">Academic Background</h3>
      </div>
      
      <div className="space-y-8">
        {education.map((edu, i) => (
          <div key={i} className="flex gap-5 group">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/30 border border-border/5 text-muted-foreground/30 shadow-ethereal transition-all group-hover:scale-[1.05]">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-bold text-foreground/80 text-[15px] tracking-tight group-hover:text-primary transition-colors">
                {edu.degree} in {edu.fieldOfStudy}
              </p>
              <p className="text-[12px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">
                {edu.institution}
              </p>
              <p className="text-[11px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em] mt-2.5">
                {edu.startYear} – {edu.endYear}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
