"use client";

import { motion } from "framer-motion";
import type React from "react";

const stats = [
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
    <section className="border-border/10 border-t bg-secondary/10 py-[100px]">
      <div className="container-tight">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center"
            >
              <p className="mb-2 font-bold text-[10px] text-muted-foreground/40 uppercase tracking-[0.25em]">
                {stat.label}
              </p>
              <h3 className="mb-3 font-display font-light text-[42px] text-foreground leading-none tracking-tighter">
                {stat.value}
              </h3>
              <p className="mx-auto max-w-[120px] font-medium text-[12px] text-muted-foreground/60 leading-snug tracking-tight">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
