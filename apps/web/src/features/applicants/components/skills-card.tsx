import type { Skill } from "@ai-hackathon/shared";
import { RiCodeLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkillsCardProps {
  skills: Skill[];
}

export function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <Card className="border-border/50 p-8 shadow-lg">
      <div className="mb-10 flex items-center gap-3 border-border/10 border-b pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/20 bg-secondary/30 text-foreground/30 shadow-md">
          <RiCodeLine className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display font-light text-[14px] text-foreground uppercase tracking-[0.2em] opacity-60">
          Neural Skills
        </h3>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-2">
        {skills.map((skill) => (
          <Badge
            key={skill.name}
            variant="outline"
            size="default"
            uppercase
            className={cn(
              "flex items-center gap-2.5 px-4 py-1.5 font-bold shadow-md transition-all hover:scale-[1.03]",
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
          </Badge>
        ))}
      </div>
    </Card>
  );
}
