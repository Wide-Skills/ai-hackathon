"use client";

import type { Applicant } from "@ai-hackathon/shared";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface InteractivePerformanceChartProps {
  applicants: Applicant[];
}

const chartConfig = {
  applicants: {
    label: "Applied",
  },
  appliedCount: {
    label: "Candidates",
    color: "var(--color-info)",
  },
  screenedCount: {
    label: "Screened",
    color: "var(--color-success)",
  },
} satisfies ChartConfig;

export function InteractivePerformanceChart({
  applicants,
}: InteractivePerformanceChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("appliedCount");

  const chartData = React.useMemo(() => {
    const dailyData: Record<
      string,
      { date: string; appliedCount: number; screenedCount: number }
    > = {};

    // Last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyData[dateStr] = { date: dateStr, appliedCount: 0, screenedCount: 0 };
    }

    applicants.forEach((a) => {
      if (!a.appliedAt) return;
      const appliedDate = new Date(a.appliedAt).toISOString().split("T")[0];
      if (dailyData[appliedDate]) {
        dailyData[appliedDate].appliedCount++;
        if (a.screening) {
          dailyData[appliedDate].screenedCount++;
        }
      }
    });

    return Object.values(dailyData);
  }, [applicants]);

  const total = React.useMemo(
    () => ({
      appliedCount: chartData.reduce((acc, curr) => acc + curr.appliedCount, 0),
      screenedCount: chartData.reduce(
        (acc, curr) => acc + curr.screenedCount,
        0,
      ),
    }),
    [chartData],
  );

  return (
    <Card className="border-none bg-transparent py-0 shadow-none">
      <CardHeader className="flex flex-col items-stretch border-line border-b bg-transparent p-0 sm:flex-row">
          <CardDescription className="text-ink-faint">Velocity</CardDescription>
          <CardTitle className="font-serif text-[18px] text-primary leading-tight sm:text-[20px]">
            Screening Activity
          </CardTitle>
        <div className="flex border-line border-l">
          {["appliedCount", "screenedCount"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-micro border-line border-t px-4 py-3 text-left transition-all even:border-l data-[active=true]:bg-bg2 sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                  {chartConfig[chart].label}
                </span>
                <span className="font-serif text-[20px] text-primary leading-none sm:text-[28px]">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-comfortable">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--color-line)"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              tick={{
                fontSize: 10,
                fontWeight: 500,
                fill: "var(--color-ink-faint)",
              }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] border-line bg-surface shadow-none"
                  nameKey="applicants"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={
                activeChart === "appliedCount"
                  ? "var(--color-primary)"
                  : "var(--color-success-text)"
              }
              radius={[2, 2, 0, 0]}
              fillOpacity={0.8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
