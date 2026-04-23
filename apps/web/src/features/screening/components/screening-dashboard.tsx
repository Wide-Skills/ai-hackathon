"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  BrainCircuit,
  Clock,
  Cpu,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { ScreeningCard } from "./screening-card";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { motion } from "framer-motion";

export function ScreeningDashboard() {
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const { data: applicantsData, isLoading: appsLoading } = useQuery(
    trpc.applicants.list.queryOptions(),
  );
  const { data: jobsData, isLoading: jobsLoading } = useQuery(
    trpc.jobs.list.queryOptions(),
  );

  const screenMutation = useMutation(
    trpc.screenings.generateMock.mutationOptions(),
  );

  const applicants = applicantsData || [];
  const jobs = jobsData || [];

  const screened = applicants.filter((a) => a.screening);
  const pending = applicants.filter((a) => !a.screening);

  const filtered = screened
    .filter((a) => selectedJob === "all" || a.jobId === selectedJob)
    .sort(
      (a, b) => (b.screening?.matchScore ?? 0) - (a.screening?.matchScore ?? 0),
    );

  const avgScore = Math.round(
    filtered.reduce((acc, a) => acc + (a.screening?.matchScore ?? 0), 0) /
      (filtered.length || 1),
  );

  const distribution = {
    "Strongly Recommend": filtered.filter((a) => a.screening?.recommendation === "Strongly Recommend").length,
    Recommend: filtered.filter((a) => a.screening?.recommendation === "Recommend").length,
    Consider: filtered.filter((a) => a.screening?.recommendation === "Consider").length,
    "Not Recommended": filtered.filter((a) => a.screening?.recommendation === "Not Recommended").length,
  };

  const handleRunScreening = async () => {
    const pendingToScreen = selectedJob === "all" ? pending : pending.filter((a) => a.jobId === selectedJob);
    if (pendingToScreen.length === 0) {
      toast.info("No pending candidates to screen.");
      return;
    }
    setRunning(true);
    setProgress(0);
    let completed = 0;
    const errors: string[] = [];
    for (const applicant of pendingToScreen) {
      try {
        await screenMutation.mutateAsync({ applicantId: applicant.id, jobId: applicant.jobId });
        completed++;
        setProgress(Math.round((completed / pendingToScreen.length) * 100));
      } catch {
        errors.push(`${applicant.firstName} ${applicant.lastName}`);
      }
    }
    await queryClient.invalidateQueries({ queryKey: [["applicants"]] });
    await queryClient.invalidateQueries({ queryKey: [["jobs"]] });
    await queryClient.invalidateQueries({ queryKey: [["screenings"]] });
    setRunning(false);
    setProgress(0);
    if (errors.length > 0) {
      toast.warning(`Screened ${completed} candidates. ${errors.length} failed.`);
    } else {
      toast.success(`AI screening complete! Analyzed ${completed} candidates.`);
    }
  };

  if (appsLoading || jobsLoading) {
    return (
      <div className="w-full space-y-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-secondary/30 rounded-xl" />)}
        </div>
        <div className="h-[600px] w-full bg-secondary/30 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Top Metrics row */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <StatCard label="Total Screened" value={screened.length} sublabel="Overall throughput" icon={Cpu} color="bg-secondary/50 text-foreground/40" />
        <StatCard label="Avg Match Score" value={`${avgScore}%`} sublabel="Model quality" icon={BarChart3} color="bg-info/10 text-info" />
        <StatCard label="Strong Matches" value={filtered.filter((a) => (a.screening?.matchScore ?? 0) >= 85).length} sublabel="Top candidates" icon={Star} color="bg-success/10 text-success" />
        <StatCard label="Pending Queue" value={pending.length} sublabel="Awaiting analysis" icon={Clock} color="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 items-start">
        {/* Control Sidebar */}
        <div className="space-y-10 lg:col-span-1">
          <div className="bg-background rounded-xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] group">
            <div className="px-8 py-5 border-b border-border/50 bg-secondary/[0.03] flex items-center justify-between">
              <h3 className="font-display text-[15px] font-light text-foreground uppercase tracking-[0.1em]">Engine</h3>
              <Sparkles className="h-3.5 w-3.5 text-info opacity-30 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-8">
              <p className="text-muted-foreground text-[13px] leading-relaxed mb-10 font-medium tracking-tight">
                Powered by Gemini 1.5 Pro. Analyzes profile expertise with surgical precision.
              </p>

              <button
                onClick={handleRunScreening}
                disabled={running || pending.length === 0}
                className="w-full h-11 rounded-full bg-primary text-primary-foreground text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm disabled:opacity-40"
              >
                {running ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> {progress}%
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" /> Screen Pending
                  </>
                )}
              </button>
              {running && (
                <div className="mt-6 h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <div className="px-8 py-5 border-b border-border/50 bg-secondary/[0.03]">
              <h3 className="font-display text-[15px] font-light text-foreground uppercase tracking-[0.1em]">Split</h3>
            </div>
            <div className="p-8 space-y-6">
              {Object.entries(distribution).map(([rec, count]) => {
                const colors: Record<string, string> = {
                  "Strongly Recommend": "bg-success/40",
                  Recommend: "bg-info/40",
                  Consider: "bg-warning/40",
                  "Not Recommended": "bg-destructive/40",
                };
                const pct = filtered.length > 0 ? Math.round((count / filtered.length) * 100) : 0;
                return (
                  <div key={rec} className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      <span>{rec.split(' ')[0]}</span>
                      <span className="text-foreground/70">{count}</span>
                    </div>
                    <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full", colors[rec])} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <div className="px-8 py-5 border-b border-border/50 bg-secondary/[0.03]">
              <h3 className="font-display text-[15px] font-light text-foreground uppercase tracking-[0.1em]">Focus</h3>
            </div>
            <div className="p-8">
              <Select value={selectedJob} onValueChange={(value) => setSelectedJob(value ?? "all")}>
                <SelectTrigger className="h-10 rounded-lg border-border bg-background shadow-sm text-[13px] font-medium text-foreground/70">
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pipelines</SelectItem>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Talent List */}
        <div className="lg:col-span-3">
          <div className="mb-8 flex items-end justify-between border-b border-border/50 pb-8">
            <div>
              <h2 className="font-display text-[24px] font-light text-foreground uppercase tracking-[0.1em]">Screened Talent</h2>
              <p className="text-[13px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">Ranked by match logic • {filtered.length} Results</p>
            </div>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: [["applicants"]] })}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-all hover:bg-secondary active:scale-[0.95] shadow-sm text-muted-foreground/60"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {filtered.map((applicant) => {
              const job = jobs.find((j) => j.id === applicant.jobId);
              return (
                <ScreeningCard
                  key={applicant.id}
                  applicant={applicant}
                  jobTitle={job?.title ?? ""}
                />
              );
            })}

            {filtered.length === 0 && (
              <div className="py-24 text-center rounded-xl border border-dashed border-border bg-secondary/10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-4 text-muted-foreground/40">
                   <BrainCircuit className="h-6 w-6" />
                </div>
                <p className="text-[14px] font-bold text-foreground uppercase tracking-widest">No screening results</p>
                <p className="mt-1 text-[13px] text-muted-foreground font-medium tracking-tight">Initiate the AI engine to evaluate pending candidates</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
