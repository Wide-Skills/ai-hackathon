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
    label: "Analyzing",
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
    <div className="w-full space-y-section-padding pb-section-padding">
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-base border-line border-b pb-section-gap">
        <div className="relative min-w-[320px] flex-1">
          <div className="group flex h-10 items-center gap-3 rounded-standard border border-line bg-bg2/40 px-3.5 transition-all focus-within:border-primary/20 focus-within:bg-surface">
            <RiSearch2Line className="size-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent font-normal font-sans text-[13px] outline-none placeholder:text-ink-faint"
            />
          </div>
        </div>

        <div className="flex items-center gap-base">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "grid" | "table")}
            className="hidden sm:block"
          >
            <TabsList className="h-10 rounded-standard bg-bg2/50 p-1">
              <TabsTrigger
                value="grid"
                className="h-8 rounded-micro border-none px-3 data-[state=active]:bg-surface data-[state=active]:shadow-none"
              >
                <RiLayoutGridLine className="size-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="h-8 rounded-micro border-none px-3 data-[state=active]:bg-surface data-[state=active]:shadow-none"
              >
                <RiListCheck className="size-3.5" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select
            value={jobFilter}
            onValueChange={(value) => setJobFilter(value ?? "all")}
          >
            <SelectTrigger className="h-10 w-52 rounded-standard border-line bg-bg2/40 font-medium font-sans text-[11px] text-ink-muted uppercase tracking-[0.06em] shadow-none">
              <SelectValue placeholder="Pipeline" />
            </SelectTrigger>
            <SelectContent className="border-line bg-surface shadow-none">
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
            <SelectTrigger className="h-10 w-44 rounded-standard border-line bg-bg2/40 font-medium font-sans text-[11px] text-ink-muted uppercase tracking-[0.06em] shadow-none">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-line bg-surface shadow-none">
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="screening">Analyzing</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <IngestCandidatesDialog />
        </div>
      </div>

      {/* Grid Headers & Sorting */}
      {view === "grid" && (
        <div className="mb-small flex items-center justify-between px-comfortable">
          <div className="flex items-center gap-comfortable">
            <button
              onClick={() => handleSort("name")}
              className="flex items-center gap-base font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em] transition-colors hover:text-primary"
            >
              Candidate <RiArrowUpDownLine className="size-3 opacity-30" />
            </button>
            <button
              onClick={() => handleSort("score")}
              className="flex items-center gap-base font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em] transition-colors hover:text-primary"
            >
              AI Match Score <RiArrowUpDownLine className="size-3 opacity-30" />
            </button>
          </div>
          <div className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
            {filtered.length} experts discovery
          </div>
        </div>
      )}

      {/* Candidate View */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-base">
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
                  className="group flex flex-row items-center justify-between border-line p-comfortable shadow-none transition-all hover:border-line-medium"
                  size="none"
                >
                  <Link
                    href={`/dashboard/applicants/${applicant.id}` as Route}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-comfortable">
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-micro border border-line bg-bg2 font-medium font-sans text-[13px] text-ink-faint uppercase transition-transform group-hover:scale-[1.05]">
                        {applicant.firstName[0]}
                        {applicant.lastName[0]}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="mb-1 font-serif text-[18px] text-primary leading-tight transition-colors group-hover:text-primary-muted">
                          {applicant.firstName} {applicant.lastName}
                        </p>
                        <div className="flex items-center gap-base">
                          <p className="truncate font-light font-sans text-[12px] text-ink-muted">
                            {applicant.headline}
                          </p>
                          <div className="size-1 rounded-full bg-line" />
                          <div className="truncate font-medium font-sans text-[10px] text-primary/40 uppercase tracking-wider">
                            {job?.title}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-8 flex items-center gap-hero">
                      <div className="hidden items-center gap-base lg:flex">
                        <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                          {applicant.location}
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-micro">
                        <div className="flex items-center gap-base">
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
                                className="flex h-7 w-7 items-center justify-center rounded-micro border border-line bg-bg transition-all hover:bg-bg-alt active:scale-95 disabled:opacity-50"
                              >
                                {screenMutation.isPending &&
                                screenMutation.variables?.applicantId ===
                                  applicant.id ? (
                                  <RiLoader2Line className="h-3 w-3 animate-spin text-primary" />
                                ) : (
                                  <RiBrainLine className="h-3 w-3 text-ink-faint" />
                                )}
                              </TooltipTrigger>
                              <TooltipContent className="rounded-standard border-line bg-surface px-3 py-1 font-medium font-sans text-[11px] text-primary">
                                Refresh Neural Analysis
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      <div className="flex w-32 justify-end">
                        <Badge variant={sc.variant} size="sm" uppercase>
                          {sc.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-comfortable border-line border-l pl-comfortable">
                        <span className="min-w-[60px] text-right font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
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
