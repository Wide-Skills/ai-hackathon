import type { Job, JobStatus } from "@ai-hackathon/shared";
import {
  Briefcase,
  Building,
  Link2,
  MapPin,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
      className="cursor-pointer group rounded-3xl border border-border/40 bg-background shadow-md hover:border-primary/20 hover:shadow-lg transition-all"
      size="none"
    >
      {/* SECTION 1: Identity & Primary Info */}
      <div className="p-10 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Badge
            variant={sc.variant}
            size="xs"
            uppercase
            className="shadow-sm"
          >
            <div className="h-1 w-1 rounded-full bg-current opacity-60" />
            <span className="translate-y-[0.5px]">{sc.label}</span>
          </Badge>
          <span className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">
            ID: {job.id.slice(-8).toUpperCase()}
          </span>
        </div>

        <h3 className="font-display text-[28px] font-light text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors max-w-[650px]">
          {job.title}
        </h3>
      </div>

      {/* SECTION 2: Hierarchal Metadata Band (Separated by subtle border) */}
      <div className="px-10 py-5 border-y border-border/5 bg-secondary/[0.01] flex flex-wrap items-center gap-x-8 gap-y-2 opacity-60 font-bold uppercase tracking-widest text-[9px] text-muted-foreground">
        <span className="flex items-center gap-2"><Building className="h-3 w-3 opacity-40" />{job.department}</span>
        <div className="h-3 w-px bg-border/20 hidden sm:block" />
        <span className="flex items-center gap-2"><MapPin className="h-3 w-3 opacity-40" />{job.location}</span>
        <div className="h-3 w-px bg-border/20 hidden sm:block" />
        <span className="flex items-center gap-2"><Briefcase className="h-3 w-3 opacity-40" />{job.type}</span>
      </div>

      {/* SECTION 3: Content & Context */}
      <div className="p-10 pt-8 pb-10 space-y-8">
        <p className="line-clamp-2 text-foreground/50 text-[14px] leading-relaxed max-w-[700px] font-medium tracking-tight">
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
            <span className="text-[9px] font-bold text-muted-foreground/20 self-center uppercase tracking-widest ml-1">
              + {job.skills.length - 5} More
            </span>
          )}
        </div>
      </div>

      {/* SECTION 4: Performance & Action Band (Stronger separation for transition to metrics) */}
      <div className="px-10 py-8 border-t border-border/10 bg-secondary/[0.01] flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-12 w-full lg:w-auto">
          {/* Main Metrics Group */}
          <div className="flex items-center gap-10">
            <div className="space-y-1">
               <p className="text-[28px] font-display font-light text-foreground leading-none tracking-tighter">{job.applicantsCount}</p>
               <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Applicants</p>
            </div>
            <div className="h-8 w-px bg-border/10" />
            <div className="space-y-1">
               <p className="text-[28px] font-display font-light text-success/60 leading-none tracking-tighter">{job.shortlistedCount}</p>
               <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Shortlisted</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex-1 lg:flex-none flex flex-col gap-2.5 min-w-[180px] lg:pl-10 lg:border-l border-border/5">
            <div className="flex items-center justify-between">
               <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">AI Analysis</span>
               <span className="text-[10px] font-bold text-info/50 tracking-widest">{screenedPct}%</span>
            </div>
            <div className="h-1 w-full bg-secondary/50 rounded-full overflow-hidden shadow-inset">
               <div className={cn("h-full transition-all duration-1000", screenedPct > 80 ? "bg-success/40" : "bg-info/30")} style={{ width: `${screenedPct}%` }} />
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-4 shrink-0 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-border/5 pt-6 lg:pt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="icon-lg"
                    className="rounded-full shadow-md hover:border-primary/20 text-muted-foreground/60 hover:text-primary"
                  />
                }
              >
                <Link2 className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">
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
