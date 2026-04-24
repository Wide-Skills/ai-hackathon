"use client";

import { RiGlobeLine, RiMailLine, RiMessage3Line } from "@remixicon/react";
import Link from "next/link";
import type React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-border border-t bg-background py-[160px]">
      <div className="container-tight">
        <div className="grid grid-cols-1 gap-[64px] md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="group mb-12 flex items-center gap-[8px]">
              <span className="font-display font-light text-[22px] text-foreground uppercase tracking-tight">
                Umurava <span className="text-muted-foreground italic">AI</span>
              </span>
            </Link>
            <p className="mb-12 max-w-[360px] text-[17px] text-foreground leading-relaxed tracking-[0.16px]">
              The next generation of talent screening. Powered by Gemini, built
              for recruiters who value precision and speed.
            </p>
            <div className="flex items-center gap-10">
              {[RiGlobeLine, RiMailLine, RiMessage3Line].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-6 w-6 stroke-[1.5px]" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-10 font-bold text-[13px] text-foreground uppercase tracking-[0.1em]">
              Platform
            </h4>
            <ul className="flex flex-col gap-5">
              {["Features", "Research", "Documentation", "Showcase"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="font-medium text-[15px] text-muted-foreground tracking-[0.15px] transition-colors hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-10 font-bold text-[13px] text-foreground uppercase tracking-[0.1em]">
              Company
            </h4>
            <ul className="flex flex-col gap-5">
              {["About", "Blog", "Careers", "Legal"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="font-medium text-[15px] text-muted-foreground tracking-[0.15px] transition-colors hover:text-foreground"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-32 flex flex-col items-center justify-between border-border border-t pt-12 md:flex-row">
          <p className="text-[13px] text-muted-foreground tracking-[0.15px]">
            © {new Date().getFullYear()} Umurava AI.
          </p>
          <div className="mt-8 flex items-center gap-12 md:mt-0">
            <Link
              href="#"
              className="text-[13px] text-muted-foreground tracking-[0.15px] transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-[13px] text-muted-foreground tracking-[0.15px] transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
