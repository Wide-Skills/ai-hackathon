import type { Skill, SkillLevel } from "@ai-hackathon/shared";
import { Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const _skillColors: Record<SkillLevel, string> = {
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
    <Card className="border-border/50 p-8 shadow-premium">
      <div className="mb-10 flex items-center gap-3 border-border/10 border-b pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/20 bg-secondary/30 text-foreground/30 shadow-ethereal">
          <Code2 className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display font-light text-[14px] text-foreground uppercase tracking-[0.2em] opacity-60">
          Neural Skills
        </h3>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-2">
        {skills.map((skill) => (
          <span
            key={skill.name}
            className={cn(
              "flex items-center gap-2.5 rounded-pill border px-4 py-1.5 font-bold text-[9px] uppercase tracking-[0.1em] shadow-ethereal transition-all hover:scale-[1.03]",
              skill.level === "Expert"
                ? "border-success/10 bg-success/5 text-success-foreground"
                : skill.level === "Advanced"
                  ? "border-info/10 bg-info/5 text-info-foreground"
                  : "border-border/10 bg-secondary/30 text-muted-foreground/60",
            )}
          >
            {skill.name}
            <span className="font-light opacity-20">|</span>
            <span className="opacity-40">{skill.yearsOfExperience}Y</span>
          </span>
        ))}
      </div>
    </Card>
  );
}
