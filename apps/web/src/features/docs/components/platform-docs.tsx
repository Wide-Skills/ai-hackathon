import { DEMO_RECRUITER } from "@ai-hackathon/shared";
import {
  RiBarChartLine,
  RiBrainLine,
  RiCpuLine,
  RiFlashlightLine,
  RiStackLine,
  RiUploadCloud2Line,
} from "@remixicon/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI-First Intelligence",
    description:
      "Powered by Gemini AI, our platform performs deep semantic analysis of resumes beyond simple keyword matching. It understands context, nuances in experience, and potential resonance with specific role requirements.",
    icon: RiBrainLine,
    color: "text-primary",
    bg: "bg-primary/5",
  },
  {
    title: "Multichannel Ingestion",
    description:
      "Seamlessly import talent from any source. Whether it's direct API integration from platforms like Umurava, batch CSV uploads, or raw resume PDF parsing, the system handles it all with zero friction.",
    icon: RiUploadCloud2Line,
    color: "text-info",
    bg: "bg-info/5",
  },
  {
    title: "High-Fidelity Talent Schema",
    description:
      "Every applicant is transformed into a standardized, rich Talent Profile. We capture skills with proficiency levels, detailed career trajectories, and project portfolios to ensure every record is a source of truth.",
    icon: RiStackLine,
    color: "text-success",
    bg: "bg-success/5",
  },
  {
    title: "Strategic Analytics",
    description:
      "Our recruiter dashboard provides real-time visibility into pipeline health. Track match quality indexing, screening throughput, and pipeline saturation with data-driven clarity.",
    icon: RiBarChartLine,
    color: "text-amber-500",
    bg: "bg-amber-500/5",
  },
] as const;

const workflow = [
  {
    step: "1",
    title: "Define the Pipeline",
    description:
      "Create high-fidelity job requirements that serve as the neural anchor for our AI screening engine.",
  },
  {
    step: "2",
    title: "Universal Import",
    description:
      "Ingest candidates via platform sync, mass CSV upload, or individual resume parsing.",
  },
  {
    step: "3",
    title: "Neural Screening",
    description:
      "AI evaluates every candidate, generating objective match scores, strategic strengths, and critical gap analyses.",
  },
  {
    step: "4",
    title: "Strategic Selection",
    description:
      "Recruiters use AI-ranked shortlists and deep analytics to move top talent into the hiring phase.",
  },
] as const;

