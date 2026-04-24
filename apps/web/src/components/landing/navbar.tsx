"use client";

import type { Route } from "next";
import Link from "next/link";
import type React from "react";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-[64px] items-center border-border border-b bg-background/40 backdrop-blur-md">
      <div className="container-tight flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-[8px]">
          <span className="font-display font-light text-[18px] text-foreground tracking-tight">
            UMURAVA <span className="text-muted-foreground italic">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-[28px] md:flex">
          <Link
            href={"/docs" as Route}
            className="font-medium text-[13px] text-muted-foreground tracking-[0.1px] transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          {["Rankings", "Enterprise", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-medium text-[13px] text-muted-foreground tracking-[0.1px] transition-colors hover:text-foreground"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/auth"
            className="font-medium text-[13px] text-muted-foreground tracking-[0.1px] transition-colors hover:text-foreground"
          >
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
