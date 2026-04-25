"use client";

import { motion } from "framer-motion";
import type React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RankingPreview = () => {
  return (
    <div className="pointer-events-none absolute top-10 right-10 hidden w-[260px] space-y-base opacity-60 transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-100 lg:block">
      {[
        {
          initials: "SJ",
          score: 98,
          tag: "Strong Match",
          color: "text-status-success-text bg-status-success-bg",
        },
        {
          initials: "MC",
          score: 94,
          tag: "Match",
          color: "text-primary bg-primary-alpha",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-standard border border-line-medium bg-surface p-base shadow-sm"
        >
          <div className="flex items-center gap-base">
            <div className="flex size-8 items-center justify-center rounded-full border border-line bg-bg-deep font-bold text-[9px] text-ink-faint">
              {item.initials}
            </div>
            <span
              className={cn(
                "rounded-micro px-1.5 py-0.5 font-bold text-[9px] uppercase tracking-widest",
                item.color,
              )}
            >
              {item.tag}
            </span>
          </div>
          <p className="font-serif text-[16px] text-primary">{item.score}%</p>
        </div>
      ))}
      <div className="rounded-standard border border-primary-muted bg-primary p-comfortable font-light font-sans text-[11px] text-white leading-relaxed shadow-lg">
        "Candidate shows exceptional resonance with Architecture."
      </div>
    </div>
  );
};

const ModelPreview = () => (
  <div className="pointer-events-none absolute top-10 right-10 flex items-center justify-center opacity-50 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80">
    <div className="relative flex size-48 items-center justify-center rounded-full border border-line border-dashed">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-full border-primary/30 border-t-2"
      />
      <div className="z-10 flex size-24 items-center justify-center rounded-full border border-line-strong bg-surface shadow-md">
        <p className="font-serif text-[16px] text-primary italic">Engine</p>
      </div>
      {[0, 90, 180, 270].map((angle, i) => (
        <div
          key={i}
          className="absolute flex size-10 items-center justify-center rounded-standard border border-line bg-bg-alt shadow-sm"
          style={{
            transform: `rotate(${angle}deg) translateY(-75px) rotate(-${angle}deg)`,
          }}
        >
          <div className="size-4 rounded-micro bg-primary/10" />
        </div>
      ))}
    </div>
  </div>
);

