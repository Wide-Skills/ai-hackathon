"use client";

import type { Applicant, ApplicationStatus } from "@ai-hackathon/shared";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronRight } from "lucide-react";
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

export const columns: ColumnDef<Applicant>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2 font-bold text-[10px] text-muted-foreground/50 uppercase tracking-widest"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Candidate
          <ArrowUpDown className="h-3 w-3" />
        </button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;
      return (
        <div className="flex items-center gap-4 py-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/10 bg-secondary/50 font-bold text-[11px] text-muted-foreground/60 shadow-ethereal">
            <span className="translate-y-[0.5px]">
              {applicant.firstName[0]}
              {applicant.lastName[0]}
            </span>
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <div className="font-semibold text-foreground leading-tight tracking-tight">
              {applicant.firstName} {applicant.lastName}
            </div>
            <div className="mt-0.5 truncate font-medium text-[11px] text-muted-foreground/50 leading-none">
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
          className="flex items-center gap-2 font-bold text-[10px] text-muted-foreground/50 uppercase tracking-widest"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          AI Score
          <ArrowUpDown className="h-3 w-3" />
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
      <span className="font-bold text-[10px] text-muted-foreground/50 uppercase tracking-widest">
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
            className="border leading-none tracking-[0.12em] shadow-ethereal"
          >
            <span className="translate-y-[0.5px]">{config.label}</span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "appliedAt",
    header: () => (
      <span className="font-bold text-[10px] text-muted-foreground/50 uppercase tracking-widest">
        Applied
      </span>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex h-full items-center py-1 font-medium text-[12px] text-muted-foreground/60">
          {new Date(row.getValue("appliedAt")).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
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
            className="group flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground/20 transition-all group-hover:text-foreground" />
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
    <Card variant="default" className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
