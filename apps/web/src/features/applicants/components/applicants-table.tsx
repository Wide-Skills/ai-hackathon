"use client";

import type { Applicant, ApplicationStatus } from "@ai-hackathon/shared";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreBadge } from "@/features/dashboard/components/score-badge";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50"
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
          <div className="h-9 w-9 rounded-xl bg-secondary/50 border border-border/10 flex items-center justify-center text-[11px] font-bold text-muted-foreground/60 shrink-0 shadow-ethereal">
            <span className="translate-y-[0.5px]">{applicant.firstName[0]}{applicant.lastName[0]}</span>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <div className="font-semibold text-foreground tracking-tight leading-tight">{applicant.firstName} {applicant.lastName}</div>
            <div className="text-[11px] text-muted-foreground/50 font-medium truncate mt-0.5 leading-none">{applicant.email}</div>
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
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50"
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
        <div className="flex items-center h-full py-1">
          <ScoreBadge score={score} />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as ApplicationStatus;
      const config = statusConfig[status] || statusConfig.pending;
      return (
        <div className="flex items-center h-full py-1">
          <Badge
            variant={config.variant}
            size="sm"
            uppercase
            className="tracking-[0.12em] border shadow-ethereal leading-none"
          >
            <span className="translate-y-[0.5px]">{config.label}</span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "appliedAt",
    header: () => <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Applied</span>,
    cell: ({ row }) => {
      return (
        <div className="text-[12px] font-medium text-muted-foreground/60 py-1 flex items-center h-full">
          {new Date(row.getValue("appliedAt")).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const applicant = row.original;
      return (
        <div className="flex items-center justify-end py-1 h-full">
          <Link href={`/dashboard/applicants/${applicant.id}` as Route} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-secondary transition-all group">
            <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-foreground transition-all" />
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
                        header.getContext()
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
