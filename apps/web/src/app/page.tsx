"use client";

import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Screening",
    description:
      "Gemini 2.5 Pro evaluates every candidate against your job requirements instantly—skills, experience, projects, and cultural fit.",
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15 text-primary",
  },
  {
    icon: FileText,
    title: "Explainable Results",
    description:
      "No black boxes. Get detailed strengths, gaps, and a human-readable recommendation for every single candidate.",
    gradient: "from-success/20 to-success/5",
    iconBg: "bg-success/15 text-success",
  },
  {
    icon: Upload,
    title: "Multi-Format Intake",
    description:
      "Import candidates from your platform database, CSV spreadsheets, PDF resumes, or direct profile links.",
    gradient: "from-warning/20 to-warning/5",
    iconBg: "bg-warning/15 text-warning",
  },
  {
    icon: BarChart3,
    title: "Interactive Rankings",
    description:
      "Visualize ranked shortlists with score distributions, skill radars, and screening trend charts.",
    gradient: "from-chart-3/20 to-chart-3/5",
    iconBg: "bg-chart-3/15 text-chart-3",
  },
];

const stats = [
  { value: "10x", label: "Faster screening" },
  { value: "95%", label: "Accuracy rate" },
  { value: "500+", label: "Candidates/batch" },
  { value: "< 30s", label: "Per evaluation" },
];

const steps = [
  {
    step: "01",
    title: "Create a Position",
    description:
      "Define your job requirements, must-have skills, and evaluation criteria.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Import Candidates",
    description:
      "Upload CSVs, connect your platform, or paste individual profiles.",
    icon: Users,
  },
  {
    step: "03",
    title: "Run AI Screening",
    description:
      "Gemini analyzes every candidate simultaneously and ranks them.",
    icon: Sparkles,
  },
  {
    step: "04",
    title: "Review & Hire",
    description:
      "Read transparent AI justifications and make informed decisions.",
    icon: CheckCircle2,
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/25">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-xl tracking-tight text-transparent">
              TalentAI
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/sign-in">
              <Button
                variant="ghost"
                className="font-medium text-muted-foreground text-sm hover:text-foreground"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button
                size="sm"
                className="gap-1.5 rounded-lg bg-primary px-5 font-semibold text-sm text-white shadow-md shadow-primary/25 hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/4 rounded-full bg-chart-1/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-success/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold text-primary text-xs tracking-wide">
                Powered by Gemini 2.5 Pro
              </span>
            </div>

            <h1 className="font-black text-5xl leading-[1.1] tracking-tight md:text-7xl">
              <span className="text-foreground">Hire smarter.</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-chart-3 to-primary bg-clip-text text-transparent">
                Screen faster.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed md:text-xl">
              AI-powered recruitment that surfaces the best candidates in
              seconds, not days. Get transparent, explainable rankings backed by
              advanced LLM analysis.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="h-12 gap-2 rounded-xl bg-primary px-8 font-bold text-base text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40"
                >
                  Start Screening Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/sign-in">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-xl border-border px-8 font-semibold text-base"
                >
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center justify-center gap-6">
              <div className="flex -space-x-2.5">
                {[
                  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=48",
                  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=48",
                  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=48",
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=48",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-background object-cover shadow-sm"
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground text-sm">
                  2,400+ candidates screened
                </p>
                <p className="text-muted-foreground text-xs">
                  this week across all teams
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text font-black text-3xl text-transparent md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 font-medium text-muted-foreground text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-bold text-3xl text-foreground tracking-tight md:text-4xl">
              Everything you need to{" "}
              <span className="text-primary">hire with confidence</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From intake to shortlist, powered by AI that explains its
              reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${feature.gradient} p-8 transition-all duration-300 hover:shadow-lg`}
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-foreground text-lg">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-foreground py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-bold text-3xl text-white tracking-tight md:text-4xl">
              Four steps to your{" "}
              <span className="text-primary">perfect shortlist</span>
            </h2>
            <p className="mt-4 text-lg text-white/50">
              Set up once, screen thousands. Our AI handles the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-white/10"
              >
                <span className="mb-4 block font-black text-3xl text-primary/40">
                  {item.step}
                </span>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-sm text-white">
                  {item.title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-chart-3 to-primary p-12 text-center shadow-2xl shadow-primary/20 md:p-16">
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5">
                <TrendingUp className="h-4 w-4 text-white" />
                <span className="font-semibold text-sm text-white">
                  Join the future of hiring
                </span>
              </div>
              <h2 className="font-black text-3xl text-white leading-tight md:text-5xl">
                Ready to transform
                <br />
                your recruitment?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
                Start screening candidates with AI today. No credit card
                required.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/sign-up">
                  <Button
                    size="lg"
                    className="h-12 gap-2 rounded-xl bg-white px-8 font-bold text-base text-primary shadow-lg hover:bg-white/90"
                  >
                    Get Started Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-foreground text-sm">TalentAI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Built for the Umurava AI Hackathon · Powered by Gemini
          </p>
          <p className="text-muted-foreground/60 text-xs">
            © {new Date().getFullYear()} Red Team Pro
          </p>
        </div>
      </footer>
    </div>
  );
}
