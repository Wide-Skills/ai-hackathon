"use client";

import type { Applicant, ApplicationStatus } from "@ai-hackathon/shared";
import {
  RiAlertLine,
  RiArrowUpDownLine,
  RiBrainLine,
  RiCheckDoubleLine,
  RiCloseCircleLine,
  RiDeleteBin7Line,
  RiLoader2Line,
  RiMore2Line,
  RiRefreshLine,
  RiSearch2Line,
  RiSparklingLine,
  RiTimeLine,
  RiUser3Line,
  RiVerifiedBadgeLine,
} from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "motion/react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScoreBadge } from "@/features/dashboard/components/score-badge";
import { invalidateHiringData, trpc, trpcClient } from "@/utils/trpc";

interface ApplicantsTableProps {
  data: Applicant[];
}

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

function RowActions({ applicant }: { applicant: Applicant }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const deleteMutation = useMutation(
    trpc.applicants.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Applicant deleted successfully");
        void invalidateHiringData(queryClient);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete applicant");
      },
    }),
  );

  const generateMutation = useMutation(
    trpc.screenings.generate.mutationOptions({
      onSuccess: () => {
        toast.success("AI Screening completed");
        void invalidateHiringData(queryClient);
      },
      onError: (error) => {
        toast.error(error.message || "Screening failed");
      },
    }),
  );

  const updateStatusMutation = useMutation(
    trpc.applicants.update.mutationOptions({
      onSuccess: () => {
        toast.success("Status updated");
        void invalidateHiringData(queryClient);
      },
    }),
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon-xs"
              className="rounded-micro border-line text-ink-faint shadow-none hover:border-line-medium hover:text-primary active:scale-95"
              onClick={(e) => e.stopPropagation()}
            />
          }
        >
          <RiMore2Line className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 outline-none">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Management</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/applicants/${applicant.id}` as Route);
              }}
            >
              <RiUser3Line className="mr-base size-3.5" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={generateMutation.isPending}
              onClick={(e) => {
                e.stopPropagation();
                generateMutation.mutate({
                  applicantId: applicant.id,
                  jobId: applicant.jobId,
                });
              }}
            >
              <RiBrainLine className="mr-base size-3.5" />
              {generateMutation.isPending ? "Analyzing..." : "Run AI Analysis"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <RiRefreshLine className="mr-base size-3.5" />
                Change Status
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40 outline-none">
                {(
                  [
                    { status: "pending", icon: RiTimeLine },
                    { status: "screening", icon: RiSearch2Line },
                    { status: "shortlisted", icon: RiCheckDoubleLine },
                    { status: "rejected", icon: RiCloseCircleLine },
                    { status: "hired", icon: RiVerifiedBadgeLine },
                  ] as const
                ).map(({ status, icon: StatusIcon }) => (
                  <DropdownMenuItem
                    key={status}
                    className="capitalize"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatusMutation.mutate({
                        id: applicant.id,
                        data: { status },
                      });
                    }}
                  >
                    <StatusIcon className="mr-base size-3.5" />
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                setIsAlertOpen(true);
              }}
            >
              <RiDeleteBin7Line className="mr-base size-3.5" />
              Delete Candidate
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this applicant? This will
              permanently remove their profile and all associated screening
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                deleteMutation.mutate({ id: applicant.id });
                setIsAlertOpen(false);
              }}
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const columns: ColumnDef<Applicant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      const isOutdated = row.original.screening?.isOutdated;
      return (
        <div className="flex h-full items-center gap-base py-1">
          <ScoreBadge score={score} />
          {isOutdated && (
            <Badge
              variant="warning"
              size="sm"
              className="h-5 px-1 font-mono text-[9px] uppercase"
            >
              <RiAlertLine className="mr-0.5 size-2.5" />
              Outdated
            </Badge>
          )}
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
      const appliedAt = row.getValue("appliedAt");
      const date = appliedAt ? new Date(appliedAt as string | number | Date) : null;
      const isValidDate = date && !isNaN(date.getTime());

      return (
        <div className="flex h-full items-center py-1 font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
          {isValidDate
            ? date.toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
        Management
      </span>
    ),
    cell: ({ row }) => <RowActions applicant={row.original} />,
  },
];

export function ApplicantsTable({ data }: ApplicantsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "screening_matchScore", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const queryClient = useQueryClient();

  const batchScreenMutation = useMutation(
    trpc.screenings.batchGenerate.mutationOptions(),
  );

  const handleBatchScreen = async () => {
    const applicantIds = selectedRows.map((r) => r.original.id);
    const jobId = selectedRows[0]?.original.jobId;
    if (!jobId || applicantIds.length === 0) return;

    setIsBatchRunning(true);
    setBatchProgress(0);

    try {
      const { batchJobId } = await batchScreenMutation.mutateAsync({
        jobId,
        applicantIds,
      });

      let done = false;
      let totalCompleted = 0;
      let totalFailed = 0;

      while (!done) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
          const state = await trpcClient.screenings.getBatchProgress.query({
            batchJobId,
          });

          const currentProgress = Math.round(
            ((state.completed + state.failed) / applicantIds.length) * 100,
          );
          setBatchProgress(currentProgress);

          if (state.status === "completed" || state.status === "failed") {
            totalCompleted = state.completed;
            totalFailed = state.failed;
            done = true;
          }
        } catch (e) {
          console.error("Polling failed", e);
        }
      }
      await invalidateHiringData(queryClient);
      setRowSelection({});

      if (totalFailed > 0) {
        toast.warning(
          `Batch screening finished: ${totalCompleted} succeeded, ${totalFailed} failed.`,
        );
      } else {
        toast.success(
          `Batch screening complete: ${totalCompleted} candidates analyzed.`,
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Batch screening failed");
    } finally {
      setIsBatchRunning(false);
      setBatchProgress(0);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  return (
    <div className="space-y-base">
      <AnimatePresence mode="popLayout">
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
            className="sticky top-4 z-30 flex items-center justify-between rounded-xl border border-primary/20 bg-surface/80 px-comfortable py-3 shadow-primary/5 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-comfortable">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-bold font-mono text-[10px] text-white">
                {selectedCount}
              </div>
              <span className="font-medium font-sans text-[13px] text-primary tracking-tight">
                Candidates selected for bulk action
              </span>
            </div>
            <Button
              size="sm"
              disabled={isBatchRunning}
              onClick={handleBatchScreen}
              className="h-9 gap-base rounded-standard bg-primary px-6 font-medium font-sans text-[12px] text-white shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] active:scale-[0.97]"
            >
              {isBatchRunning ? (
                <>
                  <RiLoader2Line className="mr-1 size-3.5 animate-spin" />
                  {batchProgress > 0 ? `${batchProgress}%` : "Analyzing..."}
                </>
              ) : (
                <>
                  <RiSparklingLine className="size-4" />
                  Run AI Screening
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
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
                    className="group cursor-pointer border-line transition-colors hover:bg-bg-alt/10"
                    onClick={() =>
                      router.push(
                        `/dashboard/applicants/${row.original.id}` as Route,
                      )
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="h-16 px-base">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
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
    </div>
  );
}
