"use client";

import { RiMoreLine, RiSearchLine } from "@remixicon/react";
import { motion } from "motion/react";
import type React from "react";

export const AppPreview: React.FC = () => {
  return (
    <section className="border-line border-t py-section-padding">
      <div className="container-meridian">
        <div className="mb-section-gap max-w-[500px]">
          <div className="mb-small">
            <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.06em]">
              The Interface
            </span>
          </div>
          <h2 className="mb-small text-[42px] leading-[1.05]">
            Operational <br />
            <em className="font-light italic opacity-80">high-fidelity.</em>
          </h2>
          <p className="font-light font-sans text-[15px] text-ink-muted leading-relaxed">
            A high-fidelity cockpit designed for recruitment leads who value
            simplicity, speed, and absolute decision clarity.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-card border border-line bg-line p-[1px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)]"
        >
          <div className="overflow-hidden rounded-[11px] bg-surface">
            {/* Window Chrome */}
            <div className="flex h-10 items-center justify-between border-line border-b bg-bg px-base">
              <div className="flex gap-small">
                <div className="size-2 rounded-full bg-line" />
                <div className="size-2 rounded-full bg-line" />
                <div className="size-2 rounded-full bg-line" />
              </div>
              <div className="h-3.5 w-40 rounded-pill border border-line bg-bg-deep/50" />
              <div className="size-4 rounded-micro border border-line bg-bg-deep/50" />
            </div>

            <div className="flex h-[560px] flex-col divide-x divide-line lg:flex-row">
              {/* Navigation Rail */}
              <div className="hidden w-56 flex-col space-y-comfortable bg-bg/20 p-medium lg:flex">
                <div className="space-y-base">
                  <p className="font-medium font-sans text-[9px] text-ink-faint uppercase tracking-[0.1em]">
                    Navigation
                  </p>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-base">
                      <div className="size-4 rounded-micro border border-line bg-bg-deep/40" />
                      <div className="h-1.5 w-24 rounded-pill bg-bg-deep/40" />
                    </div>
                  ))}
                </div>
                <div className="space-y-base border-line border-t pt-comfortable">
                  <p className="font-medium font-sans text-[9px] text-ink-faint uppercase tracking-[0.1em]">
                    Channels
                  </p>
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-base">
                      <div className="size-3 rounded-full border border-line bg-primary/10" />
                      <div className="h-1.5 w-20 rounded-pill bg-bg-deep/40" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Workspace */}
              <div className="flex flex-1 flex-col overflow-hidden bg-surface">
                <div className="flex h-[64px] items-center justify-between border-line border-b px-comfortable">
                  <div className="flex items-center gap-base rounded-standard border border-line bg-bg/30 px-base py-2">
                    <RiSearchLine className="size-3.5 text-ink-faint" />
                    <div className="h-2 w-48 rounded-pill bg-bg-deep/40" />
                  </div>
                  <div className="flex items-center gap-base">
                    <div className="h-1.5 w-16 rounded-pill bg-bg-deep/40" />
                    <div className="size-8 rounded-full border border-line bg-bg-deep" />
                  </div>
                </div>

                <div className="flex-1 space-y-hero overflow-hidden p-comfortable">
                  <div className="flex items-end justify-between border-line border-b pb-comfortable">
                    <div>
                      <h3 className="mb-micro font-serif text-[28px] text-primary leading-none">
                        Market Expansion Lead
                      </h3>
                      <p className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-wider">
                        Berlin · 1,284 Analyzed
                      </p>
                    </div>
                    <div className="flex gap-base">
                      <div className="flex h-8 items-center rounded-standard border border-line bg-bg/50 px-4">
                        <div className="h-1.5 w-12 rounded-pill bg-ink-faint" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-base">
                    {[
                      {
                        name: "Sarah Jenkins",
                        score: 98,
                        role: "Principal Engineering",
                        tag: "Strong Hire",
                      },
                      {
                        name: "Michael Chen",
                        score: 94,
                        role: "Infrastructure Lead",
                        tag: "Hire",
                      },
                      {
                        name: "Elena Rodriguez",
                        score: 89,
                        role: "AI Systems",
                        tag: "Consider",
                      },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="flex cursor-default items-center justify-between rounded-standard border border-line bg-surface p-comfortable transition-colors hover:bg-bg/10"
                      >
                        <div className="flex items-center gap-comfortable">
                          <div className="flex size-11 items-center justify-center rounded-micro border border-line bg-bg-deep font-bold font-mono text-[11px] text-ink-faint">
                            {c.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="mb-1.5 font-medium font-sans text-[15px] text-ink-full leading-none">
                              {c.name}
                            </p>
                            <div className="flex items-center gap-base">
                              <p className="font-light font-sans text-[13px] text-ink-muted">
                                {c.role}
                              </p>
                              <div className="size-1 rounded-full bg-line" />
                              <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-wider">
                                {c.tag}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-hero">
                          <div className="text-right">
                            <p className="mb-1.5 font-serif text-[20px] text-primary leading-none">
                              {c.score}%
                            </p>
                            <div className="h-0.5 w-20 overflow-hidden rounded-pill bg-line">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${c.score}%` }}
                              />
                            </div>
                          </div>
                          <RiMoreLine className="size-4 text-ink-faint" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
