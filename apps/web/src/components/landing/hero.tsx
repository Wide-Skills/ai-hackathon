"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { HiringPipeline } from "./hiring-pipeline";

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-hero pb-section-padding">
      <div className="container-meridian">
        <div className="flex flex-col items-center gap-hero lg:flex-row">
          {/* Content side */}
          <div className="max-w-[500px] flex-[0.8]">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-base">
                <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.1em]">
                  The New Standard
                </span>
              </div>
              <h1 className="mb-base text-[42px] leading-[0.95] tracking-[-0.03em] md:text-[72px]">
                Recruitment <br />
                <em className="font-light text-brand-primary italic opacity-80">
                  Engineered.
                </em>
              </h1>
              <p className="mb-section-gap font-light font-sans text-[15px] text-ink-muted leading-[1.6] md:text-[17px]">
                The world's first high-fidelity screening engine that justifies
                its intent. Discover the top 1% with human-readable rationale.
              </p>

              <div className="flex flex-wrap items-center gap-base">
                <Button
                  render={<Link href="/auth" />}
                  variant="default"
                  size="lg"
                  className="h-11 rounded-standard px-8 shadow-[0_10px_20px_-10px_rgba(25,40,64,0.3)] transition-transform hover:-translate-y-0.5"
                >
                  Start Screening
                </Button>
                <Button
                  render={<Link href="/dashboard" />}
                  variant="secondary"
                  size="lg"
                  className="h-11 rounded-standard px-8"
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Visualization side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-1"
          >
            <HiringPipeline />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-hero border-line border-t pt-section-gap"
        >
          <div className="mb-section-gap grid grid-cols-1 gap-comfortable md:grid-cols-3">
            {[
              { label: "Precision", val: "98.2% Match Accuracy" },
              { label: "Intelligence", val: "LLM Reflection Layer" },
              { label: "Trust", val: "Explainable Rationales" },
            ].map((m, i) => (
              <div key={i} className="flex flex-col gap-micro">
                <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.1em]">
                  {m.label}
                </span>
                <span className="font-serif text-[22px] text-primary">
                  {m.val}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-comfortable opacity-40 mix-blend-multiply grayscale md:flex-row">
            <span className="px-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
              Empowering Rwanda's top organizations
            </span>
            <div className="flex flex-wrap items-center gap-comfortable">
              {["BK Group", "Irembo", "MTN Rwanda", "Mara", "RDB"].map(
                (logo) => (
                  <span
                    key={logo}
                    className="cursor-default font-bold font-sans text-[18px] tracking-tighter transition-opacity hover:opacity-100"
                  >
                    {logo}
                  </span>
                ),
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
