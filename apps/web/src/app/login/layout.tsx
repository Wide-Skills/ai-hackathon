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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-slate-900" />
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">
              TalentAI
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="font-bold text-4xl text-white leading-tight">
              Hire smarter.
              <br />
              <span className="text-blue-400">Screen faster.</span>
            </h1>
            <p className="mt-4 max-w-sm text-lg text-slate-400 leading-relaxed">
              AI-powered recruitment that surfaces the best candidates in
              seconds, not days.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                  <f.icon className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">{f.title}</p>
                  <p className="text-slate-500 text-sm">{f.desc}</p>
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
                  className="h-8 w-8 rounded-full border-2 border-slate-900 object-cover"
                />
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              <span className="font-semibold text-white">2,400+</span>{" "}
              candidates screened this week
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-600 text-sm">Powered by Red Team Pro</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <BrainCircuit className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">TalentAI</span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
