"use client";

import { motion } from "motion/react";
import type React from "react";
import { AIArchitecture } from "./neural-architecture";

export const ArchitectureSection: React.FC = () => {
  return (
    <section
      id="process"
      className="border-line border-y bg-bg-alt/30 py-section-padding"
    >
      <div className="container-meridian text-center lg:text-left">
        <div className="flex flex-col items-center justify-between gap-hero lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-[480px]"
          >
            <div className="mb-small">
              <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.1em]">
                The Architecture
              </span>
            </div>
            <h2 className="mb-section-gap text-[42px] leading-tight">
              How explainable <br />
              <em className="font-light text-brand-primary italic opacity-80">
                reasoning works.
              </em>
            </h2>

            <div className="space-y-medium text-left">
              {[
                {
                  step: "01",
                  title: "Smart Parsing",
                  body: "Resumes are analyzed for match quality, not just keywords.",
                },
                {
                  step: "02",
                  title: "Agent Reflection",
                  body: "AI agents debate candidate fit based on technical requirements.",
                },
                {
                  step: "03",
                  title: "Rationale Generation",
                  body: "Decisions are converted into human-readable rationale.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-base"
                >
                  <span className="mt-1 font-mono text-[11px] text-primary/30">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="mb-micro font-medium font-sans text-[15px] text-primary">
                      {item.title}
                    </h3>
                    <p className="font-light font-sans text-[14px] text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex aspect-square w-full max-w-[500px] flex-1 items-center justify-center overflow-hidden rounded-card border border-line bg-surface p-comfortable shadow-[0_30px_60px_-12px_rgba(0,0,0,0.02)]"
          >
            <AIArchitecture />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
