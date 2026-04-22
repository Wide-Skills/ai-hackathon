"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Database, Layers, Zap } from "lucide-react";

const RankingPreview = () => (
  <div className="absolute top-12 right-12 w-[340px] space-y-3 opacity-40 group-hover:opacity-100 transition-all duration-700 pointer-events-none hidden lg:block rotate-[-1deg] group-hover:rotate-0">
    {[
      { name: "Sarah Jenkins", score: "98", reason: "Expert in Neural Architecture", color: "bg-emerald-50 text-emerald-700" },
      { name: "Michael Chen", score: "94", reason: "Advanced Gemini Integration", color: "bg-blue-50 text-blue-700" },
      { name: "Elena Rodriguez", score: "89", reason: "Strong System Design", color: "bg-amber-50 text-amber-700" }
    ].map((candidate, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white p-4 rounded-xl border border-black/[0.03] shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center text-[10px] font-bold text-black/40">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <p className="text-[13px] font-medium text-black mb-0.5">{candidate.name}</p>
            <div className={`text-[9px] px-2 py-0.5 rounded-full inline-block font-bold uppercase tracking-wider ${candidate.color}`}>
              {candidate.reason}
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="font-display text-[18px] font-light text-black leading-none">{candidate.score}%</span>
          <div className="w-10 h-1 bg-black/5 rounded-full mt-1 overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: `${candidate.score}%` }}
               transition={{ delay: 0.5 + (i * 0.05), duration: 0.8 }}
               className="h-full bg-black/20" 
             />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const ModelPreview = () => (
  <div className="absolute top-8 right-8 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500">
    <div className="relative h-24 w-24">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-t border-black/5 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 border-b border-black/5 rounded-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap className="h-6 w-6 text-black/20" />
      </div>
    </div>
  </div>
);

const ParsingPreview = () => (
  <div className="absolute top-10 right-10 w-32 space-y-2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500">
    {[0.8, 0.4, 0.6].map((w, i) => (
      <div key={i} className="h-1.5 bg-black/[0.03] rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: "-100%" }}
          whileInView={{ x: "0%" }}
          transition={{ delay: 0.3 + (i * 0.05), duration: 0.6 }}
          className="h-full bg-black/10"
          style={{ width: `${w * 100}%` }}
        />
      </div>
    ))}
    <div className="flex gap-2 pt-2">
      <div className="h-3 w-8 rounded bg-emerald-50 border border-emerald-100" />
      <div className="h-3 w-10 rounded bg-blue-50 border border-blue-100" />
    </div>
  </div>
);

const IngestionPreview = () => (
  <div className="absolute top-10 right-10 flex items-center gap-2 pointer-events-none opacity-30 group-hover:opacity-80 transition-opacity duration-500">
    <FileText className="h-5 w-5 text-black/40" />
    <motion.div 
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="h-0.5 w-6 bg-black/10" 
    />
    <Database className="h-6 w-6 text-black/40" />
  </div>
);

const DashboardPreview = () => (
  <div className="absolute top-12 right-12 w-[320px] bg-white rounded-xl border border-black/[0.04] p-6 shadow-sm pointer-events-none hidden lg:block opacity-40 group-hover:opacity-100 transition-opacity duration-700 translate-y-4 group-hover:translate-y-0 transition-transform">
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-1">
        <div className="h-2 w-16 bg-black/5 rounded" />
        <div className="h-3 w-24 bg-black/10 rounded" />
      </div>
      <div className="h-8 w-8 rounded-full bg-black/5" />
    </div>
    <div className="flex items-end gap-2 h-16">
      {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
        <motion.div 
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          transition={{ delay: 0.3 + (i * 0.04), duration: 0.6 }}
          className="flex-1 bg-black/[0.06] rounded-t-sm" 
        />
      ))}
    </div>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section className="py-[120px] bg-white/40 backdrop-blur-md border-y border-black/[0.03]">
      <div className="container-tight">
        
        <div className="mb-20 max-w-[800px]">
          <h2 className="text-black font-display mb-6 text-[36px] md:text-[52px] font-light leading-[1.1] tracking-[-0.03em]">
            Precision Screening for <br />
            <span className="text-[#777169] italic">modern recruiters.</span>
          </h2>
          <p className="text-[#4E4E4E] text-[18px] leading-[1.6] tracking-[0.14px] max-w-[540px]">
            Eliminate bias and manual overhead with an intelligent assistant 
            that understands skill sets as deeply as you do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
          
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card md:col-span-8 md:row-span-2 p-12 justify-end relative group bg-white border-black/[0.04]"
          >
            <RankingPreview />
            <div className="relative z-10 max-w-[440px]">
              <h3 className="text-black text-[28px] font-light font-display tracking-tight mb-6">Explainable AI Ranking</h3>
              <p className="text-[#4E4E4E] text-[17px] leading-relaxed tracking-[0.12px]">
                Our platform doesn't just score candidates; it provides natural-language 
                justifications for every ranking. Understand the "why" behind every 
                shortlist with component-level reasoning.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card md:col-span-4 p-10 bg-white group border-black/[0.04]"
          >
            <ModelPreview />
            <div className="relative z-10 pt-8">
              <h3 className="text-black text-[20px] font-light font-display tracking-tight mb-3">Multi-Model Analysis</h3>
              <p className="text-[#4E4E4E] text-[15px] leading-relaxed tracking-[0.1px]">
                Leveraging Gemini 1.5 Pro to analyze candidate profiles against complex job requirements.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card md:col-span-4 p-10 bg-white group border-black/[0.04]"
          >
            <ParsingPreview />
            <div className="relative z-10 pt-8">
              <h3 className="text-black text-[20px] font-light font-display tracking-tight mb-3">Unstructured Parsing</h3>
              <p className="text-[#4E4E4E] text-[15px] leading-relaxed tracking-[0.1px]">
                Extract and normalize skills from messy PDFs, scattered spreadsheets, and external resumes.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card md:col-span-4 p-10 bg-white group border-black/[0.04]"
          >
            <IngestionPreview />
            <div className="relative z-10 pt-8">
              <h3 className="text-black text-[20px] font-light font-display tracking-tight mb-3">Unified Ingestion</h3>
              <p className="text-[#4E4E4E] text-[15px] leading-relaxed tracking-[0.1px]">
                Sync data from your internal platform or upload external job board data in one click.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card md:col-span-8 p-12 flex-row items-center gap-12 bg-white group border-black/[0.04]"
          >
             <DashboardPreview />
             <div className="flex-1 relative z-10">
                <h3 className="text-black text-[28px] font-light font-display tracking-tight mb-4">Recruiter Dashboard</h3>
                <p className="text-[#4E4E4E] text-[16px] leading-relaxed tracking-[0.12px] max-w-[360px]">
                  A high-fidelity interface designed for decision-makers. Manage postings and visualize ranked shortlists in real-time.
                </p>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
