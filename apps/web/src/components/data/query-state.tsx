"use client";

import { RiErrorWarningLine, RiInboxLine } from "@remixicon/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getErrorMessage } from "@/utils/trpc";

interface QueryErrorStateProps {
  error: unknown;
  title?: string;
  retryLabel?: string;
  onRetry?: () => unknown;
}

export function QueryErrorState({
  error,
  title = "We couldn't load this data",
  retryLabel = "Retry",
  onRetry,
}: QueryErrorStateProps) {
  return (
    <Alert
      variant="destructive"
      className="rounded-xl border-destructive/20 p-5"
    >
      <RiErrorWarningLine className="mt-0.5 size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{getErrorMessage(error)}</AlertDescription>
      {onRetry ? (
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => void onRetry()}
          >
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </Alert>
  );
}

interface QueryEmptyStateProps {
  title: string;
  description: string;
}

export function QueryEmptyState({ title, description }: QueryEmptyStateProps) {
  return (
    <Empty className="rounded-card border-line bg-bg2/40 py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiInboxLine className="size-4" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent />
    </Empty>
  );
}
