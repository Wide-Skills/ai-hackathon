"use client";

import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiUserFollowLine,
} from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScoreBadge } from "@/features/dashboard/components/score-badge";
import { trpc } from "@/utils/trpc";

interface CandidateComparisonProps {
  jobId: string;
  applicantIds: string[];
}

export function CandidateComparison({
  jobId,
  applicantIds,
}: CandidateComparisonProps) {
  const comparisonQuery = useQuery({
    ...trpc.jobs.compareApplicants.queryOptions({ jobId, applicantIds }),
    enabled: applicantIds.length > 0,
  });

  if (applicantIds.length === 0) return null;

  if (comparisonQuery.isLoading) {
    return <div className="h-64 animate-pulse rounded-card bg-bg2" />;
  }

  const data = comparisonQuery.data;
  if (!data || data.length === 0) return null;

  return (
    <Card
      variant="default"
      className="overflow-hidden border-line shadow-none transition-all hover:border-line-medium"
      size="none"
    >
      <CardHeader className="border-line border-b bg-bg-alt/5 px-comfortable py-base">
        <div className="flex items-center gap-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-micro bg-primary/10">
            <RiUserFollowLine className="size-4 text-primary" />
          </div>
          <div>
            <CardDescription className="text-[10px] uppercase tracking-wider">
              Talent Benchmarking
            </CardDescription>
            <CardTitle className="text-[18px]">Candidate Comparison</CardTitle>
          </div>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-line border-b bg-bg-alt/20">
              <th className="p-base text-left font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                Candidate
              </th>
              <th className="p-base text-center font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                AI Fit
              </th>
              <th className="p-base text-left font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                Strategic Strengths
              </th>
              <th className="p-base text-left font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                Critical Gaps
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr
                key={c.id}
                className="group border-line border-b transition-colors last:border-0 hover:bg-bg-alt/5"
              >
                <td className="p-base">
                  <div className="font-serif text-[17px] text-primary transition-colors group-hover:text-primary-muted">
                    {c.name}
                  </div>
                  <div className="mt-1 font-medium font-sans text-[9px] text-ink-faint uppercase tracking-tighter">
                    {c.recommendation}
                  </div>
                </td>
                <td className="p-base text-center">
                  <div className="flex justify-center transition-transform group-hover:scale-105">
                    <ScoreBadge score={c.matchScore} />
                  </div>
                </td>
                <td className="p-base">
                  <ul className="space-y-1.5">
                    {c.strengths.slice(0, 2).map((s: string) => (
                      <li
                        key={s}
                        className="flex items-start gap-small font-sans text-[12px] text-ink-muted leading-tight"
                      >
                        <RiCheckboxCircleLine className="mt-0.5 size-3 shrink-0 text-status-success-text" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-base">
                  <ul className="space-y-1.5">
                    {c.gaps.slice(0, 2).map((g: string) => (
                      <li
                        key={g}
                        className="flex items-start gap-small font-sans text-[12px] text-ink-muted leading-tight"
                      >
                        <RiCloseCircleLine className="mt-0.5 size-3 shrink-0 text-status-error-text" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
