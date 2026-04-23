"use client";

import type { ApplicationStatus } from "@ai-hackathon/shared";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Briefcase,
  ChevronRight,
  Cpu,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  RefreshCw,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { ScoreBadge } from "@/features/dashboard/components/score-badge";
import { UploadCandidatesDialog } from "./upload-candidates-dialog";
import { motion } from "framer-motion";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "Pending",
    color: "text-muted-foreground bg-secondary border-border/50",
  },
  screening: {
    label: "Screening",
    color: "text-info-foreground bg-info/5 border-info/10",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "text-success-foreground bg-success/5 border-success/10",
  },
  rejected: {
    label: "Rejected",
    color: "text-destructive-foreground bg-destructive/5 border-destructive/10",
  },
  hired: {
    label: "Hired",
    color: "text-info-foreground bg-info/5 border-info/10",
  },
};

type SortField = "score" | "name" | "applied";
type SortDir = "asc" | "desc";

function isStatusFilter(value: string): value is ApplicationStatus | "all" {
  return [
    "all",
    "pending",
    "screening",
    "shortlisted",
    "rejected",
    "hired",
  ].includes(value);
}

export function ApplicantsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  
  const { data: applicantsData = [], isLoading: appsLoading } = useQuery(
    trpc.applicants.list.queryOptions(),
  );
  const { data: jobsData = [] } = useQuery(trpc.jobs.list.queryOptions());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = applicantsData
    .filter((a) => {
      const name = `${a.firstName} ${a.lastName}`.toLowerCase();
      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        a.email.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesJob = jobFilter === "all" || a.jobId === jobFilter;
      return matchesSearch && matchesStatus && matchesJob;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "score") {
        cmp = (a.screening?.matchScore ?? 0) - (b.screening?.matchScore ?? 0);
      } else if (sortField === "name") {
        cmp = a.firstName.localeCompare(b.firstName);
      } else if (sortField === "applied") {
        cmp = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  if (appsLoading) {
    return (
      <div className="w-full space-y-12 animate-pulse">
        <div className="h-10 w-full bg-secondary/30 rounded-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-secondary/30 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-6 border-b border-border/50 pb-10">
        <div className="relative min-w-[320px] flex-1">
          <InputGroup className="h-11 rounded-full border-border bg-foreground/[0.01] focus-within:ring-info/20 px-1 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <InputGroupAddon align="inline-start" className="pl-5">
              <Search className="h-4 w-4 text-muted-foreground/40" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search talent pool..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[14px]"
            />
          </InputGroup>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={jobFilter}
            onValueChange={(value) => setJobFilter(value ?? "all")}
          >
            <SelectTrigger className="h-11 w-52 rounded-full border-border bg-background shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-[13px] font-medium text-foreground/70">
              <div className="flex items-center">
                 <Briefcase className="mr-2 h-4 w-4 opacity-40" />
                 <SelectValue placeholder="Pipeline" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pipelines</SelectItem>
              {jobsData.map((j) => (
                <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) => isStatusFilter(value ?? "all") && setStatusFilter(value ?? "all")}
          >
            <SelectTrigger className="h-11 w-44 rounded-full border-border bg-background shadow-[0_1px_3px_rgba(0,0,0,0.01)] text-[13px] font-medium text-foreground/70">
              <div className="flex items-center">
                 <SlidersHorizontal className="mr-2 h-4 w-4 opacity-40" />
                 <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <UploadCandidatesDialog />
        </div>
      </div>

      {/* Grid Headers & Sorting */}
      <div className="flex items-center justify-between px-8 mb-4">
        <div className="flex items-center gap-12">
          <button 
            onClick={() => handleSort("name")}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            Candidate <ArrowUpDown className="h-3 w-3 opacity-30" />
          </button>
          <button 
            onClick={() => handleSort("score")}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            AI Rank <ArrowUpDown className="h-3 w-3 opacity-30" />
          </button>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
          Showing {filtered.length} experts
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((applicant, i) => {
          const sc = statusConfig[applicant.status];
          const job = jobsData.find((j) => j.id === applicant.jobId);
          
          return (
            <motion.div
              key={applicant.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Link
                href={`/dashboard/applicants/${applicant.id}` as Route}
                className="group flex items-center justify-between bg-background rounded-lg border border-border p-6 transition-all hover:border-foreground/10 shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-secondary border border-border/50 flex items-center justify-center text-[13px] font-bold text-muted-foreground/60 uppercase shadow-sm">
                    {applicant.firstName[0]}{applicant.lastName[0]}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-medium text-foreground tracking-tight mb-1">
                      {applicant.firstName} {applicant.lastName}
                    </p>
                    <div className="flex items-center gap-4">
                       <p className="truncate text-[13px] text-muted-foreground font-medium tracking-tight">
                         {applicant.headline}
                       </p>
                       <div className="h-1.5 w-1.5 rounded-full bg-border/40 flex-shrink-0" />
                       <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-info/70 truncate">
                         <Briefcase className="h-3.5 w-3.5" />
                         {job?.title}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12 ml-8">
                  <div className="hidden lg:flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                     <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                     <span className="text-[12px] font-medium text-foreground">{applicant.location}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 w-28">
                     <ScoreBadge score={applicant.screening?.matchScore ?? 0} />
                     {!applicant.screening && (
                       <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse mt-1">Analyzing</span>
                     )}
                  </div>

                  <div className="w-32 flex justify-end">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                      sc.color
                    )}>
                      {sc.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 pl-6 border-l border-border/40">
                    <span className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest min-w-[70px] text-right">
                      {new Date(applicant.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-foreground transition-all group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-24 text-center rounded-xl border border-dashed border-border bg-secondary/5">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary mb-6">
               <Users className="h-6 w-6 text-muted-foreground/30" />
            </div>
            <p className="text-[16px] font-light text-foreground uppercase tracking-widest">Talent Pool Empty</p>
            <p className="mt-2 text-[13px] text-muted-foreground font-medium tracking-tight">Adjust your search parameters to find the perfect match</p>
          </div>
        )}
      </div>
    </div>
  );
}
