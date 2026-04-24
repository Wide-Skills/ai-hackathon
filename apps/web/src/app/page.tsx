import * as motion from "framer-motion/client";
import Link from "next/link";
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
    <main className="relative min-h-screen overflow-x-hidden selection:bg-secondary selection:text-foreground">
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar session={session} />

        <div className="flex-1">
          <Hero />
        </div>

        <TrustStats />

        <Features />

        <Testimonials />

        <section className="border-border border-t bg-secondary/30 px-[32px] py-[120px] text-center">
          <div className="mx-auto max-w-[1000px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="mb-6 font-display font-light text-[36px] text-foreground leading-[1.05] tracking-tight md:text-[64px]">
                Hire with <br />
                <span className="text-muted-foreground">
                  absolute confidence.
                </span>
              </h2>
              <p className="mx-auto mb-10 max-w-[480px] text-[17px] text-muted-foreground leading-relaxed tracking-[0.1px]">
                Join modern recruitment teams using Umurava AI to shortlist the
                top 1% of talent in minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-5">
                <Button
                  render={<Link href={session ? "/dashboard" : "/auth"} />}
                  variant="default"
                  size="2xl"
                  className="shadow-xl"
                >
                  {session ? "Go to Dashboard" : "Get Started for Free"}
                </Button>
                <Button
                  render={<Link href={session ? "/dashboard" : "/auth"} />}
                  variant="outline"
                  size="2xl"
                  className="shadow-sm"
                >
                  {session ? "View Jobs" : "Schedule a Demo"}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
