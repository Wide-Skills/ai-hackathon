"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { ScoreDistributionChart } from "@/features/dashboard/components/score-distribution-chart";
import { ScreeningTrendChart } from "@/features/dashboard/components/screening-trend-chart";
import { SkillsRadarChart } from "@/features/dashboard/components/skills-radar-chart";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { data: applicants = [], isLoading } = useQuery(
    trpc.applicants.list.queryOptions(),
  );

  if (isLoading) {
    return (
      <div className="w-full space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-96 bg-secondary/50 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-background rounded-xl border border-border p-10 shadow-sm">
            <div className="mb-10">
               <h3 className="font-display text-[20px] font-light text-foreground uppercase tracking-[0.1em]">Quality Distribution</h3>
               <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">Candidate match scores across all roles</p>
            </div>
            <ScoreDistributionChart applicants={applicants} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-background rounded-xl border border-border p-10 shadow-sm">
             <div className="mb-10">
                <h3 className="font-display text-[20px] font-light text-foreground uppercase tracking-[0.1em]">Screening Velocity</h3>
                <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">AI processing throughput over time</p>
             </div>
            <ScreeningTrendChart applicants={applicants} />
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="bg-background rounded-xl border border-border p-10 shadow-sm">
           <div className="mb-10">
              <h3 className="font-display text-[20px] font-light text-foreground uppercase tracking-[0.1em]">Neural Skill Radar</h3>
              <p className="text-[12px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">Aggregated expertise levels in candidate pool</p>
           </div>
           <div className="max-w-[600px] mx-auto">
             <SkillsRadarChart applicants={applicants} />
           </div>
        </div>
      </motion.div>
    </div>
  );
}
