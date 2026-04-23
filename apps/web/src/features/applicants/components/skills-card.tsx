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
    <Card className="shadow-premium border-border/50 p-8">
      <div className="mb-10 flex items-center gap-3 border-b border-border/10 pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/30 border border-border/20 text-foreground/30 shadow-ethereal">
          <Code2 className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display text-[14px] font-light text-foreground uppercase tracking-[0.2em] opacity-60">Neural Skills</h3>
      </div>
      
      <div className="flex flex-wrap gap-2.5 pt-2">
        {skills.map((skill) => (
          <span
            key={skill.name}
            className={cn(
              "flex items-center gap-2.5 rounded-pill border px-4 py-1.5 font-bold uppercase text-[9px] tracking-[0.1em] shadow-ethereal transition-all hover:scale-[1.03]",
              skill.level === "Expert" ? "bg-success/5 text-success-foreground border-success/10" :
              skill.level === "Advanced" ? "bg-info/5 text-info-foreground border-info/10" :
              "bg-secondary/30 text-muted-foreground/60 border-border/10"
            )}
          >
            {skill.name}
            <span className="opacity-20 font-light">|</span>
            <span className="opacity-40">{skill.yearsOfExperience}Y</span>
          </span>
        ))}
      </div>
    </Card>
  );
}
