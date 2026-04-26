import type { Education } from "@ai-hackathon/shared";
import { RiGraduationCapLine } from "@remixicon/react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EducationCardProps {
  education: Education[];
}

export function EducationCard({ education }: EducationCardProps) {
  return (
    <Card variant="default" className="overflow-hidden shadow-none" size="none">
      <CardHeader>
        <CardDescription>Academic</CardDescription>
        <CardTitle>Education</CardTitle>
      </CardHeader>

      <div className="space-y-comfortable p-comfortable">
        {education.map((edu, i) => (
          <div key={i} className="group flex gap-comfortable">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-micro border border-line bg-bg2 text-primary transition-all group-hover:scale-[1.05] group-hover:bg-bg-alt/40">
              <RiGraduationCapLine className="size-5" />
            </div>
            <div>
              <p className="font-medium font-sans text-[15px] text-primary tracking-tight transition-colors">
                {edu.degree} in {edu.fieldOfStudy}
              </p>
              <p className="mt-0.5 font-medium font-sans text-[12px] text-ink-muted uppercase tracking-wider">
                {edu.institution}
              </p>
              <p className="mt-2 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.15em]">
                {edu.startYear} – {edu.endYear}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
