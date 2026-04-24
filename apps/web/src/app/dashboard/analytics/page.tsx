"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { QueryErrorState } from "@/components/data/query-state";
import {
  InteractivePerformanceChart,
  StatCard,
} from "@/features/dashboard/components";
import { ScoreDistributionChart } from "@/features/dashboard/components/score-distribution-chart";
import { SkillsRadarChart } from "@/features/dashboard/components/skills-radar-chart";
import { trpc } from "@/utils/trpc";

export default function AnalyticsPage() {
  const applicantsQuery = useQuery(trpc.applicants.list.queryOptions());
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

  const applicants = applicantsQuery.data ?? [];
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
    <div className="w-full space-y-24 pb-24">
      {/* Dynamic Metrics Layer */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Velocity Visualization */}
      <section className="space-y-10">
        <header className="px-2">
          <h3 className="font-display font-light text-[20px] text-foreground uppercase tracking-[0.15em]">
            Neural Processing Velocity
          </h3>
          <p className="mt-1 font-medium text-[12px] text-muted-foreground uppercase tracking-widest opacity-60">
            High-resolution throughput analysis (Last 14 Days)
          </p>
        </header>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-hidden rounded-3xl border border-border/50 bg-background shadow-lg">
            <InteractivePerformanceChart applicants={applicants} />
          </div>
        </motion.div>
      </section>

      {/* Distribution & Mapping Layer */}
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        {/* Score Distribution */}
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="h-full rounded-3xl border border-border/50 bg-background p-12 shadow-lg">
            <header className="mb-12">
              <h3 className="font-display font-light text-[18px] text-foreground uppercase tracking-[0.15em]">
                Resonance Distribution
              </h3>
              <p className="mt-1 font-bold text-[11px] text-muted-foreground uppercase tracking-widest opacity-40">
                Candidate match density mapping
              </p>
            </header>
            <div className="h-[300px]">
              <ScoreDistributionChart applicants={applicants} />
            </div>
          </div>
        </motion.div>

        {/* Skill Radar */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="h-full rounded-3xl border border-border/50 bg-background p-12 shadow-lg">
            <header className="mb-12">
              <h3 className="font-display font-light text-[18px] text-foreground uppercase tracking-[0.15em]">
                Expertise Topology
              </h3>
              <p className="mt-1 font-bold text-[11px] text-muted-foreground uppercase tracking-widest opacity-40">
                Aggregate cross-pipeline skill mapping
              </p>
            </header>
            <div className="mx-auto h-[300px] max-w-[450px]">
              <SkillsRadarChart applicants={applicants} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
