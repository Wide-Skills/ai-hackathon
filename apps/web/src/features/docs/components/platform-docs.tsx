import { DEMO_RECRUITER } from "@ai-hackathon/shared";
import { BrainCircuit, Upload, Users, BarChart3, Search, Zap, Layers, Cpu } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "AI-First Intelligence",
    description: "Powered by Gemini 2.5 Flash, our platform performs deep semantic analysis of resumes beyond simple keyword matching. It understands context, nuances in experience, and potential resonance with specific role requirements.",
    icon: BrainCircuit,
    color: "text-primary",
    bg: "bg-primary/5",
  },
  {
    title: "Multichannel Ingestion",
    description: "Seamlessly import talent from any source. Whether it's direct API integration from platforms like Umurava, batch CSV uploads, or raw resume PDF parsing, the system handles it all with zero friction.",
    icon: Upload,
    color: "text-info",
    bg: "bg-info/5",
  },
  {
    title: "High-Fidelity Talent Schema",
    description: "Every applicant is transformed into a standardized, rich Talent Profile. We capture skills with proficiency levels, detailed career trajectories, and project portfolios to ensure every record is a source of truth.",
    icon: Layers,
    color: "text-success",
    bg: "bg-success/5",
  },
  {
    title: "Strategic Analytics",
    description: "Our recruiter dashboard provides real-time visibility into pipeline health. Track match quality indexing, screening throughput, and pipeline saturation with data-driven clarity.",
    icon: BarChart3,
    color: "text-amber-500",
    bg: "bg-amber-500/5",
  },
] as const;

const workflow = [
  {
    step: "1",
    title: "Define the Pipeline",
    description: "Create high-fidelity job requirements that serve as the neural anchor for our AI screening engine.",
  },
  {
    step: "2",
    title: "Universal Import",
    description: "Ingest candidates via platform sync, mass CSV upload, or individual resume parsing.",
  },
  {
    step: "3",
    title: "Neural Screening",
    description: "AI evaluates every candidate, generating objective match scores, strategic strengths, and critical gap analyses.",
  },
  {
    step: "4",
    title: "Strategic Selection",
    description: "Recruiters use AI-ranked shortlists and deep analytics to move top talent into the hiring phase.",
  },
] as const;

