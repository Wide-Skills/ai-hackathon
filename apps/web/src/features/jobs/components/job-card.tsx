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
      className="group bg-background rounded-lg border border-border p-8 cursor-pointer transition-all hover:border-foreground/10 shadow-[0_1px_3px_rgba(0,0,0,0.01)] relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary/50 border border-border/50 text-foreground/40">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
               <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-display text-[22px] font-light text-foreground tracking-tight leading-none">
                    {job.title}
                  </h3>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                    sc.color
                  )}>
                    {sc.label}
                  </span>
               </div>
               <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 opacity-60">
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground tracking-tight">
                    <Building className="h-3.5 w-3.5" />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground tracking-tight">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground tracking-tight">
                    <Globe className="h-3.5 w-3.5" />
                    {job.type}
                  </span>
               </div>
            </div>
          </div>

          <p className="mt-6 line-clamp-2 text-muted-foreground text-[14px] leading-relaxed max-w-[800px] font-medium tracking-tight">
            {job.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-secondary/60 border border-border/50 px-3 py-1 text-[11px] font-bold text-foreground/60 uppercase tracking-wider"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] font-bold text-muted-foreground/40 self-center uppercase tracking-widest ml-1">
                + {job.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-12">
          <button
            onClick={(e) => e.stopPropagation()}
            className="h-9 w-9 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground/40" />
          </button>
          
          <div className="text-right">
             <p className="font-display text-[28px] font-light text-foreground leading-none mb-1.5">{job.applicantsCount}</p>
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Candidates</p>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-1.5">Processed</span>
            <div className="flex items-center gap-2.5">
               <div className="h-1 w-16 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-success/40" style={{ width: `${screenedPct}%` }} />
               </div>
               <span className="text-[12px] font-bold text-foreground/70">{screenedPct}%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8 pl-8 border-l border-border/40">
             <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Shortlisted</span>
                <span className="text-[15px] font-bold text-success-foreground">{job.shortlistedCount}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Pending</span>
                <span className="text-[15px] font-bold text-foreground/40">{job.applicantsCount - job.screenedCount}</span>
             </div>
          </div>
        </div>

        <Link
          href={`/dashboard/applicants?job=${job.id}` as Route}
          onClick={(e) => e.stopPropagation()}
          className="flex h-10 items-center gap-2 rounded-full bg-secondary/80 border border-border px-5 text-[12px] font-bold uppercase tracking-[0.15em] text-foreground/70 hover:bg-secondary transition-all shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
        >
          Manage Pipeline
          <ChevronRight className="h-3.5 w-3.5 opacity-40" />
        </Link>
      </div>
    </div>
  );
}
