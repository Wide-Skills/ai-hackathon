"use client";

import type React from "react";

export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-grow border-border border-t" />
      <span className="mx-4 flex-shrink font-bold text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
        {children}
      </span>
      <div className="flex-grow border-border border-t" />
    </div>
  );
}
