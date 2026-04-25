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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
      variant="default"
      className="group cursor-pointer overflow-hidden border-line transition-all duration-200 hover:border-line-medium"
      size="none"
    >
      {/* SECTION 1: Identity & Primary Info */}
      <CardHeader className="flex flex-row items-center justify-between bg-bg-alt/20 px-comfortable py-base">
        <div className="flex flex-col gap-micro">
          <div className="flex items-center gap-base">
            <Badge variant={sc.variant} size="sm" uppercase>
              <div className="mr-1.5 h-1 w-1 rounded-full bg-current opacity-60" />
              {sc.label}
            </Badge>
            <span className="font-mono text-[10px] text-ink-faint uppercase tracking-widest">
              ID: {job.id.slice(-8)}
            </span>
          </div>
          <CardTitle className="mt-1 font-serif text-[28px] text-primary transition-colors group-hover:text-primary-muted">
            {job.title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-base">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="icon-sm"
                    className="rounded-micro border-line text-ink-faint transition-all hover:border-line-medium hover:text-primary"
                  />
                }
              >
                <RiLink className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent className="rounded-standard border-line bg-surface px-3 py-1 font-medium font-sans text-[11px] text-primary">
                Copy Public Link
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      {/* SECTION 2: Hierarchal Metadata Band */}
      <div className="flex flex-wrap items-center gap-x-base gap-y-2 border-line border-b bg-bg/10 px-comfortable py-3">
        <div className="flex items-center gap-small font-medium font-sans text-[11px] text-ink-muted uppercase tracking-wider">
          <RiBuildingLine className="size-3.5 opacity-40" />
          {job.department}
        </div>
        <div className="size-1 rounded-full bg-line" />
        <div className="flex items-center gap-small font-medium font-sans text-[11px] text-ink-muted uppercase tracking-wider">
          <RiMapPinLine className="size-3.5 opacity-40" />
          {job.location}
        </div>
        <div className="size-1 rounded-full bg-line" />
        <div className="flex items-center gap-small font-medium font-sans text-[11px] text-ink-muted uppercase tracking-wider">
          <RiBriefcaseLine className="size-3.5 opacity-40" />
          {job.type}
        </div>
      </div>

      {/* SECTION 3: Content & Context */}
      <div className="flex flex-col justify-between gap-hero space-y-medium p-comfortable md:flex-row md:items-start">
        <div className="flex-1 space-y-base">
          <p className="line-clamp-2 max-w-[70ch] font-light font-sans text-[15px] text-ink-muted leading-relaxed">
            {job.description}
          </p>
          <div className="flex flex-wrap gap-small">
            {job.skills.slice(0, 5).map((skill) => (
              <Badge key={skill} variant="secondary" size="sm">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 5 && (
              <span className="self-center pl-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                + {job.skills.length - 5} More
              </span>
            )}
          </div>
        </div>

        {/* SECTION 4: Performance Metrics */}
        <div className="flex shrink-0 items-center gap-hero border-line border-l py-1 pl-comfortable">
          <div className="flex min-w-[80px] flex-col">
            <span className="font-serif text-[26px] text-primary leading-none">
              {job.applicantsCount}
            </span>
            <span className="mt-1.5 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
              Applicants
            </span>
          </div>
          <div className="flex min-w-[80px] flex-col">
            <span className="font-serif text-[26px] text-status-success-text leading-none">
              {job.shortlistedCount}
            </span>
            <span className="mt-1.5 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
              Shortlisted
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 5: Footer Progress & Action */}
      <div className="flex flex-col items-center justify-between gap-base border-line border-t bg-bg-alt/10 px-comfortable py-base lg:flex-row">
        <div className="flex w-full flex-1 items-center gap-base lg:w-auto">
          <div className="flex w-full max-w-[300px] items-center gap-base">
            <div className="h-1.5 flex-1 overflow-hidden rounded-pill border border-line bg-bg-deep">
              <div
                className={cn(
                  "h-full transition-all duration-1000",
                  screenedPct > 80 ? "bg-status-success-text" : "bg-primary/40",
                )}
                style={{ width: `${screenedPct}%` }}
              />
            </div>
            <span className="shrink-0 font-bold font-sans text-[11px] text-primary/60">
              {screenedPct}% AI Coverage
            </span>
          </div>
        </div>

        <div className="flex w-full items-center gap-base lg:w-auto lg:justify-end">
          <Button
            render={
              <Link
                href={`/dashboard/applicants?job=${job.id}` as Route}
                onClick={(e) => e.stopPropagation()}
              />
            }
            variant="default"
            size="sm"
            className="h-9 px-6 font-medium font-sans text-[13px]"
          >
            Manage Pipeline
          </Button>
        </div>
      </div>
    </Card>
  );
}
