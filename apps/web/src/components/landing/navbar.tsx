"use client";

import React from "react";
import Link from "next/link";
import type { Route } from "next";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-[64px] items-center bg-background/40 backdrop-blur-md border-b border-border">
      <div className="container-tight flex items-center justify-between">
        <Link href="/" className="flex items-center gap-[8px] group">
          <span className="font-display text-[18px] font-light tracking-tight text-foreground">
            UMURAVA <span className="text-muted-foreground italic">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-[28px] md:flex">
          <Link
            href={"/docs" as Route}
            className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground tracking-[0.1px]"
          >
            Docs
          </Link>
          {["Rankings", "Enterprise", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground tracking-[0.1px]"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Link href="/auth" className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground tracking-[0.1px]">
            Sign in
          </Link>
          <Link href="/auth">
            <button className="h-[36px] rounded-full bg-primary px-5 text-[13px] text-primary-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
