import type { Skill } from "@ai-hackathon/shared";
import { RiCodeLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkillsCardProps {
  skills: Skill[];
}

export function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <Card variant="default" className="overflow-hidden shadow-none" size="none">
      <CardHeader>
        <CardDescription>Intelligence</CardDescription>
        <CardTitle>Skills Profile</CardTitle>
      </CardHeader>

      <div className="flex flex-wrap gap-base p-comfortable">
        {skills.map((skill) => (
          <Badge
            key={skill.name}
            variant="outline"
            size="default"
            uppercase
            className={cn(
              "flex items-center gap-base px-3 py-1 font-medium font-sans shadow-none transition-all",
              skill.level === "Expert"
                ? "border-status-success-bg bg-status-success-bg text-status-success-text"
                : skill.level === "Advanced"
                  ? "border-primary-alpha bg-primary-alpha text-primary"
                  : "border-line bg-bg2 text-ink-muted",
            )}
          >
            {skill.name}
            <span className="mx-micro opacity-20">|</span>
            <span className="font-mono text-[10px] opacity-60">
              {skill.yearsOfExperience}Y
            </span>
          </Badge>
        ))}
      </div>
    </Card>
  );
}
