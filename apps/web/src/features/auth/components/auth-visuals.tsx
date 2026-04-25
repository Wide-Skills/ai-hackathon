"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type React from "react";

const Logo = ({ className }: { className?: string }) => (
  <Link href="/" className={`flex items-center gap-[6px] ${className}`}>
    <div className="size-[16px] rounded-micro bg-primary" />
    <span className="font-medium font-sans text-[15px] text-primary tracking-[-0.3px]">
      Umurava AI
    </span>
  </Link>
);

export function AuthVisuals() {
  return (
    <div className="relative hidden h-full flex-col overflow-hidden border-line border-r bg-bg-alt/30 p-12 lg:flex">
      <Logo className="relative z-10 mb-12" />

      <div className="relative z-10 flex flex-1 flex-col justify-center py-20">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-base">
            <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.1em]">
              High-Fidelity Selection
            </span>
          </div>
          <h2 className="mb-6 font-serif text-[36px] text-primary leading-[1.1] tracking-tight">
            Hire the top 1% <br />
            <em className="font-light italic opacity-80">
              with absolute clarity.
            </em>
          </h2>
          <p className="max-w-[280px] font-light font-sans text-[15px] text-ink-muted leading-relaxed">
            The world's first high-fidelity talent screening platform justified
            by reasoning.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative z-10 mt-auto border-line border-t pt-10"
      >
        <blockquote className="space-y-4">
          <p className="font-light font-sans text-[15px] text-ink-muted italic leading-relaxed">
            &ldquo;Umurava has transformed our hiring workflow, allowing us to
            shortlist experts with surgical precision.&rdquo;
          </p>
          <footer className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
            — Head of Talent, Neural Labs
          </footer>
        </blockquote>
      </motion.div>

      {/* Subtle Background Mark */}
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-[400px] rounded-full bg-primary-alpha/5 blur-[100px]" />
    </div>
  );
}

export function AuthContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
