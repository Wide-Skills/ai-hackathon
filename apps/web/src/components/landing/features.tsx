"use client";

import { motion } from "framer-motion";
import type React from "react";
import { Card } from "@/components/ui/card";

const RankingPreview = () => {
  const candidates = [
    { initials: "SJ", name: "Sarah Jenkins",   score: 98, color: "text-success-foreground bg-success/10 border-success/20",  bar: "bg-success/60" },
    { initials: "MC", name: "Michael Chen",    score: 94, color: "text-info-foreground bg-info/10 border-info/20",            bar: "bg-info/60"    },
    { initials: "ER", name: "Elena Rodriguez", score: 89, color: "text-warning-foreground bg-warning/10 border-warning/20",   bar: "bg-warning/60" },
    { initials: "AL", name: "Alex Liu",        score: 81, color: "text-muted-foreground bg-muted/30 border-border",           bar: "bg-muted-foreground/30" },
  ];

  return (
    <div className="pointer-events-none absolute top-8 right-8 hidden w-[240px] space-y-2 lg:block">
      {candidates.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: i < 3 ? 1 : 0.4, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-2.5 shadow-sm"
        >
          <span className="min-w-[14px] text-center font-mono text-[10px] font-semibold text-muted-foreground/50">
            {i + 1}
          </span>
          <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border text-[9px] font-bold ${c.color}`}>
            {c.initials}
          </div>
          <p className="flex-1 text-[12px] font-medium text-foreground">{c.name}</p>
          <div className="flex flex-col items-end gap-1">
            <span className="font-display text-[13px] font-light leading-none text-foreground">
              {c.score}%
            </span>
            <div className="h-[2px] w-10 overflow-hidden rounded-full bg-foreground/6">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${c.score}%` }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.7 }}
                className={`h-full rounded-full ${c.bar}`}
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Reasoning bubble */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-xl border border-border bg-background p-3 shadow-sm"
      >
        <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          AI Reasoning
        </p>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          "Strong Python &amp; ML background. 4 yrs relevant exp. Exceeds seniority threshold."
        </p>
      </motion.div>
    </div>
  );
};


const ModelPreview = () => (
  <div className="pointer-events-none absolute inset-x-0 top-0 bottom-16 flex items-center justify-center opacity-70">
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center node */}
      <circle cx="80" cy="70" r="22" className="fill-info/10 stroke-info/30" strokeWidth="0.75" />
      <text x="80" y="67" textAnchor="middle" fontSize="9" fontWeight="600" className="fill-info" fontFamily="inherit">GEMINI</text>
      <text x="80" y="77" textAnchor="middle" fontSize="8" className="fill-muted-foreground" fontFamily="inherit">1.5 Pro</text>

      {/* Outer nodes */}
      <circle cx="24" cy="28"  r="14" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <text x="24" y="31" textAnchor="middle" fontSize="7.5" fontWeight="500" className="fill-muted-foreground" fontFamily="inherit">Resume</text>

      <circle cx="136" cy="28"  r="14" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <text x="136" y="31" textAnchor="middle" fontSize="7.5" fontWeight="500" className="fill-muted-foreground" fontFamily="inherit">JD</text>

      <circle cx="24" cy="112" r="14" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <text x="24" y="115" textAnchor="middle" fontSize="7.5" fontWeight="500" className="fill-muted-foreground" fontFamily="inherit">Skills</text>

      <circle cx="136" cy="112" r="14" className="fill-success/10 stroke-success/30" strokeWidth="0.5" />
      <text x="136" y="115" textAnchor="middle" fontSize="7.5" fontWeight="600" className="fill-success-foreground" fontFamily="inherit">Score</text>

      {/* Connector lines */}
      <line x1="37"  y1="38"  x2="62"  y2="54"  className="stroke-border" strokeWidth="0.5" />
      <line x1="123" y1="38"  x2="98"  y2="54"  className="stroke-border" strokeWidth="0.5" />
      <line x1="37"  y1="102" x2="62"  y2="84"  className="stroke-border" strokeWidth="0.5" />
      <line x1="98"  y1="84"  x2="123" y2="102" className="stroke-success/40" strokeWidth="0.75" strokeDasharray="3 2" />

      {/* Orbit ring */}
      <circle cx="80" cy="70" r="30" className="stroke-info/15" strokeWidth="0.5" strokeDasharray="4 4" fill="none" />
    </svg>
  </div>
);


