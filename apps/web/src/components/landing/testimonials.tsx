"use client";

import { RiDoubleQuotesL } from "@remixicon/react";
import { motion } from "framer-motion";
import type React from "react";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "Umurava AI has completely transformed our technical hiring. We've reduced our time-to-shortlist by 80% without sacrificing quality.",
    author: "Sarah Jenkins",
    role: "Head of Talent at Techflow",
    avatar: "SJ",
    avatarColor: "text-primary font-semibold bg-primary/10 border-primary/30",
    nameColor: "text-black",
    roleColor: "text-primary",
  },
  {
    quote:
      "The AI reasoning is what sets this apart. It doesn't just give a score; it explains exactly why a candidate is a good match for our specific stack.",
    author: "Michael Chen",
    role: "Engineering Manager",
    avatar: "MC",
    avatarColor: "text-primary font-semibold bg-primary/10 border-primary/30",
    nameColor: "text-black",
    roleColor: "text-primary",
  },
  {
    quote:
      "Managing high-volume applications used to be a nightmare. Now, our team can focus on interviewing the right people from day one.",
    author: "Elena Rodriguez",
    role: "Senior Recruiter",
    avatar: "ER",
    avatarColor: "text-primary font-semibold bg-primary/10 border-primary/30",
    nameColor: "text-black",
    roleColor: "text-primary",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="bg-white py-[120px] text-foreground">
      <div className="container-tight">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mb-5 font-display font-light text-[32px] text-foreground leading-[1.1] tracking-[-0.03em] md:text-display-section">
              Loved by <br />
              <span className="text-primary">
                forward-thinking teams.
              </span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Card
                variant="premium"
                className="flex h-full flex-col justify-between border border-primary/20 bg-white p-8 shadow-sm"
              >
                <div>
                  <RiDoubleQuotesL className="mb-6 h-8 w-8 text-primary" />
                  <p className="mb-10 text-[17px] text-black italic leading-relaxed tracking-tight">
                    {t.quote}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-[11px] ${t.avatarColor}`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className={`font-semibold text-[14px] tracking-tight ${t.nameColor}`}>
                      {t.author}
                    </p>
                    <p className={`text-[12px] ${t.roleColor}`}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
