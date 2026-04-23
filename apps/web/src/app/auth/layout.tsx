"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Logo = ({ className }: { className?: string }) => (
  <Link href="/" className={`flex items-center gap-2 ${className}`}>
    <span className="font-display text-[18px] font-light tracking-tight text-foreground uppercase">
      Umurava <span className="text-muted-foreground italic normal-case">AI</span>
    </span>
  </Link>
);

const FloatingPaths = ({ position }: { position: number }) => {
  const paths = [
    { id: 1, d: "M0,100 Q50,50 100,100 T200,100 T300,100 T400,100", width: 0.5, opacity: 0.1, duration: 20 },
    { id: 2, d: "M0,150 Q100,100 200,150 T400,150", width: 1, opacity: 0.05, duration: 25 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="none">
        <title>Floating Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            fill="transparent"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: path.opacity,
              y: [0, position * 20, 0]
            }}
            transition={{ duration: path.duration, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen lg:grid lg:grid-cols-[440px_1fr] bg-background selection:bg-secondary selection:text-foreground">
      <div className="relative hidden h-full flex-col border-r border-border bg-secondary/20 p-12 lg:flex overflow-hidden">
        <Logo className="mb-12 relative z-10" />
        
        <div className="relative z-10 flex-1 flex flex-col justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
        
            <h2 className="font-display text-[36px] font-light leading-[1.1] tracking-tight text-foreground mb-6">
              Hire the top 1% <br />
              with absolute clarity.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[300px]">
              The first explainable talent screening platform powered by Gemini 1.5 Pro.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10 mt-auto pt-10 border-t border-border"
        >
          <blockquote className="space-y-4">
            <p className="text-[15px] font-light leading-relaxed text-foreground italic">
              &ldquo;Umurava has transformed our hiring process, allowing us to shortlist 
              experts with surgical precision.&rdquo;
            </p>
            <footer className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              — Head of Talent, Neural Labs
            </footer>
          </blockquote>
        </motion.div>

        <div className="absolute inset-0 z-0 text-foreground/5 opacity-50">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      {/* Main Form Content */}
      <div className="relative flex min-h-screen flex-col justify-center px-8 lg:px-24 xl:px-32 bg-[#fafafa]/30">
        <Button render={<Link href="/" />} className="absolute top-8 left-8 h-9 px-4 text-[13px] font-normal hover:bg-background/80" variant="ghost">
          
            <ChevronLeftIcon className="h-3.5 w-3.5 mr-2" />
            Back to Home
          
        </Button>

        <div className="mx-auto w-full max-w-[400px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
