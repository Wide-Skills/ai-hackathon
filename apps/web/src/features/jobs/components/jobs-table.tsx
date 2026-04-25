"use client";

import type { Job, JobStatus } from "@ai-hackathon/shared";
import { RiArrowRightSLine, RiArrowUpDownLine, RiLink } from "@remixicon/react";
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
import { toast } from "sonner";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  JobStatus,
  { label: string; variant: "success" | "warning" | "secondary" }
> = {
  active: {
    label: "Active",
    variant: "success",
  },
  draft: {
    label: "Draft",
    variant: "warning",
  },
  closed: {
    label: "Closed",
    variant: "secondary",
  },
};

interface JobsTableProps {
  data: Job[];
}

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-small font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em] transition-colors hover:text-primary"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pipeline <RiArrowUpDownLine className="size-3 opacity-30" />
        </button>
      );
    },
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="flex flex-col justify-center py-1">
          <div className="font-serif text-[15px] text-primary leading-tight tracking-tight">
            {job.title}
          </div>
          <div className="mt-0.5 font-light font-sans text-[11px] text-ink-muted uppercase tracking-wider">
            {job.department} · {job.location}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "applicantsCount",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-small font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em] transition-colors hover:text-primary"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Applicants <RiArrowUpDownLine className="size-3 opacity-30" />
        </button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-serif text-[18px] text-primary">
          {row.original.applicantsCount}
        </div>
      );
    },
  },
  {
    accessorKey: "screenedCount",
    header: () => (
      <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
        AI Coverage
      </span>
    ),
    cell: ({ row }) => {
      const job = row.original;
      const pct =
        job.applicantsCount > 0
          ? Math.round((job.screenedCount / job.applicantsCount) * 100)
          : 0;
      return (
        <div className="flex w-24 flex-col gap-1.5">
          <div className="flex items-center justify-between font-medium font-sans text-[10px] text-primary/60">
            <span>{pct}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-pill border border-line/30 bg-bg-deep">
            <div
              className={cn(
                "h-full transition-all",
                pct > 80 ? "bg-status-success-text" : "bg-primary/40",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
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
      const status = row.getValue("status") as JobStatus;
      const config = statusConfig[status];
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
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;
      const copyToClipboard = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/jobs/${job.id}`;
        navigator.clipboard.writeText(url);
        toast.success("Public link copied!");
      };

      return (
        <div className="flex h-full items-center justify-end gap-base py-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    onClick={copyToClipboard}
                    className="flex h-8 w-8 items-center justify-center rounded-micro border border-line bg-surface text-ink-faint transition-all hover:border-line-medium hover:text-primary active:scale-95"
                  >
                    <RiLink className="size-3.5" />
                  </button>
                }
              />
              <TooltipContent className="rounded-standard border-line bg-surface px-3 py-1 font-medium font-sans text-[11px] text-primary">
                Copy Link
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link
            href={`/dashboard/jobs/${job.id}` as Route}
            className="group flex h-8 w-8 items-center justify-center rounded-micro border border-line bg-surface text-ink-faint transition-all hover:border-line-medium hover:text-primary active:scale-95"
          >
            <RiArrowRightSLine className="size-4 opacity-40 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>
      );
    },
  },
];

export function JobsTable({ data }: JobsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "applicantsCount", desc: true },
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
                No jobs match the current filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </Card>
  );
}
