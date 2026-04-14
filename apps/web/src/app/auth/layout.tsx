"use client";

import { BrainCircuit, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Screening",
    desc: "Gemini 2.5 Pro analyzes every candidate instantly",
  },
  {
    icon: TrendingUp,
    title: "Match Score Ranking",
    desc: "Objective scores replace subjective gut feelings",
  },
  {
    icon: Users,
    title: "Talent Pipeline",
    desc: "Track candidates from apply to hire in one place",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-foreground p-12 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-foreground" />
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-primary-foreground text-xl tracking-tight">
              TalentAI
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="font-bold text-4xl text-primary-foreground leading-tight">
              Hire smarter.
              <br />
              <span className="text-primary">Screen faster.</span>
            </h1>
            <p className="mt-4 max-w-sm text-lg text-primary-foreground/60 leading-relaxed">
              AI-powered recruitment that surfaces the best candidates in
              seconds, not days.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-primary-foreground text-sm">
                    {f.title}
                  </p>
                  <p className="text-primary-foreground/50 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {[
                "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=40",
                "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=40",
                "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=40",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-foreground object-cover"
                />
              ))}
            </div>
            <p className="text-primary-foreground/60 text-sm">
              <span className="font-semibold text-primary-foreground">
                2,400+
              </span>{" "}
              candidates screened this week
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-primary-foreground/40 text-sm">
            Powered by Red Team Pro
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-muted p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-lg">TalentAI</span>
          </div>

          <div className="rounded-2xl border border-border bg-background shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
