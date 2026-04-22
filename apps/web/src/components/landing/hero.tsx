"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, User2, Search, MoreHorizontal } from "lucide-react";

const AppPreview = () => {
  const { scrollYProgress } = useScroll();
  
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0.4, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.2], [40, 0]);
  const clipProgress = useTransform(scrollYProgress, [0, 0.3], [80, 0]);

  return (
    <motion.div
      style={{ 
        scale, 
        opacity, 
        y: translateY,
        clipPath: `inset(${clipProgress}% 0% 0% 0% rounded 24px)` 
      }}
      className="relative mt-20 w-full max-w-[1360px] mx-auto group"
    >
      <div className="absolute -inset-10 bg-foreground/[0.01] rounded-[40px] blur-[120px] -z-10" />
      
      <div className="bg-background rounded-[24px] border border-border shadow-[0_48px_96px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="h-12 border-b border-border flex items-center justify-between px-8 bg-secondary/50">
          <div className="flex gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-foreground/5" />
            <div className="h-2.5 w-2.5 rounded-full bg-foreground/5" />
            <div className="h-2.5 w-2.5 rounded-full bg-foreground/5" />
          </div>
          <div className="h-5 w-48 bg-foreground/[0.03] rounded-lg" />
          <div className="w-8" />
        </div>

        <div className="flex h-[640px]">
          <div className="w-[240px] border-r border-border p-8 hidden lg:block bg-background">
            <div className="flex items-center gap-3 mb-12">
               <div className="h-6 w-6 rounded bg-foreground/5" />
               <div className="h-2 w-20 bg-foreground/10 rounded-full" />
            </div>
            <div className="space-y-8">
              {[
                { label: 'Dashboard', active: true },
                { label: 'Job Postings', active: false },
                { label: 'Talent Pool', active: false },
                { label: 'Analytics', active: false },
                { label: 'Settings', active: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded ${item.active ? 'bg-foreground/10' : 'bg-foreground/5'}`} />
                  <div className={`h-1.5 rounded-full ${item.active ? 'bg-foreground/20' : 'bg-foreground/5'} w-24`} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-secondary/30">
            <div className="h-[72px] border-b border-border px-10 flex items-center justify-between bg-background">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-foreground/[0.02] border border-border">
                  <Search className="h-3.5 w-3.5 text-muted-foreground/50" />
                  <div className="h-1.5 w-48 bg-foreground/5 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-foreground/5 shadow-sm" />)}
                </div>
                <div className="h-9 w-9 rounded-full bg-foreground/5 border border-border" />
              </div>
            </div>

            <div className="p-10 lg:p-12 flex-1 overflow-hidden">
              <div className="mb-14 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Active Candidate Ranking</span>
                  </div>
                  <h3 className="font-display text-[32px] font-light text-foreground mb-1.5 tracking-tight">Technical Shortlist</h3>
                  <p className="text-[14px] text-muted-foreground font-medium">Senior Machine Learning Engineer • 2,408 Applicants</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Sarah Jenkins", role: "AI & Neural Networks", score: "98.4", match: "Matched", color: "text-foreground bg-foreground/[0.03] border-border" },
                  { name: "Michael Chen", role: "Distributed Systems Lead", score: "94.1", match: "Matched", color: "text-foreground bg-foreground/[0.03] border-border" },
                  { name: "Elena Rodriguez", role: "Product Engineering", score: "89.8", match: "Matched", color: "text-foreground bg-foreground/[0.03] border-border" }
                ].map((c, i) => (
                  <div 
                    key={i}
                    className="bg-background p-6 rounded-[16px] border border-border flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all hover:border-foreground/10"
                  >
                    <div className="flex items-center gap-6">
                      <div className="h-11 w-11 rounded-full bg-secondary flex items-center justify-center border border-border">
                        <User2 className="h-4 w-4 text-muted-foreground/30" />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-foreground mb-0.5 tracking-tight">{c.name}</p>
                        <p className="text-[13px] text-muted-foreground font-medium tracking-tight">{c.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-right hidden sm:block">
                         <div className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-md mb-2 border ${c.color}`}>{c.match}</div>
                         <div className="h-1.5 w-24 bg-foreground/[0.02] rounded-full overflow-hidden">
                            <div className="h-full bg-foreground/10" style={{ width: `${c.score}%` }} />
                         </div>
                      </div>
                      <div className="flex items-center gap-2 min-w-[80px] justify-end">
                         <span className="font-display text-[24px] font-light text-foreground tracking-tighter">{c.score}</span>
                         <span className="text-[12px] text-muted-foreground/50 font-bold">%</span>
                      </div>
                      <button className="h-8 w-8 rounded-full hover:bg-foreground/[0.03] flex items-center justify-center transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground/50" />
                      </button>
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
    <section className="relative min-h-screen flex flex-col items-center pt-32 pb-32 overflow-hidden bg-secondary/50">
      <div className="container-tight relative z-20">
        <div className="max-w-[1000px] mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <h1 className="font-display text-foreground text-[56px] md:text-[96px] font-light leading-[0.95] tracking-[-0.04em]">
              Screening with <br />
              <span className="text-muted-foreground italic text-[56px] md:text-[88px]">Explainable Intent.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-muted-foreground mb-14 max-w-[680px] mx-auto text-[20px] font-normal leading-[1.6] tracking-[0.16px] antialiased"
          >
            The world's first recruitment platform that justifies its choices. 
            Built for recruiters who value precision over the black box.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-8"
          >
            <button className="btn-pill-primary h-[60px] px-12 text-[16px] font-bold">
              <span>Start Screening Now</span>
              <ArrowRight className="ml-2 h-5 w-5 opacity-40 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="btn-pill-warm h-[60px] px-12 text-[16px] font-bold">
               <span>View Product Showcase</span>
               <div className="ml-4 h-1.5 w-1.5 rounded-full bg-foreground/10" />
            </button>
          </motion.div>
        </div>

        <AppPreview />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-40 flex flex-col items-center"
        >
          <div className="flex flex-wrap gap-x-20 gap-y-10 items-center justify-center">
            {[
              { label: "Precision", val: "98.2% Accurate Parsing" },
              { label: "Intelligence", val: "Gemini 1.5 Pro Powered" },
              { label: "Trust", val: "Explainable Reasoning" }
            ].map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-bold">{m.label}</span>
                <span className="text-[20px] text-foreground font-light font-display">{m.val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
