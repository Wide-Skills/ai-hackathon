import type { Education } from "@ai-hackathon/shared";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EducationCardProps {
  education: Education[];
}

export function EducationCard({ education }: EducationCardProps) {
  return (
    <Card className="border-border shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-semibold text-foreground text-sm">
          <GraduationCap className="h-4 w-4 text-primary" /> Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {education.map((edu, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted/50">
              <GraduationCap className="h-4 w-4 text-muted-foreground/70" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {edu.degree} in {edu.fieldOfStudy}
              </p>
              <p className="font-medium text-primary text-xs">
                {edu.institution}
              </p>
              <p className="text-muted-foreground/70 text-xs">
                {edu.startYear} – {edu.endYear}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
