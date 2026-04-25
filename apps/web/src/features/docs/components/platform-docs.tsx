"use client";

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
    title: "Deep Skill Analysis",
    description:
      "Powered by Gemini AI, our platform performs deep analysis of resumes beyond simple keyword matching. It understands context, nuances in experience, and potential fit with specific role requirements.",
    icon: RiBrainLine,
    color: "text-primary",
  },
  {
    title: "Direct Data Imports",
    description:
      "Add technical talent from any source instantly. Our system extracts and normalizes complex profile data from PDFs, text, and spreadsheets automatically with high precision.",
    icon: RiUploadCloud2Line,
    color: "text-primary",
  },
  {
    title: "Standardized Profiles",
    description:
      "Every applicant is transformed into a rich, structured profile. We capture skills, proficiency levels, and career trajectories to ensure every record is a clear source of truth.",
    icon: RiStackLine,
    color: "text-primary",
  },
  {
    title: "Match Quality Insights",
    description:
      "Our dashboard provides real-time visibility into talent quality. Track match scores, screening activity, and pipeline health with data-driven clarity.",
    icon: RiBarChartLine,
    color: "text-primary",
  },
] as const;

const workflow = [
  {
    step: "1",
    title: "Setup Job",
    description:
      "Create clear job requirements that serve as the anchor for our AI screening engine.",
  },
  {
    step: "2",
    title: "Import Talent",
    description:
      "Add candidates via bulk CSV upload, individual resume parsing, or manual entry.",
  },
  {
    step: "3",
    title: "AI Screening",
    description:
      "AI evaluates every candidate, generating match scores, strengths, and potential gaps.",
  },
  {
    step: "4",
    title: "Hire Top Talent",
    description:
      "Use AI-ranked shortlists and deep analytics to move the best people into the hiring phase.",
  },
] as const;

