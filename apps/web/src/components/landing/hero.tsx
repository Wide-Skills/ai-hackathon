"use client";

import {
  RiMoreLine,
  RiSearchLine,
  RiUserLine,
} from "@remixicon/react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import type React from "react";
import { Badge } from "@/components/ui/badge";

const AppPreview = () => {
  const { scrollYProgress } = useScroll();

  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0.4, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.2], [30, 0]);
  const clipProgress = useTransform(scrollYProgress, [0, 0.3], [80, 0]);

  return (
    <motion.div
      style={{
        scale,
        opacity,
        y: translateY,
        clipPath: `inset(${clipProgress}% 0% 0% 0% rounded 12px)`,
      }}
      className="group relative mx-auto mt-16 w-full max-w-[1240px]"
    >
      <div className="absolute -inset-10 -z-10 rounded-[40px] bg-foreground/[0.01] blur-[120px]" />
      <div className="overflow-hidden rounded-[12px] border border-border bg-background shadow-[0_40px_80px_rgba(0,0,0,0.03)]">
        <div className="flex h-10 items-center justify-between border-border border-b bg-secondary/50 px-6">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-foreground/5" />
            <div className="h-2 w-2 rounded-full bg-foreground/5" />
            <div className="h-2 w-2 rounded-full bg-foreground/5" />
          </div>
          <div className="h-4 w-40 rounded bg-foreground/[0.02]" />
          <div className="w-8" />
        </div>

        <div className="flex h-[520px]">
          <div className="hidden w-[200px] border-border border-r bg-background p-6 lg:block">
            <div className="mb-10 flex items-center gap-2.5">
              <div className="h-5 w-5 rounded bg-foreground/5" />
              <div className="h-1.5 w-16 rounded-full bg-foreground/10" />
            </div>
            <div className="space-y-6">
              {[true, false, false, false].map((active, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div
                    className={`h-3.5 w-3.5 rounded ${active ? "bg-info/10" : "bg-foreground/5"}`}
                  />
                  <div
                    className={`h-1 rounded-full ${active ? "bg-info/20" : "bg-foreground/5"} w-20`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col bg-secondary/20">
            <div className="flex h-[60px] items-center justify-between border-border border-b bg-background px-8">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-foreground/[0.015] px-3 py-1.5">
                <RiSearchLine className="h-3 w-3 text-muted-foreground/40" />
                <div className="h-1 w-32 rounded-full bg-foreground/5" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-7 w-7 rounded-full border border-border bg-secondary" />
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-8 lg:p-10">
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <h3 className="mb-1 font-display font-light text-[26px] text-foreground tracking-tight">
                    Technical Shortlist
                  </h3>
                  <p className="text-[13px] text-muted-foreground">
                    Senior Machine Learning Engineer • 2,408 Applicants
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    name: "Sarah Jenkins",
                    role: "AI & Neural Networks",
                    score: "98.4",
                    match: "Matched",
                    variant: "success",
                  },
                  {
                    name: "Michael Chen",
                    role: "Distributed Systems Lead",
                    score: "94.1",
                    match: "Matched",
                    variant: "info",
                  },
                  {
                    name: "Elena Rodriguez",
                    role: "Product Engineering",
                    score: "89.8",
                    match: "Matched",
                    variant: "warning",
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-[12px] border border-border bg-background p-5 shadow-[0_1px_4px_rgba(0,0,0,0.01)] transition-all hover:border-foreground/5"
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary">
                        <RiUserLine className="h-4 w-4 text-muted-foreground/30" />
                      </div>
                      <div>
                        <p className="font-medium text-[14px] text-foreground tracking-tight">
                          {c.name}
                        </p>
                        <p className="text-[12px] text-muted-foreground">
                          {c.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="hidden text-right sm:block">
                        <Badge
                          variant={c.variant as any}
                          size="xs"
                          uppercase
                          className="mb-1.5 border-border/10 px-2 py-0.5 shadow-sm"
                        >
                          {c.match}
                        </Badge>
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-foreground/[0.02]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${c.score}%` }}
                            transition={{ delay: 1 + i * 0.1, duration: 1 }}
                            className={`h-full ${i === 0 ? "bg-success/30" : i === 1 ? "bg-info/30" : "bg-warning/30"}`}
                          />
                        </div>
                      </div>
                      <div className="flex min-w-[70px] items-center justify-end gap-2">
                        <span className="font-display font-light text-[20px] text-foreground tracking-tighter">
                          {c.score}
                        </span>
                        <span className="text-[11px] text-muted-foreground/50">
                          %
                        </span>
                      </div>
                      <RiMoreLine className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Hero: React.FC = () => {
  return (
    <section className="relative flex min-h-screen flex-col items-center overflow-hidden bg-white pt-52 pb-24 text-foreground">
      <div className="container-tight relative z-20">
        <div className="mx-auto max-w-[800px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <h1 className="font-display font-light text-[48px] text-primary leading-[1.02] tracking-[-0.03em] md:text-display-hero">
              Screening with <br />
              <span className="text-primary">Explainable Intent.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-12 max-w-[580px] font-normal text-[18px] text-black leading-[1.55] tracking-[0.1px] antialiased"
          >
            The world's first recruitment platform that justifies its choices.
            Built for recruiters who value precision over the black box.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-5"
          >
            <Link href="/auth">
              <button className="h-[48px] rounded-full border border-primary bg-primary px-7 text-[15px] text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl">
                Start Screening Now
              </button>
            </Link>

            <Link href="/dashboard">
              <button className="h-[48px] rounded-full border border-primary bg-white px-7 text-[15px] text-primary shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
                View Product Showcase
              </button>
            </Link>
          </motion.div>
        </div>

        <AppPreview />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-32 flex flex-col items-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            {[
              {
                label: "Precision",
                val: "98.2% Accurate Parsing",
                color: "text-primary",
              },
              {
                label: "Intelligence",
                val: "Gemini 1.5 Pro Powered",
                color: "text-primary",
              },
              {
                label: "Trust",
                val: "Explainable Reasoning",
                color: "text-primary",
              },
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span
                  className={`font-bold text-[10px] uppercase tracking-[0.2em] ${m.color}`}
                >
                  {m.label}
                </span>
                <span className="font-display font-light text-[16px] text-black">
                  {m.val}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
