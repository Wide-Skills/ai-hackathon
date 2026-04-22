"use client";

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden selection:bg-secondary selection:text-foreground">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex-1">
          <Hero />
        </div>
        
        <Features />
        
        <section className="py-[120px] px-[32px] bg-secondary/30 text-center border-t border-border">
          <div className="mx-auto max-w-[1000px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-foreground mb-6 text-[36px] md:text-[64px] font-light leading-[1.05] tracking-tight">
                Hire with <br />
                <span className="text-muted-foreground">absolute confidence.</span>
              </h2>
              <p className="text-muted-foreground text-[17px] mb-10 max-w-[480px] mx-auto leading-relaxed tracking-[0.1px]">
                Join modern recruitment teams using Umurava AI to 
                shortlist the top 1% of talent in minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-5">
                <button className="btn-pill-primary px-10 h-[52px] text-[15px]">
                  Get Started for Free
                </button>
                <button className="border shadow-sm rounded-full h-[52px] px-10 text-[15px]">
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
