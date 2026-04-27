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
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { motion } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  QueryEmptyState,
  QueryErrorState,
} from "@/components/data/query-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
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
import { useDebounce } from "@/hooks/use-debounce";
import { useAppDispatch, useAppSelector } from "@/store";
import { setApplicantsViewMode } from "@/store/slices/uiSlice";
import { invalidateHiringData, trpc } from "@/utils/trpc";
import { ApplicantsTable } from "./applicants-table";
import { IngestCandidatesDialog } from "./ingest-candidates-dialog";

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    variant:
      | "secondary"
      | "info"
      | "success"
      | "destructive"
      | "destructive-subtle";
  }
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
    variant: "destructive-subtle",
  },
  hired: {
    label: "Hired",
    variant: "info",
  },
  failed: {
    label: "Failed",
    variant: "destructive-subtle",
  },
};

const ApplicantItem = React.memo(
  ({
    applicant,
    jobTitle,
    onScreen,
    isScreening,
    index,
  }: {
    applicant: any;
    jobTitle?: string;
    onScreen: (id: string, jobId: string) => void;
    isScreening: boolean;
    index: number;
  }) => {
    const sc = statusConfig[applicant.status as ApplicationStatus];

    return (
      <motion.div
        key={applicant.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02 }}
      >
        <Card
          variant="default"
          className="group overflow-hidden border-line shadow-none transition-all hover:border-line-medium"
          size="none"
        >
          <Link
            href={`/dashboard/applicants/${applicant.id}` as Route}
            className="flex flex-col items-stretch gap-base p-comfortable sm:flex-row sm:items-center"
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
                <div className="flex flex-wrap items-center gap-x-base gap-y-1">
                  <p className="max-w-[240px] truncate font-light font-sans text-[12px] text-ink-muted leading-none">
                    {applicant.headline}
                  </p>
                  {jobTitle ? (
                    <>
                      <div className="hidden size-1 rounded-full bg-line sm:block" />
                      <div className="max-w-[180px] truncate font-medium font-sans text-[10px] text-primary/40 uppercase leading-none tracking-wider">
                        {jobTitle}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-base border-line border-t pt-base sm:flex-nowrap sm:justify-end sm:border-0 sm:pt-0">
              <div className="hidden items-center gap-base xl:flex">
                <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                  {applicant.location}
                </span>
              </div>

              <div className="flex items-center gap-base">
                <ScoreBadge score={applicant.screening?.matchScore ?? 0} />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onScreen(applicant.id, applicant.jobId);
                      }}
                      disabled={isScreening}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-micro border border-line bg-bg transition-all hover:bg-bg-alt active:scale-95 disabled:opacity-50"
                    >
                      {isScreening ? (
                        <RiLoader2Line className="h-3 w-3 animate-spin text-primary" />
                      ) : (
                        <RiBrainLine className="h-3 w-3 text-ink-faint" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent className="rounded-standard border-line bg-surface px-3 py-1 font-medium font-sans text-[11px] text-primary">
                      Re-Analyze Profile
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex min-w-[100px] justify-end sm:w-32">
                <Badge variant={sc.variant} size="sm" uppercase>
                  {sc.label}
                </Badge>
              </div>

              <div className="hidden items-center border-line border-l pl-comfortable sm:flex">
                <span className="min-w-[60px] text-right font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                  {new Date(applicant.appliedAt || "").toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>
            </div>
          </Link>
        </Card>
      </motion.div>
    );
  },
);

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // state
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") ?? "all",
  );
  const [jobFilter, setJobFilter] = useState<string>(
    searchParams.get("job") ?? "all",
  );
  const [sortField, setSortField] = useState<SortField>(
    (searchParams.get("sortBy") as SortField) ?? "score",
  );
  const [sortDir, setSortDir] = useState<SortDir>(
    (searchParams.get("sortOrder") as SortDir) ?? "desc",
  );

  const view = useAppSelector((state) => state.ui.applicantsViewMode);
  const setView = (mode: "grid" | "table") =>
    dispatch(setApplicantsViewMode(mode));

  const [page, setPage] = useState(
    Number.parseInt(searchParams.get("page") ?? "1", 10),
  );
  const [limit] = useState(10);

  // sync state to url
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let changed = false;

    const updateParam = (
      key: string,
      value: string | undefined,
      defaultValue?: string,
    ) => {
      const current = params.get(key);
      const target = value === defaultValue ? null : value;

      if (target === null) {
        if (current !== null) {
          params.delete(key);
          changed = true;
        }
      } else if (current !== target) {
        params.set(key, target || "");
        changed = true;
      }
    };

    updateParam("search", debouncedSearch);
    updateParam("status", statusFilter, "all");
    updateParam("job", jobFilter, "all");
    updateParam("sortBy", sortField, "score");
    updateParam("sortOrder", sortDir, "desc");
    updateParam("page", page > 1 ? page.toString() : undefined);

    if (changed) {
      router.replace(`${pathname}?${params.toString()}` as Route, {
        scroll: false,
      });
    }
  }, [
    debouncedSearch,
    statusFilter,
    jobFilter,
    sortField,
    sortDir,
    page,
    router,
    pathname,
  ]);

  const applicantsQuery = useQuery({
    ...trpc.applicants.list.queryOptions({
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      jobId: jobFilter !== "all" ? jobFilter : undefined,
      sortBy: sortField,
      sortOrder: sortDir,
    }),
    placeholderData: keepPreviousData,
  });

  const jobsQuery = useQuery({
    ...trpc.jobs.list.queryOptions({ page: 1, limit: 100 }),
    placeholderData: keepPreviousData,
  });

  const applicantsData = applicantsQuery.data?.items ?? [];
  const pagination = applicantsQuery.data;
  const jobsData = jobsQuery.data?.items ?? [];
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1); // reset to first page on sort change
  };

  const isLoading =
    (applicantsQuery.isPending && !applicantsQuery.data) ||
    (jobsQuery.isPending && !jobsQuery.data);

  if (isLoading) {
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
      {/* search & filters */}
      <div className="flex flex-col gap-base border-line border-b pb-section-gap lg:flex-row lg:items-center">
        <div className="relative w-full lg:flex-1">
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

        <div className="flex flex-wrap items-center gap-base">
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
            <SelectTrigger className="h-10 w-full rounded-standard border-line bg-bg2/40 font-medium font-sans text-[11px] text-ink-muted uppercase tracking-[0.06em] shadow-none sm:w-52">
              <SelectValue placeholder="Pipeline">
                {jobFilter === "all"
                  ? "All Pipelines"
                  : jobsData.find((j) => j.id === jobFilter)?.title}
              </SelectValue>
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
            <SelectTrigger className="h-10 w-full rounded-standard border-line bg-bg2/40 font-medium font-sans text-[11px] text-ink-muted uppercase tracking-[0.06em] shadow-none sm:w-44">
              <SelectValue placeholder="Status">
                {statusFilter === "all"
                  ? "All States"
                  : statusConfig[statusFilter as ApplicationStatus]?.label ||
                    "Status"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border-line bg-surface shadow-none">
              <SelectItem value="all">All States</SelectItem>
              {Object.entries(statusConfig).map(([val, config]) => (
                <SelectItem key={val} value={val}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-full sm:w-auto">
            <IngestCandidatesDialog />
          </div>
        </div>
      </div>

      {/* grid headers & sorting */}
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
            {pagination?.totalCount ?? 0} candidates found
          </div>
        </div>
      )}

      {/* candidate view */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-base">
          {applicantsData.map((applicant, i) => (
            <ApplicantItem
              key={applicant.id}
              index={i}
              applicant={applicant}
              jobTitle={jobsData.find((j) => j.id === applicant.jobId)?.title}
              isScreening={
                screenMutation.isPending &&
                screenMutation.variables?.applicantId === applicant.id
              }
              onScreen={(id, jobId) =>
                screenMutation.mutate({ applicantId: id, jobId })
              }
            />
          ))}

          {applicantsData.length === 0 ? (
            <QueryEmptyState
              title="No applicants match the current filters"
              description="Adjust the search or import candidates into one of your active pipelines."
            />
          ) : null}
        </div>
      ) : (
        <ApplicantsTable data={applicantsData} />
      )}

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasMore={pagination.hasMore}
          onPageChange={setPage}
          isLoading={applicantsQuery.isFetching}
        />
      )}
    </div>
  );
}
