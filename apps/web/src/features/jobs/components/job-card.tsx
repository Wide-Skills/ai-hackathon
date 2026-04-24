import type { Job, JobStatus } from "@ai-hackathon/shared";
import {
  RiBriefcaseLine,
  RiBuildingLine,
  RiLink,
  RiMapPinLine,
} from "@remixicon/react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  JobStatus,
  { label: string; variant: "success" | "warning" | "secondary" }
> = {
  active: {
    label: "Active",
    variant: "success",
  },
  draft: {
    label: "Draft",
    variant: "warning",
  },
  closed: {
    label: "Closed",
    variant: "secondary",
  },
};

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const sc = statusConfig[job.status];

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/jobs/${job.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Public link copied to clipboard!");
  };

  const screenedPct =
    job.applicantsCount > 0
      ? Math.round((job.screenedCount / job.applicantsCount) * 100)
      : 0;

  return (
    <Card
      onClick={() => router.push(`/dashboard/jobs/${job.id}` as Route)}
      className="group cursor-pointer rounded-3xl border border-border/40 bg-background shadow-md transition-all hover:border-primary/20 hover:shadow-lg"
      size="none"
    >
      {/* SECTION 1: Identity & Primary Info */}
      <div className="p-10 pb-8">
        <div className="mb-6 flex items-center gap-4">
          <Badge variant={sc.variant} size="xs" uppercase className="shadow-sm">
            <div className="h-1 w-1 rounded-full bg-current opacity-60" />
            <span className="translate-y-[0.5px]">{sc.label}</span>
          </Badge>
          <span className="font-bold text-[9px] text-muted-foreground/20 uppercase tracking-[0.2em]">
            ID: {job.id.slice(-8).toUpperCase()}
          </span>
        </div>

        <h3 className="max-w-[650px] font-display font-light text-[28px] text-foreground leading-tight tracking-tight transition-colors group-hover:text-primary">
          {job.title}
        </h3>
      </div>

      {/* SECTION 2: Hierarchal Metadata Band (Separated by subtle border) */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-border/5 border-y bg-secondary/[0.01] px-10 py-5 font-bold text-[9px] text-muted-foreground uppercase tracking-widest opacity-60">
        <span className="flex items-center gap-2">
          <RiBuildingLine className="h-3 w-3 opacity-40" />
          {job.department}
        </span>
        <div className="hidden h-3 w-px bg-border/20 sm:block" />
        <span className="flex items-center gap-2">
          <RiMapPinLine className="h-3 w-3 opacity-40" />
          {job.location}
        </span>
        <div className="hidden h-3 w-px bg-border/20 sm:block" />
        <span className="flex items-center gap-2">
          <RiBriefcaseLine className="h-3 w-3 opacity-40" />
          {job.type}
        </span>
      </div>

      {/* SECTION 3: Content & Context */}
      <div className="space-y-8 p-10 pt-8 pb-10">
        <p className="line-clamp-2 max-w-[700px] font-medium text-[14px] text-foreground/50 leading-relaxed tracking-tight">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 5).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              size="xs"
              uppercase
              className="px-3 py-1.5 shadow-md"
            >
              {skill}
            </Badge>
          ))}
          {job.skills.length > 5 && (
            <span className="ml-1 self-center font-bold text-[9px] text-muted-foreground/20 uppercase tracking-widest">
              + {job.skills.length - 5} More
            </span>
          )}
        </div>
      </div>

      {/* SECTION 4: Performance & Action Band (Stronger separation for transition to metrics) */}
      <div className="flex flex-col items-center justify-between gap-10 border-border/10 border-t bg-secondary/[0.01] px-10 py-8 lg:flex-row">
        <div className="flex w-full items-center gap-12 lg:w-auto">
          {/* Main Metrics Group */}
          <div className="flex items-center gap-10">
            <div className="space-y-1">
              <p className="font-display font-light text-[28px] text-foreground leading-none tracking-tighter">
                {job.applicantsCount}
              </p>
              <p className="font-bold text-[9px] text-muted-foreground/30 uppercase tracking-widest">
                Applicants
              </p>
            </div>
            <div className="h-8 w-px bg-border/10" />
            <div className="space-y-1">
              <p className="font-display font-light text-[28px] text-success/60 leading-none tracking-tighter">
                {job.shortlistedCount}
              </p>
              <p className="font-bold text-[9px] text-muted-foreground/30 uppercase tracking-widest">
                Shortlisted
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex min-w-[180px] flex-1 flex-col gap-2.5 border-border/5 lg:flex-none lg:border-l lg:pl-10">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[9px] text-muted-foreground/40 uppercase tracking-widest">
                AI Analysis
              </span>
              <span className="font-bold text-[10px] text-info/50 tracking-widest">
                {screenedPct}%
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-secondary/50 shadow-inset">
              <div
                className={cn(
                  "h-full transition-all duration-1000",
                  screenedPct > 80 ? "bg-success/40" : "bg-info/30",
                )}
                style={{ width: `${screenedPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex w-full shrink-0 items-center justify-between gap-4 border-border/5 border-t pt-6 lg:w-auto lg:justify-end lg:border-t-0 lg:pt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="icon-lg"
                    className="rounded-full text-muted-foreground/60 shadow-md hover:border-primary/20 hover:text-primary"
                  />
                }
              >
                <RiLink className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="rounded-full px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest">
                Copy Link
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            render={
              <Link
                href={`/dashboard/applicants?job=${job.id}` as Route}
                onClick={(e) => e.stopPropagation()}
              />
            }
            variant="default"
            size="xl"
            className="shadow-lg"
          >
            Manage Pipeline
          </Button>
        </div>
      </div>
    </Card>
  );
}