const ParsingPreview = () => (
  <div className="pointer-events-none absolute top-10 right-10 bottom-40 left-40 flex gap-base opacity-50 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-80">
    <div className="flex-1 space-y-medium overflow-hidden rounded-standard border border-line bg-bg-deep/20 p-base">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-base">
          <div className="h-1.5 w-full rounded-pill bg-line opacity-40" />
          <div className="h-1.5 w-2/3 rounded-pill bg-line opacity-20" />
        </div>
      ))}
    </div>
    <div className="flex w-1/3 flex-col justify-center gap-base">
      {["Skills", "Tags"].map((tag) => (
        <div
          key={tag}
          className="rounded-micro border border-line-medium bg-surface px-base py-2 text-center shadow-sm"
        >
          <span className="font-medium font-sans text-[9px] text-primary uppercase tracking-[0.15em]">
            {tag}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const IngestionPreview = () => (
  <div className="pointer-events-none absolute top-12 right-12 flex w-48 flex-col justify-center gap-medium opacity-60 transition-all duration-500 group-hover:opacity-100">
    <div className="flex items-center gap-base">
      <div className="flex size-10 items-center justify-center rounded-standard border border-line bg-surface shadow-sm">
        <div className="size-4 rounded-micro bg-status-success-bg" />
      </div>
      <div className="relative h-px flex-1 bg-line-medium">
        <motion.div
          animate={{ left: ["0%", "100%"] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-[3.5px] size-2 rounded-full bg-status-success-text shadow-[0_0_8px_rgba(26,112,85,0.4)]"
        />
      </div>
      <div className="flex size-12 items-center justify-center rounded-standard bg-primary shadow-md">
        <div className="size-5 rounded-full border-2 border-white/20" />
      </div>
    </div>
    <div className="flex items-center gap-base opacity-40">
      <div className="flex size-10 items-center justify-center rounded-standard border border-line bg-surface">
        <div className="size-4 rounded-micro bg-Pa" />
      </div>
      <div className="relative h-px flex-1 bg-line" />
      <div className="size-12 rounded-standard border border-line bg-bg-deep" />
    </div>
  </div>
);

const DashboardPreview = () => (
  <div className="pointer-events-none absolute top-10 right-10 bottom-32 left-64 overflow-hidden rounded-standard border border-line-strong bg-surface opacity-60 shadow-none transition-all duration-700 group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-100">
    <div className="flex h-12 items-center justify-between border-line border-b bg-bg px-comfortable">
      <div className="h-2.5 w-40 rounded-pill bg-line opacity-40" />
      <div className="flex gap-base">
        <div className="size-5 rounded-micro bg-line opacity-30" />
        <div className="size-5 rounded-micro bg-line opacity-30" />
      </div>
    </div>
    <div className="space-y-comfortable p-comfortable">
      <div className="h-10 w-2/3 rounded-standard border border-line bg-bg-deep/40" />
      <div className="grid grid-cols-3 gap-base">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-standard border border-line border-dashed bg-bg-deep/10"
          />
        ))}
      </div>
    </div>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section id="features">
      <div className="container-meridian">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-section-gap flex flex-col justify-between gap-base md:flex-row md:items-end"
        >
          <div className="max-w-[500px]">
            <div className="mb-small">
              <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.06em]">
                System Capabilities
              </span>
            </div>
            <h2 className="mb-small text-[42px] leading-[1.05]">
              Precision screening <br />
              <em className="font-light italic opacity-80">for elite teams.</em>
            </h2>
          </div>
          <p className="max-w-[380px] pb-micro font-light font-sans text-[15px] text-ink-muted leading-relaxed">
            Eliminate bias and manual overhead with an intelligent assistant
            that understands technical resonance as deeply as you do.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-[1px] overflow-hidden rounded-card border border-line bg-line shadow-none md:grid-cols-12">
          {/* Main Feature: Explainable AI */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="group relative flex min-h-[480px] flex-col bg-surface p-comfortable transition-all duration-300 hover:bg-bg-alt/30 md:col-span-8 md:row-span-2"
          >
            <RankingPreview />
            <div className="relative z-10 mt-auto max-w-[420px]">
              <span className="mb-base block font-medium font-mono text-[11px] text-primary/30 uppercase tracking-wider">
                01 / Neural Ranking
              </span>
              <h3 className="mb-small font-serif text-[32px] text-primary leading-tight">
                Explainable Intent
              </h3>
              <p className="mb-base font-light font-sans text-[16px] text-ink-muted leading-[1.68]">
                Natural-language justifications for every ranking. Understand
                the "why" behind every shortlist with full contextual reasoning
                that adapts to your unique requirements.
              </p>
              <div className="flex items-center gap-micro font-medium font-sans text-[13px] text-primary transition-all group-hover:gap-small">
                Explore reasoning{" "}
                <span className="opacity-40 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </div>
          </motion.div>

          {[
            {
              title: "Multi-Model Logic",
              desc: "Gemini 1.5 Pro analyzes candidate resonance against technical requirements.",
              tag: "02 / Architecture",
              preview: <ModelPreview />,
              span: "md:col-span-4",
            },
            {
              title: "Unified Extraction",
              desc: "Extract and normalize complex skills from unstructured resume data.",
              tag: "03 / Ingestion",
              preview: <ParsingPreview />,
              span: "md:col-span-4",
            },
            {
              title: "Deep Integrations",
              desc: "Sync from Greenhouse, Lever, or upload board data in one click.",
              tag: "04 / Connectivity",
              preview: <IngestionPreview />,
              span: "md:col-span-4",
            },
            {
              title: "Operational Control",
              desc: "A high-fidelity cockpit for recruitment leads to manage postings, track health, and audit decisions.",
              tag: "05 / Command",
              preview: <DashboardPreview />,
              span: "md:col-span-8",
            },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1 * (i + 1) }}
              className={cn(
                "group relative flex min-h-[340px] flex-col bg-surface p-comfortable transition-all duration-300 hover:bg-bg-alt/30",
                feat.span,
              )}
            >
              {feat.preview}
              <div className="relative z-10 mt-auto max-w-[340px]">
                <span className="mb-base block font-medium font-mono text-[11px] text-primary/30 uppercase tracking-wider">
                  {feat.tag}
                </span>
                <h3 className="mb-micro font-serif text-[24px] text-primary leading-tight transition-colors group-hover:text-primary-muted">
                  {feat.title}
                </h3>
                <p className="font-light font-sans text-[14px] text-ink-muted leading-[1.6]">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
