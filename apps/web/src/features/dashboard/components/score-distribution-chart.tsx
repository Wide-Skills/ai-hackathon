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
    
        <div className="h-48 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={32}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)", fontWeight: 500, letterSpacing: "0.05em" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)", fontWeight: 500, letterSpacing: "0.05em" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "16px",
                  fontSize: "11px",
                  fontWeight: 500,
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 4px 4px rgba(0,0,0,0.04), inset 0 0 0 0.5px rgba(0,0,0,0.075)",
                  padding: "10px 14px"
                }}
                cursor={{ fill: "var(--color-secondary)", opacity: 0.4 }}
              />
              <Bar
                dataKey="count"
                fill="var(--color-info)"
                fillOpacity={0.4}
                radius={[6, 6, 0, 0]}
                name="Experts"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
    
  );
}
