"use client";

import type { Applicant, ApplicationStatus } from "@ai-hackathon/shared";
import { RiArrowRightSLine, RiArrowUpDownLine } from "@remixicon/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreBadge } from "@/features/dashboard/components/score-badge";

interface ApplicantsTableProps {
  data: Applicant[];
}
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

export const columns: ColumnDef<Applicant>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-small font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em] transition-colors hover:text-primary"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Candidate <RiArrowUpDownLine className="size-3 opacity-30" />
        </button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;
      return (
        <div className="flex items-center gap-base py-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-micro border border-line bg-bg2 font-medium font-sans text-[11px] text-ink-faint shadow-none">
            <span className="translate-y-[0.5px]">
              {applicant.firstName[0]}
              {applicant.lastName[0]}
            </span>
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <div className="font-serif text-[15px] text-primary leading-tight tracking-tight">
              {applicant.firstName} {applicant.lastName}
            </div>
            <div className="mt-0.5 truncate font-light font-sans text-[11px] text-ink-muted leading-none">
              {applicant.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "screening.matchScore",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-small font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em] transition-colors hover:text-primary"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          AI Match <RiArrowUpDownLine className="size-3 opacity-30" />
        </button>
      );
    },
    cell: ({ row }) => {
      const score = row.original.screening?.matchScore ?? 0;
      return (
        <div className="flex h-full items-center py-1">
          <ScoreBadge score={score} />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
        Status
      </span>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as ApplicationStatus;
      const config = statusConfig[status] || statusConfig.pending;
      return (
        <div className="flex h-full items-center py-1">
          <Badge
            variant={config.variant}
            size="sm"
            uppercase
            className="border-line shadow-none"
          >
            {config.label}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "appliedAt",
    header: () => (
      <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
        Applied
      </span>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex h-full items-center py-1 font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
          {new Date(row.getValue("appliedAt")).toLocaleDateString([], {
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const applicant = row.original;
      return (
        <div className="flex h-full items-center justify-end py-1">
          <Link
            href={`/dashboard/applicants/${applicant.id}` as Route}
            className="group flex h-8 w-8 items-center justify-center rounded-micro border border-line bg-surface text-ink-faint transition-all hover:border-line-medium hover:text-primary active:scale-95"
          >
            <RiArrowRightSLine className="size-4 opacity-40 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>
      );
    },
  },
];

export function ApplicantsTable({ data }: ApplicantsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "screening_matchScore", desc: true },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Card
      variant="default"
      className="overflow-hidden border-line shadow-none"
      size="none"
    >
      <div className="overflow-x-auto">
        <Table className="min-w-[800px] md:min-w-full">
          <TableHeader className="bg-bg-alt/20">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-line hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="h-10 px-base">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="group border-line transition-colors hover:bg-bg-alt/10"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="h-16 px-base">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center font-light font-sans text-[13px] text-ink-faint"
              >
                No candidates match the current filter range.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </Card>
  );
}
