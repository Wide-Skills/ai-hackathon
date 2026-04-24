"use client";

import type { ApplicationStatus } from "@ai-hackathon/shared";
import {
  RiArrowUpDownLine,
  RiBrainLine,
  RiLayoutGridLine,
  RiListCheck,
  RiLoader2Line,
  RiSearch2Line,
} from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  QueryEmptyState,
  QueryErrorState,
} from "@/components/data/query-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScoreBadge } from "@/features/dashboard/components/score-badge";
import { cn } from "@/lib/utils";
import { invalidateHiringData, trpc } from "@/utils/trpc";
import { ApplicantsTable } from "./applicants-table";
import { IngestCandidatesDialog } from "./ingest-candidates-dialog";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; variant: "secondary" | "info" | "success" | "destructive" }
> = {
  pending: {
    label: "Pending",
    variant: "secondary",
  },
  screening: {
    label: "Screening",
    variant: "info",
  },
  shortlisted: {
    label: "Shortlisted",
    variant: "success",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
  },
  hired: {
    label: "Hired",
    variant: "info",
  },
  failed: {
    label: "Failed",
    variant: "destructive",
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
    "failed",
  ].includes(value);
}

export function ApplicantsList() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("job") ?? "all";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>(initialJobId);
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [view, setView] = useState<"grid" | "table">("grid");

  const applicantsQuery = useQuery(trpc.applicants.list.queryOptions());
  const jobsQuery = useQuery(trpc.jobs.list.queryOptions());
  const applicantsData = applicantsQuery.data ?? [];
  const jobsData = jobsQuery.data ?? [];
  const queryClient = useQueryClient();

  const screenMutation = useMutation(
    trpc.screenings.generate.mutationOptions({
      onSuccess: () => {
        toast.success("AI Analysis complete");
        void invalidateHiringData(queryClient);
      },
      onError: (error) => {
        toast.error(error.message || "AI Analysis failed");
      },
    }),
  );

  useEffect(() => {
    const jobId = searchParams.get("job");
    if (jobId) {
      setJobFilter(jobId);
    }
  }, [searchParams]);

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

  if (applicantsQuery.isLoading || jobsQuery.isLoading) {
    return (
      <div className="w-full animate-pulse space-y-12">
        <div className="h-10 w-full rounded-full bg-secondary/30" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-secondary/30" />
          ))}
        </div>
      </div>
    );
  }

  if (applicantsQuery.isError) {
    return (
      <QueryErrorState
        error={applicantsQuery.error}
        title="Applicants couldn't be loaded"
        onRetry={() => applicantsQuery.refetch()}
      />
    );
  }

  if (jobsQuery.isError) {
    return (
      <QueryErrorState
        error={jobsQuery.error}
        title="Jobs couldn't be loaded"
        onRetry={() => jobsQuery.refetch()}
      />
    );
  }

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-6 border-border/20 border-b pb-10">
        <div className="relative min-w-[320px] flex-1">
          <InputGroup className="h-11 overflow-hidden rounded-full border-border/50 bg-foreground/[0.01] px-1 shadow-md focus-within:ring-info/20">
            <InputGroupAddon align="inline-start" className="pl-5">
              <RiSearch2Line className="h-4 w-4 text-muted-foreground/20" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search talent pool..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-medium text-[14px]"
            />
          </InputGroup>
        </div>

        <div className="flex items-center gap-4">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "grid" | "table")}
            className="hidden sm:block"
          >
            <TabsList className={"rounded-full"}>
              <TabsTrigger value="grid" className="rounded-full">
                <RiLayoutGridLine className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="table" className="rounded-full">
                <RiListCheck className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            value={jobFilter}
            onValueChange={(value) => setJobFilter(value ?? "all")}
          >
            <SelectTrigger className="h-11 w-52 rounded-full border-border/50 bg-background font-bold text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] shadow-md">
              <div className="flex items-center">
                <SelectValue placeholder="Pipeline">
                  {jobFilter === "all"
                    ? "All Pipelines"
                    : jobsData.find((j) => j.id === jobFilter)?.title}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="border-border/50 shadow-lg">
              <SelectItem value="all">All Pipelines</SelectItem>
              {jobsData.map((j) => (
                <SelectItem key={j.id} value={j.id}>
                  {j.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              isStatusFilter(value ?? "all") && setStatusFilter(value ?? "all")
            }
          >
            <SelectTrigger className="h-11 w-44 rounded-full border-border/50 bg-background font-bold text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] shadow-md">
              <div className="flex items-center">
                <SelectValue placeholder="Status">
                  {statusFilter === "all"
                    ? "All States"
                    : statusConfig[statusFilter as ApplicationStatus]?.label}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="border-border/50 shadow-lg">
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <IngestCandidatesDialog />
        </div>
      </div>

      {/* Grid Headers & Sorting */}
      {view === "grid" && (
        <div className="mb-4 flex items-center justify-between px-8">
          <div className="flex items-center gap-12">
            <button
              onClick={() => handleSort("name")}
              className="flex items-center gap-2 font-bold text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] transition-colors hover:text-foreground"
            >
              Candidate <RiArrowUpDownLine className="h-3 w-3 opacity-20" />
            </button>
            <button
              onClick={() => handleSort("score")}
              className="flex items-center gap-2 font-bold text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] transition-colors hover:text-foreground"
            >
              AI Rank <RiArrowUpDownLine className="h-3 w-3 opacity-20" />
            </button>
          </div>
          <div className="font-bold text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">
            Showing {filtered.length} experts
          </div>
        </div>
      )}

      {/* Candidate View */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4">
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
                <Card
                  variant="default"
                  className="group flex flex-row items-center justify-between p-6 hover:border-primary/20 hover:shadow-lg"
                >
                  <Link
                    href={`/dashboard/applicants/${applicant.id}` as Route}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/20 bg-secondary/30 font-bold text-[13px] text-muted-foreground/40 uppercase shadow-md transition-transform group-hover:scale-[1.05]">
                        {applicant.firstName[0]}
                        {applicant.lastName[0]}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="mb-1 font-medium text-[16px] text-foreground tracking-tight transition-colors group-hover:text-primary">
                          {applicant.firstName} {applicant.lastName}
                        </p>
                        <div className="flex items-center gap-4">
                          <p className="mt-1 truncate font-medium text-[12px] text-muted-foreground/50 tracking-tight">
                            {applicant.headline}
                          </p>
                          <div className="h-0.5 w-0.5 shrink-0 rounded-full bg-border/40" />
                          <div className="truncate font-bold text-[10px] text-info/40 uppercase tracking-[0.2em]">
                            {job?.title}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-8 flex items-center gap-12">
                      <div className="hidden items-center gap-2 opacity-30 lg:flex">
                        <span className="font-bold text-[11px] text-muted-foreground/60 uppercase tracking-widest">
                          {applicant.location}
                        </span>
                      </div>

                      <div className="flex w-28 flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <ScoreBadge
                            score={applicant.screening?.matchScore ?? 0}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  screenMutation.mutate({
                                    applicantId: applicant.id,
                                    jobId: applicant.jobId,
                                  });
                                }}
                                disabled={screenMutation.isPending}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-background transition-all hover:bg-secondary active:scale-95 disabled:opacity-50"
                              >
                                {screenMutation.isPending &&
                                screenMutation.variables?.applicantId ===
                                  applicant.id ? (
                                  <RiLoader2Line className="h-3 w-3 animate-spin text-primary" />
                                ) : (
                                  <RiBrainLine className="h-3 w-3 text-muted-foreground/60" />
                                )}
                              </TooltipTrigger>
                              <TooltipContent className="rounded-full px-3 py-1 font-bold text-[9px] uppercase tracking-widest">
                                Run AI Analysis
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {(!applicant.screening ||
                          applicant.status === "failed" ||
                          (screenMutation.isPending &&
                            screenMutation.variables?.applicantId ===
                              applicant.id)) && (
                          <span
                            className={cn(
                              "animate-pulse font-bold text-[8px] uppercase tracking-[0.2em]",
                              applicant.status === "failed"
                                ? "animate-none text-destructive/60"
                                : "text-muted-foreground/40",
                            )}
                          >
                            {screenMutation.isPending &&
                            screenMutation.variables?.applicantId ===
                              applicant.id
                              ? "Processing"
                              : applicant.status === "failed"
                                ? "Analysis Failed"
                                : "Analyzing"}
                          </span>
                        )}
                      </div>

                      <div className="flex w-32 justify-end">
                        <Badge
                          variant={sc.variant}
                          size="sm"
                          uppercase
                          className="shadow-md"
                        >
                          {sc.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 border-border/5 border-l pl-6">
                        <span className="min-w-[70px] text-right font-bold text-[10px] text-muted-foreground/20 uppercase tracking-widest">
                          {new Date(applicant.appliedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            );
          })}

          {filtered.length === 0 ? (
            <QueryEmptyState
              title="No applicants match the current filters"
              description="Adjust the search or import candidates into one of your active pipelines."
            />
          ) : null}
        </div>
      ) : (
        <ApplicantsTable data={filtered} />
      )}
    </div>
  );
}
