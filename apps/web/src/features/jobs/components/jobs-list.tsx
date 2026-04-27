"use client";

import { RiLayoutGridLine, RiListCheck, RiSearch2Line } from "@remixicon/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  QueryEmptyState,
  QueryErrorState,
} from "@/components/data/query-state";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { useAppDispatch, useAppSelector } from "@/store";
import { setJobsViewMode } from "@/store/slices/uiSlice";
import { trpc } from "@/utils/trpc";
import { JobCard } from "./job-card";
import { JobsTable } from "./jobs-table";

export function JobsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // State
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") ?? "active",
  );

  const view = useAppSelector((state) => state.ui.jobsViewMode);
  const setView = (mode: "grid" | "table") => dispatch(setJobsViewMode(mode));

  const [page, setPage] = useState(
    Number.parseInt(searchParams.get("page") ?? "1", 10),
  );
  const [limit] = useState(10);

  // Sync state to URL
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
    updateParam("status", statusFilter, "active");
    updateParam("page", page > 1 ? page.toString() : undefined);

    if (changed) {
      router.replace(`${pathname}?${params.toString()}` as Route, {
        scroll: false,
      });
    }
  }, [debouncedSearch, statusFilter, page, router, pathname]);

  const jobsQuery = useQuery({
    ...trpc.jobs.list.queryOptions({
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    }),
    placeholderData: keepPreviousData,
  });

  const jobsData = jobsQuery.data?.items ?? [];
  const pagination = jobsQuery.data;

  const isLoading = jobsQuery.isPending && !jobsQuery.data;

  if (isLoading) {
    return (
      <div className="w-full animate-pulse space-y-12">
        <div className="h-10 w-full rounded-standard bg-bg2" />
        <div className="space-y-base">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-standard bg-bg2" />
          ))}
        </div>
      </div>
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
      <div className="flex flex-col gap-base border-line border-b pb-section-gap lg:flex-row lg:items-center">
        <div className="relative w-full lg:flex-1">
          <div className="group flex h-10 items-center gap-3 rounded-standard border border-line bg-bg2/40 px-3.5 transition-all focus-within:border-primary/20 focus-within:bg-surface">
            <RiSearch2Line className="size-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search active jobs..."
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
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val || "all")}
          >
            <SelectTrigger className="h-10 w-full rounded-standard border-line bg-bg2/40 font-medium font-sans text-[11px] text-ink-muted uppercase tracking-[0.06em] shadow-none sm:w-44">
              <SelectValue placeholder="State">
                {statusFilter === "all"
                  ? "All States"
                  : statusFilter === "active"
                    ? "Active"
                    : statusFilter === "draft"
                      ? "Drafts"
                      : "Closed"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border-line bg-surface shadow-none">
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-full sm:w-auto">
            <Button
              className="h-10 w-full px-6 font-medium font-sans text-[13px]"
              render={<Link href="/dashboard/jobs/new" />}
            >
              New Job
            </Button>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-small flex items-center justify-between px-comfortable">
          <div className="flex items-center gap-base font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
            Active Jobs
          </div>
          <div className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
            {pagination?.totalCount ?? 0} positions open
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 gap-comfortable">
            {jobsData.length > 0 ? (
              jobsData.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))
            ) : (
              <QueryEmptyState
                title="No jobs match the current filters"
                description="Adjust the search or create a new job."
              />
            )}
          </div>
        ) : (
          <JobsTable data={jobsData} />
        )}

        {pagination && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasMore={pagination.hasMore}
              onPageChange={setPage}
              isLoading={jobsQuery.isFetching}
            />
          </div>
        )}
      </section>
    </div>
  );
}
