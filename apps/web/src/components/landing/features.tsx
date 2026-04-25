"use client";

import { motion } from "framer-motion";
import type React from "react";
import { cn } from "@/lib/utils";


const RankingPreview = () => (
  <div className="pointer-events-none absolute inset-x-comfortable top-comfortable flex flex-col gap-2 opacity-50 transition-all duration-500 group-hover:opacity-100 group-hover:-translate-y-1 md:left-auto md:right-comfortable md:w-1/2 md:max-w-[440px]">
    {[
      { initials: "SJ", score: 98, tag: "Strong match", color: "text-status-success-text bg-status-success-bg" },
      { initials: "MC", score: 94, tag: "Match",        color: "text-primary bg-primary-alpha" },
    ].map((item, i) => (
      <div
        key={i}
        className="flex items-center justify-between rounded-standard border border-line bg-surface px-base py-2.5 shadow-sm"
      >
        <div className="flex items-center gap-base">
          <div className="flex size-7 items-center justify-center rounded-full border border-line bg-bg-deep font-bold text-[9px] text-ink-faint">
            {item.initials}
          </div>
          <span className={cn("rounded-micro px-1.5 py-0.5 font-bold text-[9px] uppercase tracking-widest", item.color)}>
            {item.tag}
          </span>
        </div>
        <p className="font-serif text-[15px] text-primary">{item.score}%</p>
      </div>
    ))}
    <div className="rounded-standard border border-line-medium bg-bg-alt px-base py-2.5 font-light font-sans text-[11px] text-ink-muted leading-relaxed">
      "Candidate shows exceptional alignment with the Architecture requirements."
    </div>
  </div>
);


const ModelPreview = () => (
  <div className="pointer-events-none absolute top-comfortable right-comfortable flex items-center justify-center opacity-40 transition-all duration-500 group-hover:opacity-70">
    <div className="relative flex size-28 items-center justify-center rounded-full border border-line border-dashed">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute inset-0 rounded-full border-t-2 border-primary/20"
      />
      {[0, 90, 180, 270].map((angle) => (
        <div
          key={angle}
          className="absolute flex size-8 items-center justify-center rounded-standard border border-line bg-surface shadow-sm"
          style={{ transform: `rotate(${angle}deg) translateY(-46px) rotate(-${angle}deg)` }}
        >
          <div className="size-3 rounded-micro bg-primary/10" />
        </div>
      ))}
      <div className="z-10 flex size-14 items-center justify-center rounded-full border border-line-strong bg-surface shadow-sm">
        <p className="font-serif text-[12px] text-primary italic">Engine</p>
      </div>
    </div>
  </div>
);


const ParsingPreview = () => (
  <div className="pointer-events-none absolute inset-x-comfortable top-comfortable bottom-36 flex gap-base opacity-40 transition-all duration-500 group-hover:translate-x-0.5 group-hover:opacity-70">
    <div className="flex-1 space-y-2.5 overflow-hidden rounded-standard border border-line bg-bg-deep/30 p-base">
      {[100, 72, 88, 55, 80, 45].map((w, i) => (
        <div key={i} className="h-1.5 rounded-pill bg-line-medium" style={{ width: `${w}%`, opacity: i % 2 === 0 ? 0.5 : 0.25 }} />
      ))}
    </div>
    <div className="flex w-[30%] flex-col justify-center gap-2">
      {["Skills", "Tags", "Role"].map((tag) => (
        <div key={tag} className="rounded-micro border border-line-medium bg-surface px-base py-1.5 text-center shadow-sm">
          <span className="font-medium font-sans text-[8px] text-primary uppercase tracking-[0.1em]">{tag}</span>
        </div>
      ))}
    </div>
  </div>
);


const ImportPreview = () => (
  <div className="pointer-events-none absolute top-comfortable right-comfortable flex items-center gap-base opacity-50 transition-all duration-500 group-hover:opacity-80">
    <div className="flex size-9 items-center justify-center rounded-standard border border-line bg-surface shadow-sm">
      <div className="size-3.5 rounded-micro bg-status-success-bg border border-status-success-text/20" />
    </div>
    <div className="relative h-px w-12 bg-line-medium">
      <motion.div
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute -top-[3.5px] size-2 rounded-full bg-status-success-text shadow-[0_0_6px_rgba(26,112,85,0.35)]"
      />
    </div>
    <div className="flex size-10 items-center justify-center rounded-standard bg-primary shadow-md">
      <div className="size-4 rounded-full border-2 border-white/20" />
    </div>
  </div>
);


