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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="border-border shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
      <CardHeader className="pb-2">
        <CardTitle className="font-semibold text-[13px] uppercase tracking-wider text-foreground/70">
          Match Distribution
        </CardTitle>
        <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold opacity-60">
          Neural match scores across candidate pool
        </p>
      </CardHeader>
      <CardContent>
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
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)", fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)", fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  padding: "10px 14px"
                }}
                cursor={{ fill: "var(--color-secondary)", opacity: 0.4 }}
              />
              <Bar
                dataKey="count"
                fill="var(--color-info)"
                fillOpacity={0.6}
                radius={[4, 4, 0, 0]}
                name="Experts"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
