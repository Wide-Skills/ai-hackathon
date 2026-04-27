"use client";

import {
  RiBarChartGroupedLine,
  RiInformationLine,
  RiListCheck3,
  RiRadarLine,
} from "@remixicon/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

interface JobAnalyticsProps {
  jobId: string;
}

export function JobAnalytics({ jobId }: JobAnalyticsProps) {
  const analyticsQuery = useQuery({
    ...trpc.jobs.getAnalytics.queryOptions({ jobId }),
    placeholderData: keepPreviousData,
  });

  const isLoading = analyticsQuery.isPending && !analyticsQuery.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-comfortable lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-card bg-bg2" />
        <div className="h-64 animate-pulse rounded-card bg-bg2" />
      </div>
    );
  }

  const data = analyticsQuery.data;
  if (!data) return null;

  const distributionData = Object.entries(data.scoreDistribution).map(
    ([range, count]) => ({
      range,
      count,
    }),
  );

  const avgScoresData = [
    { label: "Technical", value: data.avgScores.technicalSkills },
    { label: "Experience", value: data.avgScores.experience },
    { label: "Education", value: data.avgScores.education },
    { label: "Culture", value: data.avgScores.culturalFit },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-section-gap"
    >
      <div className="grid grid-cols-1 gap-hero lg:grid-cols-2">
        {/* Score Distribution */}
        <Card
          variant="default"
          className="overflow-hidden border-line shadow-none transition-all hover:border-line-medium"
          size="none"
        >
          <CardHeader className="border-line border-b bg-bg-alt/5 px-comfortable py-base">
            <div className="flex items-center gap-base">
              <div className="flex h-8 w-8 items-center justify-center rounded-micro bg-primary/10">
                <RiBarChartGroupedLine className="size-4 text-primary" />
              </div>
              <div>
                <CardDescription className="text-[10px] uppercase tracking-wider">
                  Quality Distribution
                </CardDescription>
                <CardTitle className="text-[18px]">Talent Spread</CardTitle>
              </div>
            </div>
          </CardHeader>
          <div className="h-[250px] p-comfortable">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={distributionData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--color-line)"
                />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10, fill: "var(--color-ink-faint)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--color-ink-faint)" }}
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
                  }}
                  cursor={{ fill: "var(--color-bg-alt)", radius: 4 }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-primary)"
                  fillOpacity={0.4}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Skill Gaps */}
        <Card
          variant="default"
          className="overflow-hidden border-line shadow-none transition-all hover:border-line-medium"
          size="none"
        >
          <CardHeader className="border-line border-b bg-bg-alt/5 px-comfortable py-base">
            <div className="flex items-center gap-base">
              <div className="flex h-8 w-8 items-center justify-center rounded-micro bg-status-warning-bg">
                <RiListCheck3 className="size-4 text-status-warning-text" />
              </div>
              <div>
                <CardDescription className="text-[10px] uppercase tracking-wider">
                  Market Intelligence
                </CardDescription>
                <CardTitle className="text-[18px]">Top Skill Gaps</CardTitle>
              </div>
            </div>
          </CardHeader>
          <div className="space-y-base p-comfortable">
            {data.topSkillsGaps.length > 0 ? (
              data.topSkillsGaps.map((gap) => (
                <div key={gap.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium font-sans text-[13px] text-primary">
                      {gap.skill}
                    </span>
                    <span className="font-medium font-sans text-[11px] text-status-error-text">
                      {gap.missingPercentage}% missing
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full bg-status-error-text opacity-40"
                      style={{ width: `${gap.missingPercentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <RiInformationLine className="mb-2 size-6 text-ink-faint/30" />
                <p className="font-medium font-sans text-[11px] text-ink-faint uppercase">
                  No significant gaps detected
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Average Attribute Scores */}
      <Card
        variant="default"
        className="overflow-hidden border-line shadow-none transition-all hover:border-line-medium"
        size="none"
      >
        <CardHeader className="border-line border-b bg-bg-alt/5 px-comfortable py-base">
          <div className="flex items-center gap-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-micro bg-primary/10">
              <RiRadarLine className="size-4 text-primary" />
            </div>
            <div>
              <CardDescription className="text-[10px] uppercase tracking-wider">
                Benchmark
              </CardDescription>
              <CardTitle className="text-[18px]">Average Fit scores</CardTitle>
            </div>
          </div>
        </CardHeader>
        <div className="grid grid-cols-2 gap-hero p-comfortable md:grid-cols-4">
          {avgScoresData.map((score, i) => (
            <motion.div
              key={score.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.3 }}
              className="text-center"
            >
              <div className="mb-1 font-serif text-[32px] text-primary leading-none">
                {score.value}%
              </div>
              <div className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                {score.label}
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-bg-alt/20">
                <div
                  className="h-full bg-primary/40"
                  style={{ width: `${score.value}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
