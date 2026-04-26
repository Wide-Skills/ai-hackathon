import type { Project } from "@ai-hackathon/shared";
import { RiExternalLinkLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProjectsCardProps {
  projects: Project[];
}

export function ProjectsCard({ projects }: ProjectsCardProps) {
  if (projects.length === 0) return null;

  return (
    <Card variant="default" className="overflow-hidden shadow-none" size="none">
      <CardHeader>
        <CardDescription>Portfolio</CardDescription>
        <CardTitle>Technical Projects</CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 gap-comfortable p-comfortable md:grid-cols-2">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="group rounded-standard border border-line bg-surface p-comfortable shadow-none transition-all hover:border-line-medium hover:bg-bg2/40"
          >
            <div className="mb-comfortable flex items-start justify-between">
              <div>
                <p className="font-medium font-sans text-[15px] text-primary tracking-tight transition-colors">
                  {proj.name}
                </p>
                <p className="mt-0.5 font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                  {proj.role}
                </p>
              </div>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-micro border border-line bg-surface text-ink-faint shadow-none transition-all hover:border-line-medium hover:text-primary active:scale-95"
                >
                  <RiExternalLinkLine className="size-3.5" />
                </a>
              )}
            </div>
            <p className="mt-base font-light font-sans text-[14px] text-ink-muted leading-relaxed">
              {proj.description}
            </p>
            <div className="mt-comfortable flex flex-wrap gap-small">
              {proj.technologies.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  size="sm"
                  className="border-line bg-surface"
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
