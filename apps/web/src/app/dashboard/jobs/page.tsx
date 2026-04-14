"use client";

import type { Job, JobStatus } from "@ai-hackathon/shared";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Building,
  Calendar,
  ChevronRight,
  DollarSign,
  Globe,
  MapPin,
  MoveVertical as MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { RootState } from "@/store";
import { setSearchKeyword } from "@/store/slices/jobsSlice";
import { trpc } from "@/utils/trpc";

const statusConfig: Record<
  JobStatus,
  { label: string; color: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  draft: {
    label: "Draft",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
};

const tabs = ["All", "Active", "Draft", "Closed"] as const;

function JobCard({ job }: { job: Job }) {
  const sc = statusConfig[job.status];
  const screenedPct =
    job.applicantsCount > 0
      ? Math.round((job.screenedCount / job.applicantsCount) * 100)
      : 0;

  return (
    <Card className="group border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 transition-colors group-hover:text-blue-600">
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
                <span className="flex items-center gap-1 text-slate-500 text-xs">
                  <Building className="h-3 w-3" />
                  {job.department}
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-xs">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-xs">
                  <Globe className="h-3 w-3" />
                  {job.type}
                </span>
                {job.salaryMin && (
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <DollarSign className="h-3 w-3" />
                    {job.salaryMin.toLocaleString()} –{" "}
                    {job.salaryMax?.toLocaleString()} {job.currency}/mo
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 line-clamp-2 text-slate-500 text-sm leading-relaxed">
          {job.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 text-xs"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-gray-100 border-t pt-4">
          <div className="flex items-center gap-5">
            <div className="text-center">
              <p className="font-bold text-lg text-slate-900">
                {job.applicantsCount}
              </p>
              <p className="text-[10px] text-slate-400">Applied</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-blue-600 text-lg">
                {job.screenedCount}
              </p>
              <p className="text-[10px] text-slate-400">Screened</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-emerald-600 text-lg">
                {job.shortlistedCount}
              </p>
              <p className="text-[10px] text-slate-400">Shortlisted</p>
            </div>
          </div>

          <div className="max-w-32 flex-1">
            <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
              <span>Screened</span>
              <span>{screenedPct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${screenedPct}%` }}
              />
            </div>
          </div>

          <Link href={`/dashboard/applicants?job=${job.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 border-gray-200 font-medium text-xs hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              View Applicants
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {job.closingDate && (
          <div className="mt-3 flex items-center gap-1.5 text-slate-400 text-xs">
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

export default function JobsPage() {
  const dispatch = useDispatch();
  const search = useSelector((state: RootState) => state.jobs.searchKeyword);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");
  const { data: jobs, isLoading } = useQuery(trpc.jobs.list.queryOptions());

  const jobsList = jobs || [];

  const filtered = jobsList.filter((j) => {
    const matchesTab =
      activeTab === "All" || j.status === activeTab.toLowerCase();
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.department ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const counts = {
    All: jobsList.length,
    Active: jobsList.filter((j) => j.status === "active").length,
    Draft: jobsList.filter((j) => j.status === "draft").length,
    Closed: jobsList.filter((j) => j.status === "closed").length,
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-4 py-2 font-medium text-sm transition-all",
                activeTab === tab
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-gray-50 hover:text-slate-700",
              )}
            >
              {tab}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-bold text-[10px]",
                  activeTab === tab
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
              className="h-9 w-52 rounded-lg border-gray-200 bg-white pl-9 text-sm focus-visible:ring-blue-500"
            />
          </div>
          <Button
            size="sm"
            className="h-9 gap-1.5 rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-3.5 w-3.5" />
            New Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-slate-400">
          <Briefcase className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p className="font-medium">No jobs found</p>
          <p className="mt-1 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
