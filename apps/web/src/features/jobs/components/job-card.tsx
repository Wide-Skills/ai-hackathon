import type { Job, JobStatus } from "@ai-hackathon/shared";
import {
  Briefcase,
  Building,
  Calendar,
  ChevronRight,
  DollarSign,
  Globe,
  MapPin,
  MoveVertical as MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  JobStatus,
  { label: string; color: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
  },
  draft: {
    label: "Draft",
    color: "bg-warning/10 text-warning border-warning/20",
    dot: "bg-warning",
  },
  closed: {
    label: "Closed",
    color: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground/40",
  },
};

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const sc = statusConfig[job.status];
  const screenedPct =
    job.applicantsCount > 0
      ? Math.round((job.screenedCount / job.applicantsCount) * 100)
      : 0;

  return (
    <Card className="group border-border shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base text-foreground transition-colors group-hover:text-primary">
                  {job.title}
                </h3>
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold text-[10px]",
                    sc.color,
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                  {sc.label}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Building className="h-3 w-3" />
                  {job.department}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Globe className="h-3 w-3" />
                  {job.type}
                </span>
                {job.salaryMin && (
                  <span className="flex items-center gap-1 text-muted-foreground text-xs">
                    <DollarSign className="h-3 w-3" />
                    {job.salaryMin.toLocaleString()} –{" "}
                    {job.salaryMax?.toLocaleString()} {job.currency}/mo
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-muted-foreground">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
          {job.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-border/50 border-t pt-4">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="font-bold text-foreground text-lg">
                {job.applicantsCount}
              </p>
              <p className="text-[10px] text-muted-foreground/70">Applied</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-primary">
                {job.screenedCount}
              </p>
              <p className="text-[10px] text-muted-foreground/70">Screened</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-success">
                {job.shortlistedCount}
              </p>
              <p className="text-[10px] text-muted-foreground/70">
                Shortlisted
              </p>
            </div>
          </div>

          <div className="max-w-32 flex-1">
            <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Screened</span>
              <span>{screenedPct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${screenedPct}%` }}
              />
            </div>
          </div>

          <Link href={`/dashboard/applicants?job=${job.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 border-border font-medium text-xs hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              View Applicants
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {job.closingDate && (
          <div className="mt-3 flex items-center gap-1.5 text-muted-foreground/70 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            Closes{" "}
            {new Date(job.closingDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
