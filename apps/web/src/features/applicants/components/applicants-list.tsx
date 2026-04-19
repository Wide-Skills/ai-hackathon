"use client";

import type { ApplicationStatus } from "@ai-hackathon/shared";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Briefcase,
  Clock,
  Cpu,
  ExternalLink,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { MatchScore } from "./match-score";
import { UploadCandidatesDialog } from "./upload-candidates-dialog";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    color: "bg-muted text-muted-foreground border-border",
    icon: Clock,
  },
  screening: {
    label: "Screening",
    color: "bg-primary/10 text-primary border-primary/20",
    icon: Cpu,
  },
  shortlisted: {
    label: "Shortlisted",
    color: "bg-success/10 text-success border-success/20",
    icon: Users,
  },
  rejected: {
    label: "Rejected",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    icon: Users,
  },
  hired: {
    label: "Hired",
    color: "bg-warning/10 text-warning border-warning/20",
    icon: Users,
  },
};

type SortField = "score" | "name" | "applied" | "status";
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
  const { data: applicantsData = [] } = useQuery(
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
      } else if (sortField === "status") {
        cmp = a.status.localeCompare(b.status);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/70" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider transition-colors hover:text-primary"
    >
      {children}
      <SortIcon field={field} />
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-lg border-border pl-9 text-sm focus-visible:ring-primary"
          />
        </div>

        <Select
          value={jobFilter}
          onValueChange={(value) => setJobFilter(value ?? "all")}
        >
          <SelectTrigger className="h-9 w-52 rounded-lg border-border text-sm">
            <Briefcase className="mr-1 h-3.5 w-3.5 text-muted-foreground/70" />
            <SelectValue placeholder="All Jobs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobsData.map((j) => (
              <SelectItem key={j.id} value={j.id}>
                {j.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            if (value === null) {
              setStatusFilter("all");
              return;
            }

            if (isStatusFilter(value)) {
              setStatusFilter(value);
            }
          }}
        >
          <SelectTrigger className="h-9 w-40 rounded-lg border-border text-sm">
            <SlidersHorizontal className="mr-1 h-3.5 w-3.5 text-muted-foreground/70" />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="screening">Screening</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <UploadCandidatesDialog />

        <div className="ml-auto font-medium text-muted-foreground text-sm">
          {filtered.length} candidate{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-border/50 border-b bg-muted/25">
                <th className="px-5 py-3.5 text-left">
                  <SortButton field="name">Candidate</SortButton>
                </th>
                <th className="hidden px-4 py-3.5 text-left md:table-cell">
                  <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Position
                  </span>
                </th>
                <th className="hidden px-4 py-3.5 text-left lg:table-cell">
                  <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Location
                  </span>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <SortButton field="score">AI Score</SortButton>
                </th>
                <th className="px-4 py-3.5 text-left">
                  <SortButton field="status">Status</SortButton>
                </th>
                <th className="hidden px-4 py-3.5 text-left sm:table-cell">
                  <SortButton field="applied">Applied</SortButton>
                </th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((applicant) => {
                const sc = statusConfig[applicant.status];
                const StatusIcon = sc.icon;
                const job = jobsData.find((j) => j.id === applicant.jobId);
                return (
                  <tr
                    key={applicant.id}
                    className="group transition-colors hover:bg-primary/10/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {applicant.avatarUrl ? (
                          <img
                            src={applicant.avatarUrl}
                            alt=""
                            className="h-9 w-9 flex-shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white"
                          />
                        ) : (
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary font-bold text-sm text-white">
                            {applicant.firstName[0]}
                            {applicant.lastName[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-sm">
                            {applicant.firstName} {applicant.lastName}
                          </p>
                          <p className="max-w-[180px] truncate text-muted-foreground/70 text-xs">
                            {applicant.headline}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell">
                      <p className="font-medium text-foreground/80 text-sm">
                        {job?.title}
                      </p>
                      <p className="text-muted-foreground/70 text-xs">
                        {job?.department}
                      </p>
                    </td>
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        {applicant.location}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {applicant.screening ? (
                        <MatchScore score={applicant.screening.matchScore} />
                      ) : (
                        <span className="flex items-center gap-1.5 text-muted-foreground/70 text-xs">
                          <Cpu className="h-3.5 w-3.5 animate-pulse" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-medium text-xs",
                          sc.color,
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell">
                      <span className="text-muted-foreground text-sm">
                        {new Date(applicant.appliedAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/applicants/${applicant.id}` as Route}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg p-0 opacity-0 transition-all hover:bg-primary/10 hover:text-primary group-hover:opacity-100"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground/70">
            <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p className="font-medium">No candidates found</p>
            <p className="mt-1 text-sm">Adjust your filters to see results</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-1 text-muted-foreground text-sm">
        <p>
          Showing{" "}
          <span className="font-semibold text-foreground/80">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground/80">
            {applicantsData.length}
          </span>{" "}
          candidates
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-border text-xs"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-border border-primary/20 bg-primary/10 text-primary text-xs"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-border text-xs"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
