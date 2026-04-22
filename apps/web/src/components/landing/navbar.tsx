"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-[72px] items-center bg-background/40 backdrop-blur-md border-b border-border">
      <div className="container-tight flex items-center justify-between">
        <Link href="/" className="flex items-center gap-[8px] group">
          <span className="font-display text-[20px] font-light tracking-tight text-foreground">
            UMURAVA <span className="text-muted-foreground italic">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-[32px] md:flex">
          {["How it Works", "Rankings", "Enterprise", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground tracking-[0.15px]"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link href="/auth/sign-in" className="text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground tracking-[0.15px]">
            Sign in
          </Link>
          <Link href="/auth/sign-up">
            <button className="h-[40px] rounded-full bg-primary px-6 text-[14px] font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