export function PlatformDocs() {
  return (
    <main className="min-h-screen bg-canvas px-6 py-12 text-ink-full md:px-6 lg:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-card border border-line bg-surface p-10 shadow-none md:p-20 lg:p-24">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-micro border border-line bg-bg2">
              <RiCpuLine className="size-5 text-primary" />
            </div>
            <p className="mb-4 font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.2em]">
              The Technology
            </p>
            <h1 className="font-serif text-[48px] text-primary leading-[1.1] tracking-tight md:text-[72px] lg:text-[84px]">
              Intelligence at the core of{" "}
              <span className="text-ink-faint">
                Talent Discovery.
              </span>
            </h1>
            <p className="mt-8 font-light font-sans text-[18px] text-ink-muted leading-relaxed max-w-[55ch]">
              A high-performance screening ecosystem designed to bridge the gap
              between massive talent pools and precise organizational needs
              through deep AI analysis and standardized data.
            </p>
            <div className="mt-12 flex flex-wrap gap-base">
              <Button
                render={<Link href="/auth" />}
                variant="default"
                size="xl"
                className="h-12 px-10 rounded-standard"
              >
                Launch Console
              </Button>
              <Button
                render={<Link href="/dashboard" />}
                variant="outline"
                size="xl"
                className="h-12 px-10 rounded-standard border-line bg-bg2/40"
              >
                Explore Dashboard
              </Button>
            </div>
          </div>

          {/* Subtle background decoration */}
          <div className="absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full bg-primary-alpha/5 blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-primary-alpha/5 blur-[120px]" />
        </section>

        {/* Feature Grid */}
        <section className="grid gap-comfortable md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative rounded-card border border-line bg-surface p-comfortable shadow-none transition-all hover:border-line-medium hover:bg-bg-alt/20"
            >
              <div
                className={cn(
                  "mb-comfortable flex h-11 w-11 items-center justify-center rounded-micro border border-line bg-bg2 shadow-none transition-transform group-hover:scale-110",
                )}
              >
                <feature.icon className={cn("size-5", feature.color)} />
              </div>
              <h3 className="mb-base font-serif text-[24px] text-primary tracking-tight">
                {feature.title}
              </h3>
              <p className="font-light font-sans text-[15px] text-ink-muted leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        {/* Product Workflow */}
        <section className="rounded-card border border-line bg-surface p-10 shadow-none md:p-20">
          <div className="mb-section-gap text-center">
            <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.1em]">
               Architecture
            </span>
            <h2 className="font-serif text-[42px] text-primary leading-tight">
              The Strategic Workflow
            </h2>
          </div>

          <div className="relative grid gap-hero md:grid-cols-2 lg:grid-cols-4">
            {/* Connecting line for desktop */}
            <div className="absolute top-10 left-0 -z-10 hidden h-[1px] w-full bg-line lg:block" />

            {workflow.map((w) => (
              <div key={w.step} className="space-y-base text-center lg:text-left">
                <div className="mx-auto lg:mx-0 flex h-20 w-20 items-center justify-center rounded-full border border-line bg-bg px-1 font-serif text-[28px] text-primary/30 shadow-none ring-8 ring-bg-alt/40 transition-colors hover:text-primary">
                  {w.step}
                </div>
                <div>
                  <h4 className="mb-2 font-medium font-sans text-[16px] text-primary tracking-tight">
                    {w.title}
                  </h4>
                  <p className="font-light font-sans text-[14px] text-ink-muted leading-relaxed">
                    {w.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Access Layer */}
        <section className="grid gap-comfortable lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-card border border-line bg-bg2/40 p-comfortable shadow-none lg:col-span-4">
            <div>
              <span className="mb-micro block font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                Live Demo
              </span>
              <h3 className="mb-comfortable font-serif text-[28px] text-primary leading-tight">
                Recruiter Access
              </h3>
              <div className="space-y-base">
                <div>
                  <p className="mb-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    Email
                  </p>
                  <p className="font-serif text-[18px] text-primary">
                    {DEMO_RECRUITER.email}
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                    Method
                  </p>
                  <p className="font-light font-sans text-[14px] text-ink-muted">
                    Magic Link / Social Auth
                  </p>
                </div>
              </div>
            </div>
            <Button
              render={<Link href="/auth" />}
              variant="default"
              size="xl"
              className="mt-10 h-11 w-full rounded-standard shadow-none"
            >
              <span className="flex w-full items-center justify-between">
                Sign In Now
                <RiFlashlightLine className="size-4" />
              </span>
            </Button>
          </div>

          <div className="rounded-card border border-line bg-surface p-comfortable shadow-none lg:col-span-8">
            <h3 className="mb-section-gap font-serif text-[28px] text-primary leading-tight">
              Platform Architecture
            </h3>
            <div className="grid gap-comfortable sm:grid-cols-2">
              <div className="rounded-standard border border-line bg-bg2/30 p-base transition-colors hover:bg-bg2/50">
                <h5 className="mb-2 font-medium font-sans text-[11px] text-primary uppercase tracking-widest">
                  Front-End
                </h5>
                <p className="font-light font-sans text-[14px] text-ink-muted leading-relaxed">
                  Modern dashboard built with Next.js, optimized with React
                  Query and Framer Motion for premium fluidity.
                </p>
              </div>
              <div className="rounded-standard border border-line bg-bg2/30 p-base transition-colors hover:bg-bg2/50">
                <h5 className="mb-2 font-medium font-sans text-[11px] text-primary uppercase tracking-widest">
                  Intelligence Layer
                </h5>
                <p className="font-light font-sans text-[14px] text-ink-muted leading-relaxed">
                  Integrated with Gemini AI for deep analysis and
                  automated candidate profile extraction.
                </p>
              </div>
              <div className="rounded-standard border border-line bg-bg2/30 p-base transition-colors hover:bg-bg2/50">
                <h5 className="mb-2 font-medium font-sans text-[11px] text-primary uppercase tracking-widest">
                  Data Core
                </h5>
                <p className="font-light font-sans text-[14px] text-ink-muted leading-relaxed">
                  Standardized Candidate Schema on MongoDB, ensuring high-fidelity
                  profiles across the ecosystem.
                </p>
              </div>
              <div className="rounded-standard border border-line bg-bg2/30 p-base transition-colors hover:bg-bg2/50">
                <h5 className="mb-2 font-medium font-sans text-[11px] text-primary uppercase tracking-widest">
                  Infrastructure
                </h5>
                <p className="font-light font-sans text-[14px] text-ink-muted leading-relaxed">
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
