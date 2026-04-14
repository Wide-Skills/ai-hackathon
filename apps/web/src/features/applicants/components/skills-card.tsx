import type { Skill, SkillLevel } from "@ai-hackathon/shared";
import { Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const skillColors: Record<SkillLevel, string> = {
  Expert: "bg-success/10 text-success border-success/20",
  Advanced: "bg-primary/10 text-primary border-primary/20",
  Intermediate: "bg-warning/10 text-warning border-warning/20",
  Beginner: "bg-muted text-muted-foreground border-border",
};

interface SkillsCardProps {
  skills: Skill[];
}

export function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-semibold text-foreground text-sm">
          <Code2 className="h-4 w-4 text-primary" /> Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium text-xs",
                skillColors[skill.level],
              )}
            >
              {skill.name}
              <span className="opacity-60">·</span>
              <span className="opacity-80">{skill.yearsOfExperience}yr</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
