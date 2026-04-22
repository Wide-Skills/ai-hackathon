"use client";

import React from "react";
import { motion } from "framer-motion";
import { User2, Search, MoreHorizontal } from "lucide-react";

const RankingPreview = () => (
  <div className="absolute top-10 right-10 w-[300px] space-y-2.5 opacity-40 group-hover:opacity-100 transition-all duration-700 pointer-events-none hidden lg:block rotate-[-1deg] group-hover:rotate-0">
    {[
      { name: "Sarah Jenkins", score: "98", color: "text-success-foreground bg-success/10 border-success/20" },
      { name: "Michael Chen", score: "94", color: "text-info-foreground bg-info/10 border-info/20" },
      { name: "Elena Rodriguez", score: "89", color: "text-warning-foreground bg-warning/10 border-warning/20" }
    ].map((candidate, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-background p-3.5 rounded-xl border border-border shadow-sm flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-muted-foreground/50">
            {candidate.name.charAt(0)}
          </div>
          <p className="text-[12px] font-medium text-foreground">{candidate.name}</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="font-display text-[16px] font-light text-foreground leading-none">{candidate.score}%</span>
          <div className="w-10 h-0.5 bg-foreground/5 rounded-full mt-1 overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: `${candidate.score}%` }}
               transition={{ delay: 0.5 + (i * 0.05), duration: 0.8 }}
               className="h-full bg-success/40" 
             />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const ModelPreview = () => (
  <div className="absolute top-8 right-8 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-100 transition-all duration-500">
    <div className="relative h-20 w-20">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-t border-info/30 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-1.5 border-b border-success/30 rounded-full"
      />
    </div>
  </div>
);

const ParsingPreview = () => (
  <div className="absolute top-10 right-10 w-28 space-y-1.5 pointer-events-none opacity-20 group-hover:opacity-100 transition-all duration-500">
    {[0.8, 0.4, 0.6].map((w, i) => (
      <div key={i} className="h-1 bg-foreground/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          whileInView={{ x: "0%" }}
          transition={{ delay: 0.3 + (i * 0.05), duration: 0.6 }}
          className={`h-full ${i === 0 ? 'bg-success/30' : i === 1 ? 'bg-info/30' : 'bg-warning/30'}`}
          style={{ width: `${w * 100}%` }}
        />
      </div>
    ))}
  </div>
);

const IngestionPreview = () => (
  <div className="absolute top-10 right-10 flex items-center gap-1.5 pointer-events-none opacity-20 group-hover:opacity-100 transition-all duration-500">
    <div className="h-4 w-4 rounded bg-success/20 border border-success/10" />
    <motion.div 
      animate={{ x: [0, 4, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="h-px w-4 bg-info/40" 
    />
    <div className="h-5 w-5 rounded bg-info/20 border border-info/10" />
  </div>
);

const DashboardPreview = () => (
  <div className="absolute top-10 right-10 w-[280px] bg-background rounded-xl border border-border p-5 shadow-sm pointer-events-none hidden lg:block opacity-30 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
    <div className="flex items-center justify-between mb-5">
      <div className="space-y-1">
        <div className="h-1.5 w-12 bg-success/20 rounded" />
        <div className="h-2 w-20 bg-foreground/10 rounded" />
      </div>
      <div className="h-6 w-6 rounded-full bg-info/10" />
    </div>
    <div className="flex items-end gap-1.5 h-12">
      {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
        <motion.div 
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          transition={{ delay: 0.3 + (i * 0.04), duration: 0.6 }}
          className={`flex-1 rounded-t-sm ${h > 70 ? 'bg-success/30' : 'bg-info/20'}`}
        />
      ))}
    </div>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section className="py-[100px] bg-background border-y border-border">
      <div className="container-tight">
        <div className="mb-16 max-w-[800px]">
          <h2 className="text-foreground font-display mb-5 text-[32px] md:text-[44px] font-light leading-[1.1] tracking-[-0.03em]">
            Precision Screening for <br />
            <span className="text-muted-foreground">modern recruiters.</span>
          </h2>
          <p className="text-muted-foreground text-[17px] leading-[1.6] tracking-[0.1px] max-w-[500px]">
            Eliminate bias and manual overhead with an intelligent assistant 
            that understands skill sets as deeply as you do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-[280px]">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card md:col-span-8 md:row-span-2 p-10 justify-end relative group bg-background border-border"
          >
            <RankingPreview />
            <div className="relative z-10 max-w-[400px]">
              <h3 className="text-foreground text-[24px] font-light font-display tracking-tight mb-4">Explainable AI Ranking</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed tracking-[0.1px]">
                Our platform provides natural-language justifications for every ranking. 
                Understand the "why" behind every shortlist with reasoning.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card md:col-span-4 p-8 bg-background group border-border"
          >
            <ModelPreview />
            <div className="relative z-10 pt-6">
              <h3 className="text-foreground text-[18px] font-light font-display tracking-tight mb-2.5">Multi-Model Analysis</h3>
              <p className="text-muted-foreground text-[14px] leading-relaxed tracking-[0.05px]">
                Leveraging Gemini 1.5 Pro to analyze candidate profiles against job requirements.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card md:col-span-4 p-8 bg-background group border-border"
          >
            <ParsingPreview />
            <div className="relative z-10 pt-6">
              <h3 className="text-foreground text-[18px] font-light font-display tracking-tight mb-2.5">Unstructured Parsing</h3>
              <p className="text-muted-foreground text-[14px] leading-relaxed tracking-[0.05px]">
                Extract and normalize skills from messy PDFs, spreadsheets, and external resumes.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card md:col-span-4 p-8 bg-background group border-border"
          >
            <IngestionPreview />
            <div className="relative z-10 pt-6">
              <h3 className="text-foreground text-[18px] font-light font-display tracking-tight mb-2.5">Unified Ingestion</h3>
              <p className="text-muted-foreground text-[14px] leading-relaxed tracking-[0.05px]">
                Sync data from your internal platform or upload external job board data in one click.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card md:col-span-8 p-10 flex-row items-center gap-10 bg-background group border-border"
          >
             <DashboardPreview />
             <div className="flex-1 relative z-10">
                <h3 className="text-foreground text-[24px] font-light font-display tracking-tight mb-4">Recruiter Dashboard</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed tracking-[0.1px] max-w-[320px]">
                  A high-fidelity interface designed for decision-makers. Manage postings and visualize shortlists.
                </p>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