const DashboardPreview = () => (
  <div className="pointer-events-none absolute top-comfortable right-comfortable bottom-36 left-24 overflow-hidden rounded-standard border border-line-strong bg-surface opacity-50 transition-all duration-700 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 group-hover:opacity-90">
    <div className="flex h-10 items-center justify-between border-b border-line bg-bg px-comfortable">
      <div className="h-2 w-32 rounded-pill bg-line-medium opacity-50" />
      <div className="flex gap-1.5">
        <div className="size-4 rounded-micro bg-line opacity-40" />
        <div className="size-4 rounded-micro bg-line opacity-40" />
      </div>
    </div>
    <div className="space-y-base p-base">
      <div className="h-8 w-3/5 rounded-standard border border-line bg-bg-deep/30" />
      <div className="grid grid-cols-3 gap-base">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-standard border border-line border-dashed bg-bg-deep/10" />
        ))}
      </div>
    </div>
  </div>
);


type CellProps = {
  tag: string;
  title: string;
  desc: string;
  preview: React.ReactNode;
  colSpan: string;
  heroTitle?: boolean;
  delay?: number;
};

const BentoCell: React.FC<CellProps> = ({ tag, title, desc, preview, colSpan, heroTitle, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.9, delay }}
    className={cn(
      "group relative flex flex-col bg-surface transition-colors duration-300 hover:bg-bg-alt/40",
      colSpan,
    )}
  >
    {preview}
    <div className="relative z-10 mt-auto p-comfortable">
      <span className="mb-base block font-medium font-mono text-[10px] text-primary/30 uppercase tracking-widest">
        {tag}
      </span>
      <h3
        className={cn(
          "mb-micro font-serif text-primary leading-tight transition-colors group-hover:text-primary/70",
          heroTitle ? "text-[28px]" : "text-[22px]",
        )}
      >
        {title}
      </h3>
      <p className="font-light font-sans text-[13px] text-ink-muted leading-[1.65]">{desc}</p>
    </div>
  </motion.div>
);


export const Features: React.FC = () => {
  const cells: CellProps[] = [
    {
      tag: "02 / Technology",
      title: "Multi-model logic",
      desc: "Gemini 1.5 Pro analyzes candidate fit against technical requirements with layered evaluation.",
      preview: <ModelPreview />,
      colSpan: "md:col-span-6 min-h-[300px]",
      delay: 0.1,
    },
    {
      tag: "03 / Import",
      title: "Unified extraction",
      desc: "Extract and normalize complex skills from unstructured resume data automatically.",
      preview: <ParsingPreview />,
      colSpan: "md:col-span-6 min-h-[300px]",
      delay: 0.15,
    },
    {
      tag: "04 / Connectivity",
      title: "Deep integrations",
      desc: "Sync from Greenhouse, Lever, or upload board data in a single click.",
      preview: <ImportPreview />,
      colSpan: "md:col-span-4 min-h-[340px]",
      delay: 0.2,
    },
    {
      tag: "05 / Command",
      title: "Operational control",
      desc: "A high-fidelity cockpit to manage postings, track pipeline health, and audit every AI decision with full traceability.",
      preview: <DashboardPreview />,
      colSpan: "md:col-span-8 min-h-[340px]",
      delay: 0.25,
    },
  ];

  return (
    <section id="features">
      <div className="container-meridian">

        {/* Header */}
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
                System capabilities
              </span>
            </div>
            <h2 className="mb-small text-[42px] leading-[1.05]">
              Precision screening <br />
              <em className="font-light italic opacity-70">for elite teams.</em>
            </h2>
          </div>
          <p className="max-w-[360px] pb-micro font-light font-sans text-[15px] text-ink-muted leading-relaxed">
            Eliminate bias and manual overhead with an intelligent assistant that understands
            candidate quality as deeply as you do.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-[1px] overflow-hidden rounded-card border border-line bg-line md:grid-cols-12">

          {/* Hero cell — 01 AI Ranking */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="group relative flex min-h-[400px] flex-col bg-surface transition-colors duration-300 hover:bg-bg-alt/40 md:col-span-12"
          >
            <RankingPreview />
            <div className="relative z-10 mt-auto p-comfortable">
              <span className="mb-base block font-medium font-mono text-[10px] text-primary/30 uppercase tracking-widest">
                01 / AI ranking
              </span>
              <h3 className="mb-micro font-serif text-[32px] text-primary leading-tight transition-colors group-hover:text-primary/70">
                Explainable intent
              </h3>
              <p className="max-w-[500px] font-light font-sans text-[13px] text-ink-muted leading-[1.65]">
                Natural-language justifications for every ranking. Understand the "why" behind
                every shortlist with full contextual reasoning that adapts to your requirements.
              </p>
            </div>
          </motion.div>

          {/* Remaining cells */}
          {cells.map((cell) => (
            <BentoCell key={cell.tag} {...cell} />
          ))}

        </div>
      </div>
    </section>
  );
};