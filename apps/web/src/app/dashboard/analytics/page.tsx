"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryErrorState } from "@/components/data/query-state";
import { trpc } from "@/utils/trpc";
import { ScoreDistributionChart } from "@/features/dashboard/components/score-distribution-chart";
import { SkillsRadarChart } from "@/features/dashboard/components/skills-radar-chart";
import { StatCard, InteractivePerformanceChart } from "@/features/dashboard/components";
import { motion } from "framer-motion";
import { Users, Sparkles, BrainCircuit, Target } from "lucide-react";

export default function AnalyticsPage() {
  const applicantsQuery = useQuery(trpc.applicants.list.queryOptions());
  const statsQuery = useQuery(trpc.jobs.stats.queryOptions());

  const isLoading = applicantsQuery.isLoading || statsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="w-full space-y-16 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-secondary/30 rounded-section" />)}
        </div>
        <div className="h-[500px] bg-secondary/30 rounded-section" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="h-[450px] bg-secondary/30 rounded-section" />
           <div className="h-[450px] bg-secondary/30 rounded-section" />
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

  const shortlistedCount = applicants.filter(a => a.status === 'shortlisted').length;
  const aiCoverage = applicants.length > 0 
    ? Math.round((applicants.filter(a => !!a.screening).length / applicants.length) * 100) 
    : 0;

  const statCards = [
    { label: "Total Talent", value: stats?.totalCandidates ?? 0, desc: "Cumulative profiles in pool", trend: "Active" },
    { label: "Quality Index", value: `${stats?.avgMatchScore ?? 0}%`, desc: "Avg match score across pool", trend: "High" },
    { label: "AI Saturation", value: `${aiCoverage}%`, desc: "Profiles analyzed by Gemini", trend: "Sync" },
    { label: "Shortlisted", value: shortlistedCount, desc: "Top tier experts identified", trend: "Elite" },
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
          <h3 className="font-display text-[20px] font-light text-foreground uppercase tracking-[0.15em]">Neural Processing Velocity</h3>
          <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-widest opacity-60">High-resolution throughput analysis (Last 14 Days)</p>
        </header>
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-background rounded-section border border-border/50 shadow-premium overflow-hidden">
            <InteractivePerformanceChart applicants={applicants} />
          </div>
        </motion.div>
      </section>

      {/* Distribution & Mapping Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Score Distribution */}
        <motion.div 
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <div className="bg-background rounded-section border border-border/50 p-12 shadow-premium h-full">
            <header className="mb-12">
               <h3 className="font-display text-[18px] font-light text-foreground uppercase tracking-[0.15em]">Resonance Distribution</h3>
               <p className="text-[11px] text-muted-foreground font-bold mt-1 uppercase tracking-widest opacity-40">Candidate match density mapping</p>
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
          <div className="bg-background rounded-section border border-border/50 p-12 shadow-premium h-full">
             <header className="mb-12">
                <h3 className="font-display text-[18px] font-light text-foreground uppercase tracking-[0.15em]">Expertise Topology</h3>
                <p className="text-[11px] text-muted-foreground font-bold mt-1 uppercase tracking-widest opacity-40">Aggregate cross-pipeline skill mapping</p>
             </header>
             <div className="max-w-[450px] mx-auto h-[300px]">
               <SkillsRadarChart applicants={applicants} />
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
