"use client";

import type React from "react";

const testimonials = [
  {
    quote:
      "The only platform that doesn't feel like a black box. The explainable rankings have transformed our hiring trust.",
    author: "Sarah Jenkins",
    role: "Head of Talent, Techflow",
    index: "01",
  },
  {
    quote:
      "Incredible precision. We reduced our time-to-shortlist from days to minutes without sacrificing quality.",
    author: "Michael Chen",
    role: "Engineering Manager",
    index: "02",
  },
  {
    quote:
      "Managing high-volume applications used to be a nightmare. Now, our team can focus on the human side of hiring.",
    author: "Elena Rodriguez",
    role: "Senior Recruiter",
    index: "03",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-section-padding">
      <div className="container-meridian">
        <div className="mb-section-gap">
          <div className="mb-small">
            <span className="font-medium font-sans text-[11px] text-ink-faint uppercase tracking-[0.06em]">
              The Standard
            </span>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-hero overflow-hidden rounded-card border border-line bg-surface p-comfortable shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)] md:flex-row">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-standard bg-bg2 opacity-90 contrast-110 grayscale md:aspect-auto md:w-1/3">
            {/* Profile Image Placeholder */}
            <div className="absolute inset-0 flex select-none items-center justify-center font-serif text-[120px] text-primary/10">
              SJ
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
          </div>
          <div className="flex flex-1 flex-col justify-center space-y-comfortable py-base">
            <p className="font-serif text-[28px] text-primary italic leading-[1.1] tracking-tight md:text-[36px]">
              "The only platform that doesn't feel like a black box. The
              explainable rankings have transformed our hiring trust, allowing
              us to move 10x faster."
            </p>
            <div className="space-y-1">
              <p className="font-medium font-sans text-[16px] text-ink-full">
                Sarah Jenkins
              </p>
              <p className="font-medium font-sans text-[11px] text-primary/40 uppercase tracking-[0.1em]">
                Head of Talent, Techflow
              </p>
            </div>

            <div className="flex flex-col gap-base border-line border-t pt-comfortable">
              <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                Previously scaling teams at
              </span>
              <div className="flex flex-wrap items-center gap-comfortable opacity-30 mix-blend-multiply grayscale">
                <span className="font-bold font-sans text-[14px]">Stripe</span>
                <span className="font-bold font-sans text-[14px]">Linear</span>
                <span className="font-bold font-sans text-[14px]">Vercel</span>
                <span className="font-bold font-sans text-[14px]">Retool</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
