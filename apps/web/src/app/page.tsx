import Link from "next/link";
import { AppPreview } from "@/components/landing/app-preview";
import { ArchitectureSection } from "@/components/landing/architecture-section";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
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

        <ArchitectureSection />

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
