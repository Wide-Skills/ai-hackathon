import { motion } from "motion/react";
import Link from "next/link";
import { AppPreview } from "@/components/landing/app-preview";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { AIArchitecture } from "@/components/landing/neural-architecture";
import { Testimonials } from "@/components/landing/testimonials";
import { TrustStats } from "@/components/landing/trust-stats";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="relative min-h-screen selection:bg-primary-alpha selection:text-primary">
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar session={session} />

        <div className="flex-1">
          <Hero />
        </div>

        <section
          id="features"
          className="border-line border-y bg-surface py-section-padding"
        >
          <Features />
        </section>

        <section
          id="process"
          className="border-line border-y bg-bg-alt/30 py-section-padding"
        >
          <div className="container-meridian text-center lg:text-left">
            <div className="flex flex-col items-center justify-between gap-hero lg:flex-row">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-[480px]"
              >
                <div className="mb-small">
                  <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.1em]">
                    The Architecture
                  </span>
                </div>
                <h2 className="mb-section-gap text-[42px] leading-tight">
                  How explainable <br />
                  <em className="font-light text-brand-primary italic opacity-80">
                    reasoning works.
                  </em>
                </h2>

                <div className="space-y-medium text-left">
                  {[
                    {
                      step: "01",
                      title: "Smart Parsing",
                      body: "Resumes are analyzed for match quality, not just keywords.",
                    },
                    {
                      step: "02",
                      title: "Agent Reflection",
                      body: "AI agents debate candidate fit based on technical requirements.",
                    },
                    {
                      step: "03",
                      title: "Rationale Generation",
                      body: "Decisions are converted into human-readable rationale.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex items-start gap-base"
                    >
                      <span className="mt-1 font-mono text-[11px] text-primary/30">
                        {item.step}
                      </span>
                      <div>
                        <h3 className="mb-micro font-medium font-sans text-[15px] text-primary">
                          {item.title}
                        </h3>
                        <p className="font-light font-sans text-[14px] text-ink-muted">
                          {item.body}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex aspect-square w-full max-w-[500px] flex-1 items-center justify-center overflow-hidden rounded-card border border-line bg-surface p-comfortable shadow-[0_30px_60px_-12px_rgba(0,0,0,0.02)]"
              >
                <AIArchitecture />
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="interface"
          className="border-line border-y bg-surface py-section-padding"
        >
          <AppPreview />
        </section>

        <section id="scale">
          <TrustStats />
        </section>

        <section className="border-line border-y bg-surface py-section-padding">
          <Testimonials />
        </section>

        <section className="relative overflow-hidden bg-primary-alpha py-hero text-center">
          <div className="pointer-events-none absolute top-0 right-0 h-full w-full bg-gradient-to-br from-white/5 to-transparent" />
          <div className="container-meridian">
            <div className="mb-section-gap flex flex-col items-center">
              <div className="mb-small">
                <span className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.1em]">
                  Join the Elite
                </span>
              </div>
              <h2 className="mb-base text-[48px] leading-[0.95] tracking-tight md:text-[64px]">
                Hire with <br />
                <em className="font-light text-brand-primary italic opacity-80">
                  confidence.
                </em>
              </h2>
              <p className="max-w-[500px] font-light font-sans text-[17px] text-ink-muted leading-[1.68]">
                Find the right people faster. Shortlist top candidates with
                clear AI-driven reasoning and total decision clarity.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-base">
              <Button
                render={<Link href={session ? "/dashboard" : "/auth"} />}
                variant="default"
                size="lg"
                className="h-12 rounded-standard px-10 shadow-[0_10px_20px_-10px_rgba(25,40,64,0.3)]"
              >
                {session ? "Go to Dashboard" : "Start Screening Now"}
              </Button>
              <Button
                render={<Link href={session ? "/dashboard" : "/auth"} />}
                variant="secondary"
                size="lg"
                className="h-12 rounded-standard px-10"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