const ParsingPreview = () => (
  <div className="pointer-events-none absolute inset-x-0 top-0 bottom-16 flex items-center justify-center opacity-75">
    <svg width="185" height="130" viewBox="0 0 185 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr-parse" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M1 1L6 4L1 7" fill="none" className="stroke-muted-foreground" strokeWidth="1.2" strokeLinecap="round" />
        </marker>
      </defs>

      {/* Document */}
      <rect x="4"  y="8"  width="78" height="108" rx="7" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <path d="M66 8 L82 24 L66 24 Z" className="fill-background stroke-border" strokeWidth="0.5" />

 
      <rect x="14" y="18" width="42" height="2.5" rx="1.25" className="fill-muted-foreground/20" />

 
      <rect x="14" y="30" width="52" height="2.5" rx="1.25" className="fill-info/50" />
      <rect x="14" y="38" width="34" height="2.5" rx="1.25" className="fill-muted-foreground/15" />
      <rect x="14" y="46" width="48" height="2.5" rx="1.25" className="fill-success/50" />
      <rect x="14" y="54" width="28" height="2.5" rx="1.25" className="fill-muted-foreground/15" />
      <rect x="14" y="62" width="52" height="2.5" rx="1.25" className="fill-warning/50" />
      <rect x="14" y="70" width="38" height="2.5" rx="1.25" className="fill-muted-foreground/15" />
      <rect x="14" y="78" width="44" height="2.5" rx="1.25" className="fill-muted-foreground/12" />
      <rect x="14" y="86" width="32" height="2.5" rx="1.25" className="fill-muted-foreground/12" />
      <rect x="14" y="94" width="48" height="2.5" rx="1.25" className="fill-muted-foreground/12" />

      {/* Arrow */}
      <path d="M90 64 L104 64" className="stroke-muted-foreground/40" strokeWidth="0.75" markerEnd="url(#arr-parse)" />

      {/* Extracted tags */}
      <rect x="108" y="28" width="62" height="17" rx="4.5" className="fill-info/10 stroke-info/30" strokeWidth="0.5" />
      <text x="139" y="40" textAnchor="middle" fontSize="8" fontWeight="500" className="fill-info-foreground" fontFamily="inherit">Python · 5yr</text>

      <rect x="108" y="51" width="62" height="17" rx="4.5" className="fill-success/10 stroke-success/30" strokeWidth="0.5" />
      <text x="139" y="63" textAnchor="middle" fontSize="8" fontWeight="500" className="fill-success-foreground" fontFamily="inherit">ML · Senior</text>

      <rect x="108" y="74" width="62" height="17" rx="4.5" className="fill-warning/10 stroke-warning/30" strokeWidth="0.5" />
      <text x="139" y="86" textAnchor="middle" fontSize="8" fontWeight="500" className="fill-warning-foreground" fontFamily="inherit">AWS · GCP</text>

      <rect x="108" y="97" width="62" height="17" rx="4.5" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <text x="139" y="109" textAnchor="middle" fontSize="8" className="fill-muted-foreground" fontFamily="inherit">Stanford · CS</text>
    </svg>
  </div>
);


