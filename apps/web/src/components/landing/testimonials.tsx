"use client";

import type React from "react";

const _testimonials = [
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
              Testimonials
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-card border border-line bg-surface p-8 text-center shadow-none sm:p-12 md:p-20">
          <div className="max-w-4xl space-y-comfortable">
            <p className="font-serif text-[28px] text-primary italic leading-[1.1] tracking-tight sm:text-[32px] md:text-[48px]">
              "The only platform that doesn't feel like a black box. The
              explainable rankings have transformed our hiring trust, allowing
              us to move 10x faster."
            </p>
            <div className="space-y-1">
              <p className="font-medium font-sans text-[18px] text-ink-full">
                Sarah Jenkins
              </p>
              <p className="font-medium font-sans text-[12px] text-primary/40 uppercase tracking-[0.1em]">
                Head of Talent, Techflow
              </p>
            </div>

            <div className="mx-auto flex max-w-md flex-col gap-base border-line border-t pt-comfortable">
              <span className="font-medium font-sans text-[10px] text-ink-faint uppercase tracking-widest">
                Previously scaling teams at
              </span>
              <div className="flex flex-wrap items-center justify-center gap-comfortable opacity-30 mix-blend-multiply grayscale">
                <span className="font-bold font-sans text-[14px]">Irembo</span>
                <span className="font-bold font-sans text-[14px]">HeHe</span>
                <span className="font-bold font-sans text-[14px]">AC Group</span>
                <span className="font-bold font-sans text-[14px]">Ampersand</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
