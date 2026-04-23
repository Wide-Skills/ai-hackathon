import type { Project } from "@ai-hackathon/shared";
import { Code2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectsCardProps {
  projects: Project[];
}

export function ProjectsCard({ projects }: ProjectsCardProps) {
  if (projects.length === 0) return null;

  return (
    <Card className="border-border shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-semibold text-foreground text-sm">
          <Code2 className="h-4 w-4 text-primary" /> Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-muted/50 p-4"
          >
            <div className="flex items-start justify-between">
              <p className="font-semibold text-foreground text-sm">
                {proj.name}
              </p>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/70 transition-colors hover:text-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <p className="mt-0.5 font-medium text-primary text-xs">
              {proj.role}
            </p>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              {proj.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {proj.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-medium text-[11px] text-primary"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