const IngestionPreview = () => (
  <div className="pointer-events-none absolute inset-x-0 top-0 bottom-16 flex items-center justify-center opacity-75">
    <svg width="185" height="120" viewBox="0 0 185 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr-ing" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M1 1L6 4L1 7" fill="none" className="stroke-muted-foreground" strokeWidth="1.2" strokeLinecap="round" />
        </marker>
        <marker id="arr-ing-success" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M1 1L6 4L1 7" fill="none" className="stroke-success" strokeWidth="1.2" strokeLinecap="round" />
        </marker>
      </defs>

      {/* Sources */}
      <rect x="2"  y="14" width="50" height="26" rx="6" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <text x="27" y="26" textAnchor="middle" fontSize="7.5" fontWeight="600" className="fill-foreground" fontFamily="inherit">ATS</text>
      <text x="27" y="35" textAnchor="middle" fontSize="7"   className="fill-muted-foreground" fontFamily="inherit">Greenhouse</text>

      <rect x="2"  y="48" width="50" height="26" rx="6" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <text x="27" y="60" textAnchor="middle" fontSize="7.5" fontWeight="600" className="fill-foreground" fontFamily="inherit">CSV</text>
      <text x="27" y="69" textAnchor="middle" fontSize="7"   className="fill-muted-foreground" fontFamily="inherit">Spreadsheet</text>

      <rect x="2"  y="82" width="50" height="22" rx="6" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <text x="27" y="97" textAnchor="middle" fontSize="7.5" fontWeight="600" className="fill-foreground" fontFamily="inherit">PDF</text>

      {/* Connectors to hub */}
      <path d="M52 27 Q74 27 74 54" className="stroke-muted-foreground/40" strokeWidth="0.6" fill="none" markerEnd="url(#arr-ing)" />
      <path d="M52 61 L70 61"        className="stroke-muted-foreground/40" strokeWidth="0.6" fill="none" markerEnd="url(#arr-ing)" />
      <path d="M52 93 Q74 93 74 74"  className="stroke-muted-foreground/40" strokeWidth="0.6" fill="none" markerEnd="url(#arr-ing)" />

      {/* Hub */}
      <rect x="72" y="44" width="40" height="42" rx="8" className="fill-info/10 stroke-info/30" strokeWidth="0.6" />
      <text x="92" y="64" textAnchor="middle" fontSize="7.5" fontWeight="600" className="fill-info-foreground" fontFamily="inherit">INGEST</text>
      <text x="92" y="75" textAnchor="middle" fontSize="7"   className="fill-muted-foreground" fontFamily="inherit">Engine</text>

   
      <path d="M112 65 L128 65" className="stroke-success/60" strokeWidth="0.75" fill="none" markerEnd="url(#arr-ing-success)" />

      <rect x="130" y="47" width="50" height="38" rx="6" className="fill-success/10 stroke-success/30" strokeWidth="0.6" />
      <ellipse cx="155" cy="47" rx="25" ry="5" className="fill-success/10 stroke-success/30" strokeWidth="0.6" />
      <text x="155" y="69" textAnchor="middle" fontSize="7.5" fontWeight="600" className="fill-success-foreground" fontFamily="inherit">Unified</text>
      <text x="155" y="79" textAnchor="middle" fontSize="7"   className="fill-muted-foreground" fontFamily="inherit">Database</text>
    </svg>
  </div>
);

const DashboardPreview = () => (
  <div className="pointer-events-none absolute top-6 right-6 hidden w-[290px] lg:block opacity-80">
    <svg width="290" height="180" viewBox="0 0 290 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Metric cards */}
      <rect x="0"   y="0" width="86" height="46" rx="7" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <text x="10"  y="14" fontSize="8" fontWeight="500" className="fill-muted-foreground" fontFamily="inherit">Screened</text>
      <text x="10"  y="36" fontSize="20" fontWeight="300" className="fill-foreground"        fontFamily="inherit">1,284</text>

      <rect x="94"  y="0" width="86" height="46" rx="7" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <text x="104" y="14" fontSize="8" fontWeight="500" className="fill-muted-foreground"  fontFamily="inherit">Shortlisted</text>
      <text x="104" y="36" fontSize="20" fontWeight="300" className="fill-success-foreground" fontFamily="inherit">47</text>

      <rect x="188" y="0" width="102" height="46" rx="7" className="fill-secondary stroke-border" strokeWidth="0.5" />
      <text x="198" y="14" fontSize="8" fontWeight="500" className="fill-muted-foreground"  fontFamily="inherit">Avg. Match</text>
      <text x="198" y="36" fontSize="20" fontWeight="300" className="fill-info-foreground"   fontFamily="inherit">87.4%</text>

      {/* Chart label */}
      <text x="0" y="66" fontSize="8" fontWeight="500" className="fill-muted-foreground" fontFamily="inherit">Weekly applicants</text>

      {/* Bars */}
      <rect x="0"   y="120" width="28" height="44" rx="3" className="fill-info/20" />
      <rect x="36"  y="100" width="28" height="64" rx="3" className="fill-info/30" />
      <rect x="72"  y="110" width="28" height="54" rx="3" className="fill-info/25" />
      <rect x="108" y="80"  width="28" height="84" rx="3" className="fill-success/55" />
      <rect x="144" y="92"  width="28" height="72" rx="3" className="fill-info/30" />
      <rect x="180" y="102" width="28" height="62" rx="3" className="fill-info/20" />
      <rect x="216" y="88"  width="28" height="76" rx="3" className="fill-info/28" />
      <rect x="252" y="97"  width="28" height="67" rx="3" className="fill-info/22" />

      <text x="14"  y="176" textAnchor="middle" fontSize="8" className="fill-muted-foreground/60" fontFamily="inherit">M</text>
      <text x="50"  y="176" textAnchor="middle" fontSize="8" className="fill-muted-foreground/60" fontFamily="inherit">T</text>
      <text x="86"  y="176" textAnchor="middle" fontSize="8" className="fill-muted-foreground/60" fontFamily="inherit">W</text>
      <text x="122" y="176" textAnchor="middle" fontSize="8" fontWeight="600" className="fill-success-foreground" fontFamily="inherit">T</text>
      <text x="158" y="176" textAnchor="middle" fontSize="8" className="fill-muted-foreground/60" fontFamily="inherit">F</text>
      <text x="194" y="176" textAnchor="middle" fontSize="8" className="fill-muted-foreground/60" fontFamily="inherit">S</text>
      <text x="230" y="176" textAnchor="middle" fontSize="8" className="fill-muted-foreground/60" fontFamily="inherit">S</text>
      <text x="266" y="176" textAnchor="middle" fontSize="8" className="fill-muted-foreground/60" fontFamily="inherit">M</text>

      <line x1="0" y1="165" x2="290" y2="165" className="stroke-border" strokeWidth="0.5" />
    </svg>
  </div>
);

