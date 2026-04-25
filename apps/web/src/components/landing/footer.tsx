"use client";

import Link from "next/link";
import type React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-white/5 border-t bg-primary pt-section-padding pb-comfortable text-white">
      <div className="container-meridian">
        <div className="mb-hero grid grid-cols-2 gap-hero md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 space-y-medium">
            <div className="flex items-center gap-[6px]">
              <div className="size-[14px] rounded-micro bg-white" />
              <span className="font-medium font-sans text-[15px] text-white tracking-[-0.3px]">
                Umurava AI
              </span>
            </div>
            <p className="max-w-[200px] font-light font-sans text-[13px] text-white/40 leading-relaxed">
              The new standard in high-fidelity talent screening and
              architectural recruitment.
            </p>
          </div>

          <div className="space-y-base">
            <p className="font-medium font-sans text-[9px] text-white/20 uppercase tracking-[0.1em]">
              Product
            </p>
            <ul className="space-y-small">
              {["Neural Ranking", "Unified Ingestion", "Intelligence Hub"].map(
                (l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="font-normal font-sans text-[13px] text-white/40 transition-colors hover:text-white"
                    >
                      {l}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="space-y-base">
            <p className="font-medium font-sans text-[9px] text-white/20 uppercase tracking-[0.1em]">
              Platform
            </p>
            <ul className="space-y-small">
              {["Documentation", "API Reference", "Architecture"].map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="font-normal font-sans text-[13px] text-white/40 transition-colors hover:text-white"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-base">
            <p className="font-medium font-sans text-[9px] text-white/20 uppercase tracking-[0.1em]">
              Legal
            </p>
            <ul className="space-y-small">
              {["Privacy Policy", "Terms of Service", "Security"].map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="font-normal font-sans text-[13px] text-white/40 transition-colors hover:text-white"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-base">
            <p className="font-medium font-sans text-[9px] text-white/20 uppercase tracking-[0.1em]">
              Connect
            </p>
            <ul className="space-y-small">
              {["Twitter", "LinkedIn", "GitHub"].map((l) => (
                <li key={l}>
                  <Link
                    href="#"
                    className="font-normal font-sans text-[13px] text-white/40 transition-colors hover:text-white"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-base border-white/5 border-t pt-comfortable md:flex-row">
          <div className="flex items-center gap-base">
            <span className="font-light font-sans text-[11px] text-white/20 uppercase tracking-widest">
              © 2025 Umurava. All Rights Reserved.
            </span>
          </div>
          <div className="flex items-center gap-base">
            <span className="size-1.5 rounded-full bg-status-success-text shadow-[0_0_8px_rgba(26,112,85,0.4)]" />
            <span className="font-medium font-sans text-[10px] text-white/40 uppercase tracking-widest">
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
