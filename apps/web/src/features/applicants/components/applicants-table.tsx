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

interface ApplicantsTableProps {
  data: Applicant[];
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "Pending",
    color: "text-muted-foreground bg-secondary",
  },
  screening: {
    label: "Screening",
    color: "text-info-foreground bg-info/10",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "text-success-foreground bg-success/10",
  },
  rejected: {
    label: "Rejected",
    color: "text-destructive-foreground bg-destructive/10",
  },
  hired: {
    label: "Hired",
    color: "text-info-foreground bg-info/10",
  },
};

export const columns: ColumnDef<Applicant>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Candidate
          <ArrowUpDown className="h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-bold">
            {applicant.firstName[0]}{applicant.lastName[0]}
          </div>
          <div>
            <div className="font-medium">{applicant.firstName} {applicant.lastName}</div>
            <div className="text-[11px] text-muted-foreground">{applicant.email}</div>
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
          className="flex items-center gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          AI Score
          <ArrowUpDown className="h-4 w-4" />
        </button>
      );
    },
    cell: ({ row }) => {
      const score = row.original.screening?.matchScore ?? 0;
      return <ScoreBadge score={score} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ApplicationStatus;
      const config = statusConfig[status];
      return (
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
          config.color
        )}>
          {config.label}
        </span>
      );
    },
  },
  {
    accessorKey: "appliedAt",
    header: "Applied",
    cell: ({ row }) => {
      return new Date(row.getValue("appliedAt")).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const applicant = row.original;
      return (
        <Link href={`/dashboard/applicants/${applicant.id}` as Route}>
          <ChevronRight className="h-4 w-4 text-muted-foreground/30 hover:text-foreground transition-colors" />
        </Link>
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
    <div className="rounded-lg border bg-card">
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
    </div>
  );
}
