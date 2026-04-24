import type { Project } from "@ai-hackathon/shared";
import { RiCodeLine, RiExternalLinkLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ProjectsCardProps {
  projects: Project[];
}

export function ProjectsCard({ projects }: ProjectsCardProps) {
  if (projects.length === 0) return null;

  return (
    <Card className="border-border/50 p-8 shadow-lg">
      <div className="mb-10 flex items-center gap-3 border-border/10 border-b pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/20 bg-secondary/30 text-foreground/30 shadow-md">
          <RiCodeLine className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display font-light text-[14px] text-foreground uppercase tracking-[0.2em] opacity-60">
          Technical Portfolio
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="group rounded-xl border border-border/10 bg-secondary/[0.03] p-6 shadow-md transition-all hover:bg-secondary/[0.05]"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-bold text-[15px] text-foreground/80 tracking-tight transition-colors group-hover:text-primary">
                  {proj.name}
                </p>
                <p className="mt-1 font-bold text-[11px] text-muted-foreground/40 uppercase tracking-widest">
                  {proj.role}
                </p>
              </div>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border/10 text-muted-foreground/30 transition-all hover:bg-background hover:text-foreground hover:shadow-md"
                >
                  <RiExternalLinkLine className="h-4 w-4" />
                </a>
              )}
            </div>
            <p className="mt-4 font-medium text-[14px] text-muted-foreground/70 leading-relaxed tracking-tight">
              {proj.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {proj.technologies.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  size="xs"
                  uppercase
                  className="border-border/5 bg-background text-muted-foreground/40 shadow-sm"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