export const Features: React.FC = () => {
  const cardMotion = (delay = 0) => ({
    initial: { opacity: 0, y: 16, scale: 0.99 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

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

        <div className="grid auto-rows-[280px] grid-cols-1 gap-4 md:grid-cols-12">

          <motion.div {...cardMotion(0)} className="group relative md:col-span-8 md:row-span-2">
            <Card variant="premium" className="relative flex h-full w-full flex-col justify-end overflow-hidden p-10">
              <RankingPreview />
              <div className="relative z-10 max-w-[380px]">
                <h3 className="mb-3 font-display font-light text-display-card text-foreground tracking-tight">
                  Explainable AI Ranking
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed tracking-[0.1px]">
                  Natural-language justifications for every ranking. Understand
                  the "why" behind every shortlist with full reasoning.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div {...cardMotion(0.06)} className="group md:col-span-4">
            <Card variant="premium" className="relative flex h-full w-full flex-col justify-end overflow-hidden p-8">
              <ModelPreview />
              <div className="relative z-10">
                <h3 className="mb-2 font-display font-light text-display-card text-foreground tracking-tight">
                  Multi-Model Analysis
                </h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed tracking-[0.05px]">
                  Gemini 1.5 Pro analyzes candidate profiles against job
                  requirements with deep contextual understanding.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div {...cardMotion(0.12)} className="group md:col-span-4">
            <Card variant="premium" className="relative flex h-full w-full flex-col justify-end overflow-hidden p-8">
              <ParsingPreview />
              <div className="relative z-10">
                <h3 className="mb-2 font-display font-light text-display-card text-foreground tracking-tight">
                  Unstructured Parsing
                </h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed tracking-[0.05px]">
                  Extract and normalize skills from messy PDFs, spreadsheets,
                  and external resumes automatically.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div {...cardMotion(0.18)} className="group md:col-span-4">
            <Card variant="premium" className="relative flex h-full w-full flex-col justify-end overflow-hidden p-8">
              <IngestionPreview />
              <div className="relative z-10">
                <h3 className="mb-2 font-display font-light text-display-card text-foreground tracking-tight">
                  Unified Ingestion
                </h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed tracking-[0.05px]">
                  Sync from your ATS or upload external job board data in one
                  click. One pipeline, every source.
                </p>
              </div>
            </Card>
          </motion.div>

      
          <motion.div {...cardMotion(0.24)} className="group md:col-span-8">
            <Card variant="premium" className="relative flex h-full w-full flex-col justify-end overflow-hidden p-10">
              <DashboardPreview />
              <div className="relative z-10 max-w-[260px]">
                <h3 className="mb-3 font-display font-light text-display-card text-foreground tracking-tight">
                  Recruiter Dashboard
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed tracking-[0.1px]">
                  A high-fidelity interface for decision-makers. Manage
                  postings, track pipeline health, and visualize shortlists.
                </p>
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  );
};