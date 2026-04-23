import type { Project } from "@ai-hackathon/shared";
import { Code2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectsCardProps {
  projects: Project[];
}

export function ProjectsCard({ projects }: ProjectsCardProps) {
  if (projects.length === 0) return null;

  return (
    <Card className="shadow-premium border-border/50 p-8">
      <div className="mb-10 flex items-center gap-3 border-b border-border/10 pb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/30 border border-border/20 text-foreground/30 shadow-ethereal">
          <Code2 className="h-4.5 w-4.5" />
        </div>
        <h3 className="font-display text-[14px] font-light text-foreground uppercase tracking-[0.2em] opacity-60">Technical Portfolio</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/10 bg-secondary/[0.03] p-6 shadow-ethereal transition-all hover:bg-secondary/[0.05] group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                 <p className="font-bold text-foreground/80 text-[15px] tracking-tight group-hover:text-primary transition-colors">
                    {proj.name}
                 </p>
                 <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">
                    {proj.role}
                 </p>
              </div>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 flex items-center justify-center rounded-full border border-border/10 text-muted-foreground/30 transition-all hover:text-foreground hover:bg-background hover:shadow-ethereal"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <p className="mt-4 text-muted-foreground/70 text-[14px] leading-relaxed font-medium tracking-tight">
              {proj.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {proj.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-border/5 bg-background px-2.5 py-1 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest shadow-ethereal"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
