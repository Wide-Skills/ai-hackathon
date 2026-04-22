"use client";

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden selection:bg-[#f5f2ef] selection:text-black">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex-1">
          <Hero />
        </div>
        
        <Features />
        
        <section className="py-[160px] px-[32px] bg-white/40 backdrop-blur-md text-center border-t border-black/[0.03]">
          <div className="mx-auto max-w-[1000px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-black mb-8 text-[40px] md:text-[72px] font-light leading-[1.05] tracking-tight">
                Hire with <br />
                <span className="text-[#777169] italic">absolute confidence.</span>
              </h2>
              <p className="text-[#4E4E4E] text-[18px] mb-12 max-w-[540px] mx-auto leading-relaxed tracking-[0.14px]">
                Join modern recruitment teams using Umurava AI to 
                shortlist the top 1% of talent in minutes, not weeks.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <button className="btn-pill-primary px-10 h-[56px] text-[15px]">
                  Get Started for Free
                </button>
                <button className="btn-pill-warm px-10 h-[56px] text-[15px]">
                  Schedule a Demo
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
