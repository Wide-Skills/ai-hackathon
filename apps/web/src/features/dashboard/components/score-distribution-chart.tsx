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
            stroke="rgba(0,0,0,0.03)"
          />
          <XAxis
            dataKey="range"
            tick={{
              fontSize: 10,
              fill: "var(--color-muted-foreground)",
              fontWeight: 600,
              letterSpacing: "0.05em",
              opacity: 0.5,
            }}
            axisLine={false}
            tickLine={false}
            dy={15}
          />
          <YAxis
            tick={{
              fontSize: 10,
              fill: "var(--color-muted-foreground)",
              fontWeight: 600,
              letterSpacing: "0.05em",
              opacity: 0.5,
            }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.05)",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 700,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              padding: "8px 12px",
            }}
            cursor={{ fill: "rgba(0,0,0,0.02)", radius: 6 }}
          />
          <Bar
            dataKey="count"
            fill="var(--color-info)"
            fillOpacity={0.5}
            radius={[4, 4, 0, 0]}
            name="Candidates"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