export function PlatformDocs() {
  return (
    <main className="min-h-screen bg-background px-6 py-20 text-foreground md:px-10 lg:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[48px] border border-border/60 bg-secondary/10 p-10 shadow-md md:p-20 lg:p-24">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <RiCpuLine className="h-6 w-6 text-primary" />
            </div>
            <p className="mb-4 font-bold text-[12px] text-primary/60 uppercase tracking-[0.3em]">
              Next-Gen Recruitment
            </p>
            <h1 className="font-display font-light text-[48px] leading-[1.1] tracking-tight md:text-[72px] lg:text-[84px]">
              Intelligence at the core of{" "}
              <span className="text-muted-foreground/40">
                Talent Acquisition.
              </span>
            </h1>
            <p className="mt-8 text-[18px] text-muted-foreground/80 leading-relaxed md:text-[20px]">
              A high-performance screening ecosystem designed to bridge the gap
              between massive talent pools and precise organizational needs
              through deep AI analysis and standardized data schemas.
            </p>
            <div className="mt-12 flex flex-wrap gap-6">
              <Button
                render={<Link href="/auth" />}
                variant="default"
                size="2xl"
                className="shadow-xl"
              >
                Launch Platform
              </Button>
              <Button
                render={<Link href="/dashboard" />}
                variant="outline"
                size="2xl"
              >
                Explore Dashboard
              </Button>
            </div>
          </div>

          {/* Subtle background decoration */}
          <div className="absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-info/5 blur-[120px]" />
        </section>

        {/* Feature Grid */}
        <section className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative rounded-[40px] border border-border/40 bg-background p-10 shadow-md transition-all hover:border-primary/20 hover:shadow-lg"
            >
              <div
                className={cn(
                  "mb-8 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
                  feature.bg,
                )}
              >
                <feature.icon className={cn("h-6 w-6", feature.color)} />
              </div>
              <h3 className="mb-4 font-display font-medium text-[24px] tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[15px] text-muted-foreground/70 leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        {/* Product Workflow */}
        <section className="rounded-[48px] border border-border/40 bg-background p-10 shadow-md md:p-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display font-light text-[32px] tracking-tight md:text-[42px]">
              The Strategic Workflow
            </h2>
            <p className="font-medium text-[14px] text-muted-foreground/60 uppercase tracking-[0.2em]">
              From Raw Data to High-Resolution Matches
            </p>
          </div>

          <div className="relative grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Connecting line for desktop */}
            <div className="absolute top-10 left-0 -z-10 hidden h-[1px] w-full bg-border/20 lg:block" />

            {workflow.map((w) => (
              <div key={w.step} className="space-y-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border/60 bg-background font-display font-light text-[24px] text-primary/40 shadow-md ring-8 ring-secondary/5">
                  {w.step}
                </div>
                <div>
                  <h4 className="mb-3 font-semibold text-[18px] tracking-tight">
                    {w.title}
                  </h4>
                  <p className="text-[14px] text-muted-foreground/70 leading-relaxed">
                    {w.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Access Layer */}
        <section className="grid gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-[40px] border border-border/40 bg-secondary/5 p-10 shadow-md lg:col-span-4">
            <div>
              <p className="mb-2 font-bold text-[11px] text-muted-foreground/40 uppercase tracking-[0.2em]">
                Live Demo
              </p>
              <h3 className="mb-6 font-display font-light text-[24px]">
                Recruiter Access
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="mb-1 font-bold text-[10px] text-muted-foreground/30 uppercase tracking-widest">
                    Email
                  </p>
                  <p className="font-medium text-[16px]">
                    {DEMO_RECRUITER.email}
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-bold text-[10px] text-muted-foreground/30 uppercase tracking-widest">
                    Method
                  </p>
                  <p className="font-medium text-[16px]">
                    Magic Link / Social Auth
                  </p>
                </div>
              </div>
            </div>
            <Button
              render={<Link href="/auth" />}
              variant="outline"
              size="2xl"
              className="mt-10 w-full border-primary/20 bg-primary/5 text-primary shadow-xl hover:bg-primary hover:text-white"
            >
              <span className="flex w-full items-center justify-between">
                Sign In Now
                <RiFlashlightLine className="h-4 w-4" />
              </span>
            </Button>
          </div>

          <div className="rounded-[40px] border border-border/40 bg-background p-10 shadow-md lg:col-span-8">
            <h3 className="mb-8 font-display font-light text-[24px]">
              Platform Architecture
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-border/30 bg-secondary/[0.02] p-6">
                <h5 className="mb-3 font-bold text-[12px] text-primary/60 uppercase tracking-widest">
                  Front-End
                </h5>
                <p className="text-[14px] text-muted-foreground/70 leading-relaxed">
                  Modern dashboard built with Next.js, optimized with React
                  Query and Framer Motion for premium fluidity.
                </p>
              </div>
              <div className="rounded-3xl border border-border/30 bg-secondary/[0.02] p-6">
                <h5 className="mb-3 font-bold text-[12px] text-info/60 uppercase tracking-widest">
                  Intelligence Layer
                </h5>
                <p className="text-[14px] text-muted-foreground/70 leading-relaxed">
                  Integrated with Gemini AI for deep semantic screening
                  and automated profile extraction.
                </p>
              </div>
              <div className="rounded-3xl border border-border/30 bg-secondary/[0.02] p-6">
                <h5 className="mb-3 font-bold text-[12px] text-success/60 uppercase tracking-widest">
                  Data Core
                </h5>
                <p className="text-[14px] text-muted-foreground/70 leading-relaxed">
                  Standardized Talent Schema on MongoDB, ensuring high-fidelity
                  profiles across the ecosystem.
                </p>
              </div>
              <div className="rounded-3xl border border-border/30 bg-secondary/[0.02] p-6">
                <h5 className="mb-3 font-bold text-[12px] text-amber-500/60 uppercase tracking-widest">
                  Infrastructure
                </h5>
                <p className="text-[14px] text-muted-foreground/70 leading-relaxed">
                  Secure authentication via better-auth and high-performance
                  communication with shared tRPC routers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
