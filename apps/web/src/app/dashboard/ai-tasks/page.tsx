"use client";

import {
  RiBrainLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiLoader2Line,
  RiRefreshLine,
  RiTimeLine,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";

export default function AITasksPage() {
  const [page, setPage] = useState(1);
  const logsQuery = useQuery({
    ...trpc.system.listTaskLogs.queryOptions({ page, limit: 20 }),
    refetchInterval: 5000,
  });

  const statsQuery = useQuery(trpc.system.getQueueStats.queryOptions());
  const healthQuery = useQuery({
    ...trpc.healthCheck.queryOptions(),
    refetchInterval: 10000,
  });

  const logs = logsQuery.data?.items ?? [];
  const pagination = logsQuery.data;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <RiCheckLine className="size-3.5 text-status-success-text" />;
      case "error":
        return (
          <RiErrorWarningLine className="size-3.5 text-status-error-text" />
        );
      case "warning":
        return (
          <RiInformationLine className="size-3.5 text-status-warning-text" />
        );
      default:
        return <RiInformationLine className="size-3.5 text-primary/60" />;
    }
  };

  return (
    <div className="w-full space-y-section-padding pb-section-padding">
      <div className="flex items-center justify-between border-line border-b px-small pb-base">
        <div>
          <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
            System Intelligence
          </span>
          <h1 className="font-serif text-[32px] text-primary leading-tight">
            Background AI Processes
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => logsQuery.refetch()}
          disabled={logsQuery.isFetching}
          className="gap-base rounded-standard border-line"
        >
          <RiRefreshLine
            className={cn("size-3.5", logsQuery.isFetching && "animate-spin")}
          />
          Refresh Stream
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-comfortable md:grid-cols-4">
        {[
          {
            label: "Active Jobs",
            val: statsQuery.data?.active ?? 0,
            color: "text-primary",
          },
          {
            label: "Queued",
            val: statsQuery.data?.waiting ?? 0,
            color: "text-ink-muted",
          },
          {
            label: "Completed",
            val: statsQuery.data?.completed ?? 0,
            color: "text-status-success-text",
          },
          {
            label: "Failed",
            val: statsQuery.data?.failed ?? 0,
            color: "text-status-error-text",
          },
        ].map((s, i) => (
          <Card key={i} variant="default" className="p-base shadow-sm">
            <p className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
              {s.label}
            </p>
            <p
              className={cn(
                "mt-1 font-serif text-[28px] leading-none",
                s.color,
              )}
            >
              {s.val}
            </p>
          </Card>
        ))}
      </div>

      {healthQuery.data && (
        <Card
          variant="default"
          className="overflow-hidden border-line shadow-none"
          size="none"
        >
          <CardHeader className="border-line border-b bg-primary-alpha/5 py-base">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-base">
                <div>
                  <CardDescription className="text-[10px] uppercase tracking-wider">
                    Infrastructure
                  </CardDescription>
                  <CardTitle className="text-[18px]">
                    Backend Vital Signs
                  </CardTitle>
                </div>
              </div>
              <Badge
                variant="outline"
                size="sm"
                className="font-mono text-[9px]"
              >
                UPTIME: {Math.floor(healthQuery.data.uptime / 3600)}h{" "}
                {Math.floor((healthQuery.data.uptime % 3600) / 60)}m
              </Badge>
            </div>
          </CardHeader>
          <div className="grid grid-cols-1 divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="p-base">
              <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                Database
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-serif text-[18px] text-primary">
                  MongoDB
                </span>
                <Badge
                  variant={
                    healthQuery.data.database.connected
                      ? "success"
                      : "destructive"
                  }
                  size="xs"
                >
                  {healthQuery.data.database.status}
                </Badge>
              </div>
            </div>
            <div className="p-base">
              <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                Queue System
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-serif text-[18px] text-primary">
                  BullMQ (Redis)
                </span>
                <span className="font-mono text-[10px] text-ink-muted">
                  {healthQuery.data.queues.status}
                </span>
              </div>
            </div>
            <div className="p-base">
              <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                System Load
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-serif text-[18px] text-primary">
                  RSS Memory
                </span>
                <span className="font-mono text-[10px] text-ink-muted">
                  {Math.round(
                    (healthQuery.data.system.memory as any).rss / 1024 / 1024,
                  )}
                  MB
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card
        variant="default"
        className="w-full overflow-hidden border-line shadow-none"
        size="none"
      >
        <CardHeader className="border-line border-b bg-bg-alt/5 py-base">
          <div>
            <CardDescription>Real-time Reasoning</CardDescription>
            <CardTitle className="text-[18px]">Task Execution Logs</CardTitle>
          </div>
        </CardHeader>
        <div className="divide-y divide-line overflow-hidden">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                className="group grid grid-cols-[24px_minmax(0,1fr)] items-start gap-comfortable overflow-hidden px-comfortable py-base transition-colors hover:bg-bg-alt/5"
              >
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bg2">
                  {getStatusIcon(log.status)}
                </div>
                <div className="space-y-1 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-base">
                    <span className="shrink-0 font-mono text-[10px] text-ink-faint">
                      {log.taskId.split("-")[0]}...
                    </span>
                    <Badge
                      variant="secondary"
                      size="xs"
                      className="font-mono text-[9px] uppercase tracking-tighter"
                    >
                      {log.type}
                    </Badge>
                    <span className="shrink-0 font-medium font-sans text-[11px] text-primary uppercase tracking-widest">
                      {log.step}
                    </span>
                    <div className="flex shrink-0 items-center gap-1 text-[10px] text-ink-faint">
                      <RiTimeLine className="size-3" />
                      {log.createdAt
                        ? formatDistanceToNow(new Date(log.createdAt), {
                            addSuffix: true,
                          })
                        : "just now"}
                    </div>
                  </div>
                  <p className="break-words font-sans text-[13px] text-primary leading-snug">
                    {log.message}
                  </p>
                  {log.details && (
                    <div className="mt-2 w-full overflow-hidden rounded-micro bg-bg-deep">
                      <pre className="max-w-full overflow-x-auto p-2 font-mono text-[10px] text-ink-muted">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <RiLoader2Line className="mb-4 size-8 animate-spin text-ink-faint/30" />
              <p className="font-medium font-sans text-[12px] text-ink-faint uppercase tracking-wider">
                Awaiting background tasks...
              </p>
            </div>
          )}
        </div>
      </Card>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasMore={pagination.hasMore}
          onPageChange={setPage}
          isLoading={logsQuery.isFetching}
        />
      )}
    </div>
  );
}
