"use client";

import { motion } from "framer-motion";
import type React from "react";

const RankingPreview = () => (
  <div className="pointer-events-none absolute top-10 right-10 hidden w-[300px] rotate-[-1deg] space-y-2.5 opacity-40 transition-all duration-700 group-hover:rotate-0 group-hover:opacity-100 lg:block">
    {[
      {
        name: "Sarah Jenkins",
        score: "98",
        color: "text-success-foreground bg-success/10 border-success/20",
      },
      {
        name: "Michael Chen",
        score: "94",
        color: "text-info-foreground bg-info/10 border-info/20",
      },
      {
        name: "Elena Rodriguez",
        score: "89",
        color: "text-warning-foreground bg-warning/10 border-warning/20",
      },
    ].map((candidate, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary font-bold text-[9px] text-muted-foreground/50">
            {candidate.name.charAt(0)}
          </div>
          <p className="font-medium text-[12px] text-foreground">
            {candidate.name}
          </p>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="font-display font-light text-[16px] text-foreground leading-none">
            {candidate.score}%
          </span>
          <div className="mt-1 h-0.5 w-10 overflow-hidden rounded-full bg-foreground/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${candidate.score}%` }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
              className="h-full bg-success/40"
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const ModelPreview = () => (
  <div className="pointer-events-none absolute top-8 right-8 flex items-center justify-center opacity-20 transition-all duration-500 group-hover:opacity-100">
    <div className="relative h-20 w-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-full border-info/30 border-t"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute inset-1.5 rounded-full border-success/30 border-b"
      />
    </div>
  </div>
);

const ParsingPreview = () => (
  <div className="pointer-events-none absolute top-10 right-10 w-28 space-y-1.5 opacity-20 transition-all duration-500 group-hover:opacity-100">
    {[0.8, 0.4, 0.6].map((w, i) => (
      <div key={i} className="h-1 overflow-hidden rounded-full bg-foreground/5">
        <motion.div
          initial={{ x: "-100%" }}
          whileInView={{ x: "0%" }}
          transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
          className={`h-full ${i === 0 ? "bg-success/30" : i === 1 ? "bg-info/30" : "bg-warning/30"}`}
          style={{ width: `${w * 100}%` }}
        />
      </div>
    ))}
  </div>
);

const IngestionPreview = () => (
  <div className="pointer-events-none absolute top-10 right-10 flex items-center gap-1.5 opacity-20 transition-all duration-500 group-hover:opacity-100">
    <div className="h-4 w-4 rounded border border-success/10 bg-success/20" />
    <motion.div
      animate={{ x: [0, 4, 0] }}
      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      className="h-px w-4 bg-info/40"
    />
    <div className="h-5 w-5 rounded border border-info/10 bg-info/20" />
  </div>
);

const DashboardPreview = () => (
  <div className="pointer-events-none absolute top-10 right-10 hidden w-[280px] translate-y-2 rounded-xl border border-border bg-background p-5 opacity-30 shadow-sm transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
    <div className="mb-5 flex items-center justify-between">
      <div className="space-y-1">
        <div className="h-1.5 w-12 rounded bg-success/20" />
        <div className="h-2 w-20 rounded bg-foreground/10" />
      </div>
      <div className="h-6 w-6 rounded-full bg-info/10" />
    </div>
    <div className="flex h-12 items-end gap-1.5">
      {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          transition={{ delay: 0.3 + i * 0.04, duration: 0.6 }}
          className={`flex-1 rounded-t-sm ${h > 70 ? "bg-success/30" : "bg-info/20"}`}
        />
      ))}
    </div>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section className="border-border border-y bg-background py-[100px]">
      <div className="container-tight">
        <div className="mb-16 max-w-[800px]">
          <h2 className="mb-5 font-display font-light text-[32px] text-foreground leading-[1.1] tracking-[-0.03em] md:text-display-section">
            Precision Screening for <br />
            <span className="text-muted-foreground">modern recruiters.</span>
          </h2>
          <p className="max-w-[500px] text-[17px] text-muted-foreground leading-[1.6] tracking-[0.1px]">
            Eliminate bias and manual overhead with an intelligent assistant
            that understands skill sets as deeply as you do.
          </p>
        </div>

        <div className="grid auto-rows-[280px] grid-cols-1 gap-5 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card group relative justify-end border-border bg-background p-10 md:col-span-8 md:row-span-2"
          >
            <RankingPreview />
            <div className="relative z-10 max-w-[400px]">
              <h3 className="mb-4 font-display font-light text-display-card text-foreground tracking-tight">
                Explainable AI Ranking
              </h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed tracking-[0.1px]">
                Our platform provides natural-language justifications for every
                ranking. Understand the "why" behind every shortlist with
                reasoning.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card group border-border bg-background p-8 md:col-span-4"
          >
            <ModelPreview />
            <div className="relative z-10 pt-6">
              <h3 className="mb-2.5 font-display font-light text-display-card text-foreground tracking-tight">
                Multi-Model Analysis
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed tracking-[0.05px]">
                Leveraging Gemini 1.5 Pro to analyze candidate profiles against
                job requirements.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card group border-border bg-background p-8 md:col-span-4"
          >
            <ParsingPreview />
            <div className="relative z-10 pt-6">
              <h3 className="mb-2.5 font-display font-light text-display-card text-foreground tracking-tight">
                Unstructured Parsing
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed tracking-[0.05px]">
                Extract and normalize skills from messy PDFs, spreadsheets, and
                external resumes.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card group border-border bg-background p-8 md:col-span-4"
          >
            <IngestionPreview />
            <div className="relative z-10 pt-6">
              <h3 className="mb-2.5 font-display font-light text-display-card text-foreground tracking-tight">
                Unified Ingestion
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed tracking-[0.05px]">
                Sync data from your internal platform or upload external job
                board data in one click.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bento-card group flex-row items-center gap-10 border-border bg-background p-10 md:col-span-8"
          >
            <DashboardPreview />
            <div className="relative z-10 flex-1">
              <h3 className="mb-4 font-display font-light text-display-card text-foreground tracking-tight">
                Recruiter Dashboard
              </h3>
              <p className="max-w-[320px] text-[15px] text-muted-foreground leading-relaxed tracking-[0.1px]">
                A high-fidelity interface designed for decision-makers. Manage
                postings and visualize shortlists.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
