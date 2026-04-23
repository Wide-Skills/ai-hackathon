"use client";

import type { Applicant } from "@ai-hackathon/shared";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScreeningTrendChartProps {
  applicants: Applicant[];
}

export function ScreeningTrendChart({ applicants }: ScreeningTrendChartProps) {
  const screened = applicants.filter((a) => a.screening);

  const grouped = screened.reduce(
    (acc, a) => {
      const date = new Date(a.appliedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const data = Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);

  return (
    <Card className="border-border shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
      <CardHeader className="pb-2">
        <CardTitle className="font-semibold text-[13px] uppercase tracking-wider text-foreground/70">
          Neural Velocity
        </CardTitle>
        <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold opacity-60">
          Throughput over last 7 active cycles
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-48 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="date"
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
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-primary)"
                fillOpacity={1}
                fill="url(#colorCount)"
                strokeWidth={1.5}
                name="Experts"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
