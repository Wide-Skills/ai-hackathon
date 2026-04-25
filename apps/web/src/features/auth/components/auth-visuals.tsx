"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

const Logo = ({ className }: { className?: string }) => (
  <Link href="/" className={`flex items-center ${className}`}>
    <Image
      src="/favicon/logo.png"
      alt="Umurava Talent"
      width={180}
      height={48}
      className="h-12 w-auto object-contain"
    />
  </Link>
);

const FloatingPaths = ({ position }: { position: number }) => {
  const paths = [
    {
      id: 1,
      d: "M0,100 Q50,50 100,100 T200,100 T300,100 T400,100",
      width: 0.5,
      opacity: 0.1,
      duration: 20,
    },
    {
      id: 2,
      d: "M0,150 Q100,100 200,150 T400,150",
      width: 1,
      opacity: 0.05,
      duration: 25,
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
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
              y: [0, position * 20, 0],
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export function AuthVisuals() {
  return (
    <div className="relative hidden h-full flex-col overflow-hidden border-white/10 border-r bg-[#255fd2] p-12 lg:flex">
      <Logo className="relative z-10 mb-12" />

      <div className="relative z-10 flex flex-1 flex-col justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="mb-6 font-display font-light text-[36px] text-white leading-[1.1] tracking-tight">
            Hire the top 1% <br />
            with absolute clarity.
          </h2>
          <p className="max-w-[300px] text-[15px] text-white/75 leading-relaxed">
            The first explainable talent screening platform powered by Gemini
            AI.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative z-10 mt-auto border-white/10 border-t pt-10"
      >
        <blockquote className="space-y-4">
          <p className="font-light text-[15px] text-white italic leading-relaxed">
            &ldquo;Umurava has transformed our hiring process, allowing us to
            shortlist experts with surgical precision.&rdquo;
          </p>
          <footer className="font-bold text-[11px] text-white/65 uppercase tracking-widest">
            — Head of Talent, Neural Labs
          </footer>
        </blockquote>
      </motion.div>

      <div className="absolute inset-0 z-0 text-white/10 opacity-50">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
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
