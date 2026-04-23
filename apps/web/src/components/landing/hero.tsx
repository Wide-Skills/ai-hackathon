"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, User2, Search, MoreHorizontal } from "lucide-react";

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
        clipPath: `inset(${clipProgress}% 0% 0% 0% rounded 12px)` 
      }}
      className="relative mt-16 w-full max-w-[1240px] mx-auto group"
    >
      <div className="absolute -inset-10 bg-foreground/[0.01] rounded-[40px] blur-[120px] -z-10" />
      <div className="bg-background rounded-[12px] border border-border shadow-[0_40px_80px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="h-10 border-b border-border flex items-center justify-between px-6 bg-secondary/50">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-foreground/5" />
            <div className="h-2 w-2 rounded-full bg-foreground/5" />
            <div className="h-2 w-2 rounded-full bg-foreground/5" />
          </div>
          <div className="h-4 w-40 bg-foreground/[0.02] rounded" />
          <div className="w-8" />
        </div>

        <div className="flex h-[520px]">
          <div className="w-[200px] border-r border-border p-6 hidden lg:block bg-background">
            <div className="flex items-center gap-2.5 mb-10">
               <div className="h-5 w-5 rounded bg-foreground/5" />
               <div className="h-1.5 w-16 bg-foreground/10 rounded-full" />
            </div>
            <div className="space-y-6">
              {[true, false, false, false].map((active, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className={`h-3.5 w-3.5 rounded ${active ? 'bg-info/10' : 'bg-foreground/5'}`} />
                  <div className={`h-1 rounded-full ${active ? 'bg-info/20' : 'bg-foreground/5'} w-20`} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-secondary/20">
            <div className="h-[60px] border-b border-border px-8 flex items-center justify-between bg-background">
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-foreground/[0.015] border border-border">
                <Search className="h-3 w-3 text-muted-foreground/40" />
                <div className="h-1 w-32 bg-foreground/5 rounded-full" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-7 w-7 rounded-full bg-secondary border border-border" />
              </div>
            </div>

            <div className="p-8 lg:p-10 flex-1 overflow-hidden">
              <div className="mb-10 flex items-end justify-between">
                <div>
             
                  <h3 className="font-display text-[26px] font-light text-foreground mb-1 tracking-tight">Technical Shortlist</h3>
                  <p className="text-[13px] text-muted-foreground">Senior Machine Learning Engineer • 2,408 Applicants</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: "Sarah Jenkins", role: "AI & Neural Networks", score: "98.4", match: "Matched", color: "text-success-foreground bg-success/5 border-success/10" },
                  { name: "Michael Chen", role: "Distributed Systems Lead", score: "94.1", match: "Matched", color: "text-info-foreground bg-info/5 border-info/10" },
                  { name: "Elena Rodriguez", role: "Product Engineering", score: "89.8", match: "Matched", color: "text-warning-foreground bg-warning/5 border-warning/10" }
                ].map((c, i) => (
                  <div 
                    key={i}
                    className="bg-background p-5 rounded-[12px] border border-border flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.01)] transition-all hover:border-foreground/5"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                        <User2 className="h-4 w-4 text-muted-foreground/30" />
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-foreground tracking-tight">{c.name}</p>
                        <p className="text-[12px] text-muted-foreground">{c.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right hidden sm:block">
                         <div className={`text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 rounded border mb-1.5 ${c.color}`}>{c.match}</div>
                         <div className="h-1 w-16 bg-foreground/[0.02] rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${c.score}%` }}
                              transition={{ delay: 1 + (i * 0.1), duration: 1 }}
                              className={`h-full ${i === 0 ? 'bg-success/30' : i === 1 ? 'bg-info/30' : 'bg-warning/30'}`} 
                            />
                         </div>
                      </div>
                      <div className="flex items-center gap-2 min-w-[70px] justify-end">
                         <span className="font-display text-[20px] font-light text-foreground tracking-tighter">{c.score}</span>
                         <span className="text-[11px] text-muted-foreground/50">%</span>
                      </div>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground/50" />
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
    <section className="relative min-h-screen flex flex-col items-center pt-48 pb-24 overflow-hidden bg-secondary/30">
      <div className="container-tight relative z-20">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <h1 className="font-display text-foreground text-[48px] md:text-display-hero font-light leading-[1.02] tracking-[-0.03em]">
              Screening with <br />
              <span className="text-muted-foreground">Explainable Intent.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-muted-foreground mb-12 max-w-[580px] mx-auto text-[18px] font-normal leading-[1.55] tracking-[0.1px] antialiased"
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
            <button className="btn-pill-primary h-[52px] px-10 text-[15px]">
              <span>Start Screening Now</span>
              <ArrowRight className="ml-2 h-4 w-4 opacity-40 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="border shadow-sm rounded-full h-[52px] px-10 text-[15px]">
               <span>View Product Showcase</span>
               {/* <div className="ml-4 h-1.5 w-1.5 rounded-full bg-foreground/10" /> */}
            </button>
          </motion.div>
        </div>

        <AppPreview />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-32 flex flex-col items-center"
        >
          <div className="flex flex-wrap gap-x-16 gap-y-8 items-center justify-center">
            {[
              { label: "Precision", val: "98.2% Accurate Parsing", color: "text-success" },
              { label: "Intelligence", val: "Gemini 1.5 Pro Powered", color: "text-info" },
              { label: "Trust", val: "Explainable Reasoning", color: "text-warning" }
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${m.color}`}>{m.label}</span>
                <span className="text-[16px] text-foreground font-light font-display">{m.val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
