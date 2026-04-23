"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryErrorState } from "@/components/data/query-state";
import { trpc } from "@/utils/trpc";
import { ScoreDistributionChart } from "@/features/dashboard/components/score-distribution-chart";
import { SkillsRadarChart } from "@/features/dashboard/components/skills-radar-chart";
import { StatCard, InteractivePerformanceChart } from "@/features/dashboard/components";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const applicantsQuery = useQuery(
    trpc.applicants.list.queryOptions(),
  );
  const statsQuery = useQuery(trpc.jobs.stats.queryOptions());

  const isLoading = applicantsQuery.isLoading || statsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="w-full space-y-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-secondary/30 rounded-xl" />)}
        </div>
        <div className="h-[400px] bg-secondary/30 rounded-section" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="h-96 bg-secondary/30 rounded-section" />
           <div className="h-96 bg-secondary/30 rounded-section" />
        </div>
      </div>
    );
  }

  if (applicantsQuery.isError) {
    return (
      <QueryErrorState
        error={applicantsQuery.error}
        title="Analytics data couldn't be loaded"
        onRetry={() => applicantsQuery.refetch()}
      />
    );
  }

  if (statsQuery.isError) {
    return (
      <QueryErrorState
        error={statsQuery.error}
        title="Analytics metrics couldn't be loaded"
        onRetry={() => statsQuery.refetch()}
      />
    );
  }

  const applicants = applicantsQuery.data ?? [];
  const stats = statsQuery.data;

  const shortlistedCount = applicants.filter(a => a.status === 'shortlisted').length;
  const aiCoverage = applicants.length > 0 
    ? Math.round((applicants.filter(a => !!a.screening).length / applicants.length) * 100) 
    : 0;

  const statCards = [
    { label: "Total Talent", value: stats?.totalCandidates ?? 0, desc: "Cumulative profiles in pool", trend: "+14%" },
    { label: "AI Quality Index", value: `${stats?.avgMatchScore ?? 0}%`, desc: "Avg match score across pool", trend: "+2.5%" },
    { label: "AI Coverage", value: `${aiCoverage}%`, desc: "Profiles analyzed by Gemini", trend: "+18%" },
    { label: "Shortlisted", value: shortlistedCount, desc: "Top tier experts identified", trend: "+5%" },
  ];

  return (
    <div className="w-full space-y-12 pb-20">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* Main Interactive Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-background rounded-section border border-border/50 shadow-premium overflow-hidden">
          <InteractivePerformanceChart applicants={applicants} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <div className="bg-background rounded-section border border-border/50 p-10 shadow-premium h-full">
            <div className="mb-10">
               <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.15em]">Neural Score Distribution</h3>
               <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-widest opacity-60">Comparative match metrics across candidates</p>
            </div>
            <ScoreDistributionChart applicants={applicants} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
        >
          <div className="bg-background rounded-section border border-border/50 p-10 shadow-premium h-full">
             <div className="mb-10">
                <h3 className="font-display text-[16px] font-light text-foreground uppercase tracking-[0.15em]">Aggregate Expertise Radar</h3>
                <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-widest opacity-60">Weighted skill mapping of processed pool</p>
             </div>
             <div className="max-w-[500px] mx-auto">
               <SkillsRadarChart applicants={applicants} />
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
