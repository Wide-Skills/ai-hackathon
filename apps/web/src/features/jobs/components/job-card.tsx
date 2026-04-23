import type { Job, JobStatus } from "@ai-hackathon/shared";
import {
  Briefcase,
  Building,
  ChevronRight,
  Globe,
  MapPin,
  MoreHorizontal,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  JobStatus,
  { label: string; color: string }
> = {
  active: {
    label: "Active",
    color: "text-success-foreground bg-success/5 border-success/10",
  },
  draft: {
    label: "Draft",
    color: "text-warning-foreground bg-warning/5 border-warning/10",
  },
  closed: {
    label: "Closed",
    color: "text-muted-foreground bg-secondary border-border/50",
  },
};

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const sc = statusConfig[job.status];
  const screenedPct =
    job.applicantsCount > 0
      ? Math.round((job.screenedCount / job.applicantsCount) * 100)
      : 0;

  return (
    <div
      onClick={() => router.push(`/dashboard/jobs/${job.id}` as Route)}
      className="group bg-background rounded-section border border-border/50 p-10 cursor-pointer transition-all hover:border-primary/30 hover:shadow-premium shadow-ethereal relative overflow-hidden active:scale-[0.99]"
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-6">
            <span className={cn(
              "px-3 py-1 rounded-pill text-[9px] font-bold uppercase tracking-[0.2em] border shadow-ethereal flex items-center gap-1.5",
              sc.color
            )}>
              <div className="h-1 w-1 rounded-full bg-current" />
              {sc.label}
            </span>
            <div className="h-px w-8 bg-border/10" />
            <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.25em]">
              ID: {job.id.slice(-6).toUpperCase()}
            </span>
          </div>

          <h3 className="font-display text-[26px] font-light text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors max-w-[600px]">
            {job.title}
          </h3>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 opacity-40 font-medium tracking-tight text-[13px] text-foreground/80">
            <span>{job.department}</span>
            <div className="h-1 w-1 rounded-full bg-border/60" />
            <span>{job.location}</span>
            <div className="h-1 w-1 rounded-full bg-border/60" />
            <span>{job.type}</span>
          </div>

          <p className="mt-8 line-clamp-2 text-muted-foreground/60 text-[15px] leading-relaxed max-w-[700px] font-medium tracking-tight">
            {job.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {job.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-secondary/20 border border-border/5 px-3 py-1 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest transition-colors group-hover:border-border/20"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="text-[10px] font-bold text-muted-foreground/20 self-center uppercase tracking-[0.2em] ml-2">
                + {job.skills.length - 5}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-10 lg:pl-10 lg:border-l border-border/5 min-w-[200px]">
          <div className="text-right">
             <p className="font-display text-[42px] font-light text-foreground leading-none tracking-tighter mb-2">{job.applicantsCount}</p>
             <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.25em]">Total Candidates</p>
          </div>
          
          <div className="text-right">
             <p className="font-display text-[42px] font-light text-success/60 leading-none tracking-tighter mb-2">{job.shortlistedCount}</p>
             <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.25em]">Shortlisted</p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex flex-wrap items-center gap-12 w-full sm:w-auto">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
               <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/30">Neural Engine Analysis</span>
               <span className="text-[10px] font-bold text-foreground/40 tracking-widest">{screenedPct}%</span>
            </div>
            <div className="h-1 w-48 bg-secondary/50 rounded-pill overflow-hidden shadow-inset">
               <div className="h-full bg-info/30 shadow-ethereal transition-all duration-1000" style={{ width: `${screenedPct}%` }} />
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 px-10 border-x border-border/5">
             <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/30 mb-2">Awaiting AI</span>
                <span className="text-[18px] font-display font-light text-foreground/20 leading-none">{job.applicantsCount - job.screenedCount}</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href={`/dashboard/applicants?job=${job.id}` as Route}
            onClick={(e) => e.stopPropagation()}
            className="btn-pill-outline h-11 px-8 text-[11px] font-bold uppercase tracking-[0.15em] opacity-80 hover:opacity-100 shadow-ethereal border-border/40 hover:bg-secondary/20"
          >
            Manage Pipeline
          </Link>
        </div>
      </div>
    </div>
  );
}
