"use client";

import type React from "react";

const _stats = [
  { label: "Hours Saved", value: "400+", description: "per recruitment cycle" },
  {
    label: "Match Accuracy",
    value: "94%",
    description: "verified by human experts",
  },
  { label: "Global Reach", value: "50+", description: "countries represented" },
  { label: "Cost Reduction", value: "60%", description: "on average per hire" },
];

export const TrustStats: React.FC = () => {
  return (
    <section className="border-line border-y bg-bg-alt/10 py-section-padding">
      <div className="container-meridian">
        <div className="flex flex-col items-start justify-between gap-hero lg:flex-row">
          <div className="max-w-[480px]">
            <div className="mb-small">
              <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.06em]">
                Scale
              </span>
            </div>
            <h2 className="mb-small text-[42px] leading-[1.05]">
              Intelligence <br />
              <em className="font-light italic opacity-80">
                engineered for scale.
              </em>
            </h2>
            <p className="font-light font-sans text-[15px] text-ink-muted leading-relaxed">
              We've built a high-throughput architecture that processes
              thousands of resumes without sacrificing the "why" behind every
              decision.
            </p>
          </div>

          <div className="grid w-full max-w-[600px] flex-1 grid-cols-2 gap-[1px] overflow-hidden rounded-card border border-line bg-line shadow-sm">
            {[
              {
                label: "Analytic Velocity",
                value: "0.8s",
                suffix: "per analysis",
              },
              {
                label: "Resonance Accuracy",
                value: "94.8%",
                suffix: "human-verified",
              },
              {
                label: "Efficiency Gain",
                value: "10x",
                suffix: "faster shortlist",
              },
              {
                label: "Cost Efficiency",
                value: "60%",
                suffix: "avg reduction",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-surface p-comfortable transition-colors duration-200 hover:bg-bg-alt/30"
              >
                <p className="mb-comfortable font-medium font-sans text-[10px] text-primary/40 uppercase tracking-[0.1em]">
                  {stat.label}
                </p>
                <div className="mb-micro flex items-baseline gap-micro">
                  <p className="font-serif text-[36px] text-primary leading-none">
                    {stat.value}
                  </p>
                </div>
                <p className="font-light font-sans text-[12px] text-ink-muted">
                  {stat.suffix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