export function PlatformDocs() {
  return (
    <main className="min-h-screen bg-background px-6 py-20 text-foreground md:px-10 lg:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-24">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[48px] border border-border/60 bg-secondary/10 p-10 md:p-20 lg:p-24 shadow-ethereal">
          <div className="relative z-10 max-w-3xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-8">
               <Cpu className="h-6 w-6 text-primary" />
            </div>
            <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-primary/60 mb-4">
              Next-Gen Recruitment
            </p>
            <h1 className="font-display text-[48px] font-light leading-[1.1] tracking-tight md:text-[72px] lg:text-[84px]">
              Intelligence at the core of <span className="text-muted-foreground/40">Talent Acquisition.</span>
            </h1>
            <p className="mt-8 text-[18px] leading-relaxed text-muted-foreground/80 md:text-[20px]">
              A high-performance screening ecosystem designed to bridge the gap between massive talent pools and precise organizational needs through deep AI analysis and standardized data schemas.
            </p>
            <div className="mt-12 flex flex-wrap gap-6">
              <Link
                href="/auth"
                className="flex h-14 items-center rounded-full bg-primary px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lift transition-all hover:scale-[1.02] hover:shadow-premium active:scale-[0.98]"
              >
                Launch Platform
              </Link>
              <Link
                href="/dashboard"
                className="flex h-14 items-center rounded-full border border-border/50 bg-background px-10 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-primary/20 hover:text-foreground"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
          
          {/* Subtle background decoration */}
          <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-info/5 blur-[120px]" />
        </section>

        {/* Feature Grid */}
        <section className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="group relative rounded-[40px] border border-border/40 bg-background p-10 shadow-ethereal transition-all hover:border-primary/20 hover:shadow-premium">
              <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl mb-8 transition-transform group-hover:scale-110", feature.bg)}>
                <feature.icon className={cn("h-6 w-6", feature.color)} />
              </div>
              <h3 className="font-display text-[24px] font-medium tracking-tight mb-4">
                {feature.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground/70">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        {/* Product Workflow */}
        <section className="rounded-[48px] border border-border/40 bg-background p-10 md:p-20 shadow-ethereal">
          <div className="text-center mb-16">
            <h2 className="font-display text-[32px] font-light tracking-tight md:text-[42px] mb-4">
              The Strategic Workflow
            </h2>
            <p className="text-muted-foreground/60 text-[14px] font-medium uppercase tracking-[0.2em]">
              From Raw Data to High-Resolution Matches
            </p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 relative">
            {/* Connecting line for desktop */}
            <div className="absolute top-10 left-0 w-full h-[1px] bg-border/20 hidden lg:block -z-10" />
            
            {workflow.map((w) => (
              <div key={w.step} className="space-y-6">
                <div className="h-20 w-20 rounded-full bg-background border border-border/60 flex items-center justify-center text-[24px] font-display font-light text-primary/40 shadow-ethereal ring-8 ring-secondary/5">
                  {w.step}
                </div>
                <div>
                  <h4 className="text-[18px] font-semibold mb-3 tracking-tight">{w.title}</h4>
                  <p className="text-[14px] leading-relaxed text-muted-foreground/70">
                    {w.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Access Layer */}
        <section className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4 rounded-[40px] border border-border/40 bg-secondary/5 p-10 flex flex-col justify-between shadow-ethereal">
            <div>
               <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-2">Live Demo</p>
               <h3 className="font-display text-[24px] font-light mb-6">Recruiter Access</h3>
               <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-1">Email</p>
                    <p className="text-[16px] font-medium">{DEMO_RECRUITER.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-1">Method</p>
                    <p className="text-[16px] font-medium">Magic Link / Social Auth</p>
                  </div>
               </div>
            </div>
            <Link href="/auth" className="mt-10 group flex items-center justify-between h-14 rounded-pill border border-primary/20 bg-primary/5 px-6 text-primary hover:bg-primary hover:text-white transition-all shadow-lift">
               <span className="text-[11px] font-bold uppercase tracking-widest">Sign In Now</span>
               <Zap className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-8 rounded-[40px] border border-border/40 bg-background p-10 shadow-ethereal">
            <h3 className="font-display text-[24px] font-light mb-8">Platform Architecture</h3>
            <div className="grid gap-6 sm:grid-cols-2">
               <div className="rounded-3xl border border-border/30 p-6 bg-secondary/[0.02]">
                  <h5 className="text-[12px] font-bold uppercase tracking-widest text-primary/60 mb-3">Front-End</h5>
                  <p className="text-[14px] text-muted-foreground/70 leading-relaxed">Modern dashboard built with Next.js, optimized with React Query and Framer Motion for premium fluidity.</p>
               </div>
               <div className="rounded-3xl border border-border/30 p-6 bg-secondary/[0.02]">
                  <h5 className="text-[12px] font-bold uppercase tracking-widest text-info/60 mb-3">Intelligence Layer</h5>
                  <p className="text-[14px] text-muted-foreground/70 leading-relaxed">Integrated with Gemini 2.5 Flash for deep semantic screening and automated profile extraction.</p>
               </div>
               <div className="rounded-3xl border border-border/30 p-6 bg-secondary/[0.02]">
                  <h5 className="text-[12px] font-bold uppercase tracking-widest text-success/60 mb-3">Data Core</h5>
                  <p className="text-[14px] text-muted-foreground/70 leading-relaxed">Standardized Talent Schema on MongoDB, ensuring high-fidelity profiles across the ecosystem.</p>
               </div>
               <div className="rounded-3xl border border-border/30 p-6 bg-secondary/[0.02]">
                  <h5 className="text-[12px] font-bold uppercase tracking-widest text-amber-500/60 mb-3">Infrastructure</h5>
                  <p className="text-[14px] text-muted-foreground/70 leading-relaxed">Secure authentication via better-auth and high-performance communication with shared tRPC routers.</p>
               </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
