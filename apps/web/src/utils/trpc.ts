import type { AppRouter } from "@ai-hackathon/api/routers/index";

import { env } from "@ai-hackathon/env/web";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  type QueryClient as QueryClientType,
} from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, TRPCClientError } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { toast } from "sonner";

function isTrpcClientError(
  error: unknown,
): error is TRPCClientError<AppRouter> {
  return error instanceof TRPCClientError;
}

function isNonRetryableError(error: unknown) {
  if (!isTrpcClientError(error)) {
    return false;
  }

  return ["UNAUTHORIZED", "BAD_REQUEST", "NOT_FOUND"].includes(
    error.data?.code ?? "",
  );
}

export function getErrorMessage(error: unknown) {
  if (isTrpcClientError(error) && error.data?.code === "UNAUTHORIZED") {
    return "Your session is no longer valid. Sign in again and retry.";
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Something went wrong while talking to the server.";
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (isNonRetryableError(error)) {
          return false;
        }

        return failureCount < 2;
      },
    },
    mutations: {
      retry(failureCount, error) {
        if (isNonRetryableError(error)) {
          return false;
        }

        return failureCount < 1;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) {
        return;
      }

      toast.error(getErrorMessage(error), {
        action: {
          label: "Retry",
          onClick: () =>
            queryClient.invalidateQueries({
              queryKey: query.queryKey,
              exact: true,
            }),
        },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.onError) {
        return;
      }

      toast.error(getErrorMessage(error));
    },
  }),
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

export async function invalidateHiringData(queryClient: QueryClientType) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: trpc.jobs.list.queryKey() }),
    queryClient.invalidateQueries({ queryKey: trpc.jobs.stats.queryKey() }),
    queryClient.invalidateQueries({
      queryKey: trpc.applicants.list.queryKey(),
    }),
    queryClient.invalidateQueries({
      queryKey: trpc.screenings.list.queryKey(),
    }),
  ]);
}
