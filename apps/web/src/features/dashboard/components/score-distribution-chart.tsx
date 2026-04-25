"use client";

import type { Applicant } from "@ai-hackathon/shared";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

interface ScoreDistributionChartProps {
  applicants: Applicant[];
}

const buckets = [
  { label: "0-20", min: 0, max: 20 },
  { label: "21-40", min: 21, max: 40 },
  { label: "41-60", min: 41, max: 60 },
  { label: "61-80", min: 61, max: 80 },
  { label: "81-100", min: 81, max: 100 },
];

export function ScoreDistributionChart({
  applicants,
}: ScoreDistributionChartProps) {
  const screened = applicants.filter((a) => a.screening);

  const data = buckets.map((bucket) => ({
    range: bucket.label,
    count: screened.filter((a) => {
      const score = a.screening?.matchScore ?? 0;
      return score >= bucket.min && score <= bucket.max;
    }).length,
  }));
  if (screened.length === 0) {
    return (
      <Empty className="h-full min-h-[300px] border-none bg-transparent">
        <EmptyHeader>
          <EmptyTitle className="font-bold text-[10px] text-muted-foreground/30 uppercase tracking-wider">
            No Distribution Data Available
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="h-full min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barSize={40}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-line)"
          />
          <XAxis
            dataKey="range"
            tick={{
              fontSize: 10,
              fill: "var(--color-ink-faint)",
              fontWeight: 500,
              letterSpacing: "0.06em",
            }}
            axisLine={false}
            tickLine={false}
            dy={15}
          />
          <YAxis
            tick={{
              fontSize: 10,
              fill: "var(--color-ink-faint)",
              fontWeight: 500,
              letterSpacing: "0.06em",
            }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-line)",
              borderRadius: "7px",
              fontSize: "11px",
              fontWeight: 500,
              boxShadow: "none",
              padding: "8px 12px",
              color: "var(--color-ink-full)",
            }}
            cursor={{ fill: "var(--color-bg-alt)", radius: 4 }}
          />
          <Bar
            dataKey="count"
            fill="var(--color-primary)"
            fillOpacity={0.4}
            radius={[2, 2, 0, 0]}
            name="Experts"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
