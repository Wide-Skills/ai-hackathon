"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import type { Applicant } from "@ai-hackathon/shared"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface InteractivePerformanceChartProps {
  applicants: Applicant[]
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
} satisfies ChartConfig

export function InteractivePerformanceChart({ applicants }: InteractivePerformanceChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("appliedCount")

  const chartData = React.useMemo(() => {
    const dailyData: Record<string, { date: string; appliedCount: number; screenedCount: number }> = {}

    // Last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]
      dailyData[dateStr] = { date: dateStr, appliedCount: 0, screenedCount: 0 }
    }

    applicants.forEach((a) => {
      const appliedDate = new Date(a.appliedAt).toISOString().split("T")[0]
      if (dailyData[appliedDate]) {
        dailyData[appliedDate].appliedCount++
        if (a.screening) {
          dailyData[appliedDate].screenedCount++
        }
      }
    })

    return Object.values(dailyData)
  }, [applicants])

  const total = React.useMemo(
    () => ({
      appliedCount: chartData.reduce((acc, curr) => acc + curr.appliedCount, 0),
      screenedCount: chartData.reduce((acc, curr) => acc + curr.screenedCount, 0),
    }),
    [chartData]
  )

  return (
    <Card className="py-0 border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-col items-stretch border-b border-border/5 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 sm:py-6">
          <CardTitle className="font-display text-[18px] font-light uppercase tracking-widest">Recruitment Velocity</CardTitle>
          <CardDescription className="text-[12px] uppercase tracking-wider opacity-60">
            Comparing incoming volume vs AI throughput (Last 14 days)
          </CardDescription>
        </div>
        <div className="flex">
          {["appliedCount", "screenedCount"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l border-border/5 data-[active=true]:bg-secondary/20 sm:border-t-0 sm:border-l sm:px-8 sm:py-6 transition-all"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {chartConfig[chart].label}
                </span>
                <span className="font-display text-2xl font-light leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
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
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fontSize: 10, fontWeight: 500, opacity: 0.4 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] shadow-premium border-border/50"
                  nameKey="applicants"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar 
              dataKey={activeChart} 
              fill={activeChart === 'appliedCount' ? "var(--color-info)" : "var(--color-success)"} 
              radius={[4, 4, 0, 0]}
              fillOpacity={0.6}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
