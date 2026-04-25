"use client";

import Image from "next/image";
import { RiGlobeLine, RiMailLine, RiMessage3Line } from "@remixicon/react";
import Link from "next/link";
import type React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-border border-t bg-white py-[160px] text-black">
      <div className="container-tight">
        <div className="grid grid-cols-1 gap-[64px] md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="group mb-12 flex items-center">
              <Image
                src="/favicon/logo.png"
                alt="Umurava Talent"
                width={220}
                height={56}
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="mb-12 max-w-[360px] text-[17px] text-black/70 leading-relaxed tracking-[0.16px]">
              The next generation of talent screening. Powered by Gemini, built
              for recruiters who value precision and speed.
            </p>
            <div className="flex items-center gap-10">
              {[RiGlobeLine, RiMailLine, RiMessage3Line].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="text-primary transition-colors hover:text-primary/80"
                >
                  <Icon className="h-6 w-6 stroke-[1.5px]" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-10 font-bold text-[13px] text-primary uppercase tracking-[0.1em]">
              Platform
            </h4>
            <ul className="flex flex-col gap-5">
              {["Features", "Research", "Documentation", "Showcase"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="font-medium text-[15px] text-black/70 tracking-[0.15px] transition-colors hover:text-primary"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-10 font-bold text-[13px] text-primary uppercase tracking-[0.1em]">
              Company
            </h4>
            <ul className="flex flex-col gap-5">
              {["About", "Blog", "Careers", "Legal"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="font-medium text-[15px] text-black/70 tracking-[0.15px] transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-32 flex flex-col items-center justify-between border-border border-t pt-12 md:flex-row">
          <p className="text-[13px] text-black/60 tracking-[0.15px]">
            © {new Date().getFullYear()} Umurava talent screener.
          </p>
          <div className="mt-8 flex items-center gap-12 md:mt-0">
            <Link
              href="#"
              className="text-[13px] text-black/60 tracking-[0.15px] transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-[13px] text-black/60 tracking-[0.15px] transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
