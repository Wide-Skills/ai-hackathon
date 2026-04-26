"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { QueryErrorState } from "@/components/data/query-state";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InteractivePerformanceChart,
  StatCard,
} from "@/features/dashboard/components";
import { ScoreDistributionChart } from "@/features/dashboard/components/score-distribution-chart";
import { SkillsRadarChart } from "@/features/dashboard/components/skills-radar-chart";
import { trpc } from "@/utils/trpc";

export default function AnalyticsPage() {
  const applicantsQuery = useQuery(
    trpc.applicants.list.queryOptions({ page: 1, limit: 100 }),
  );
  const statsQuery = useQuery(trpc.jobs.stats.queryOptions());

  const isLoading = applicantsQuery.isLoading || statsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="w-full animate-pulse space-y-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-secondary/30" />
          ))}
        </div>
        <div className="h-[500px] rounded-3xl bg-secondary/30" />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="h-[450px] rounded-3xl bg-secondary/30" />
          <div className="h-[450px] rounded-3xl bg-secondary/30" />
        </div>
      </div>
    );
  }

  if (applicantsQuery.isError || statsQuery.isError) {
    return (
      <QueryErrorState
        error={applicantsQuery.error || statsQuery.error}
        title="Intelligence metrics could not be synchronized"
        onRetry={() => {
          applicantsQuery.refetch();
          statsQuery.refetch();
        }}
      />
    );
  }

  const applicants = applicantsQuery.data?.items ?? [];
  const stats = statsQuery.data;

  const shortlistedCount = applicants.filter(
    (a) => a.status === "shortlisted",
  ).length;
  const aiCoverage =
    applicants.length > 0
      ? Math.round(
          (applicants.filter((a) => !!a.screening).length / applicants.length) *
            100,
        )
      : 0;

  const statCards = [
    {
      label: "Total Talent",
      value: stats?.totalCandidates ?? 0,
      desc: "Cumulative profiles in pool",
      trend: "Active",
    },
    {
      label: "Quality Index",
      value: `${stats?.avgMatchScore ?? 0}%`,
      desc: "Avg match score across pool",
      trend: "High",
    },
    {
      label: "AI Saturation",
      value: `${aiCoverage}%`,
      desc: "Profiles analyzed by Gemini",
      trend: "Sync",
    },
    {
      label: "Shortlisted",
      value: shortlistedCount,
      desc: "Top tier experts identified",
      trend: "Elite",
    },
  ];

  return (
    <div className="w-full space-y-section-padding pb-section-padding">
      <section className="grid grid-cols-1 gap-comfortable md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <StatCard
              label={stat.label}
              value={stat.value}
              sublabel={stat.desc}
              trend={stat.trend}
            />
          </motion.div>
        ))}
      </section>

      <section className="space-y-base">
        <div className="mb-section-gap border-line border-b px-small pb-base">
          <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
            Performance
          </span>
          <h3 className="font-serif text-[32px] text-primary leading-tight">
            Screening Velocity
          </h3>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            variant="default"
            className="overflow-hidden shadow-none"
            size="none"
          >
            <InteractivePerformanceChart applicants={applicants} />
          </Card>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 items-start gap-comfortable lg:grid-cols-12">
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            variant="default"
            className="h-full overflow-hidden shadow-none"
            size="none"
          >
            <CardHeader>
              <CardDescription>Candidates</CardDescription>
              <CardTitle>Match Distribution</CardTitle>
            </CardHeader>
            <div className="h-[340px] bg-surface p-comfortable">
              <ScoreDistributionChart applicants={applicants} />
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            variant="default"
            className="h-full overflow-hidden shadow-none"
            size="none"
          >
            <CardHeader>
              <CardDescription>Proficiency</CardDescription>
              <CardTitle>Skill Map</CardTitle>
            </CardHeader>
            <div className="flex h-[340px] items-center justify-center bg-surface p-comfortable">
              <div className="w-full max-w-[340px]">
                <SkillsRadarChart applicants={applicants} />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
