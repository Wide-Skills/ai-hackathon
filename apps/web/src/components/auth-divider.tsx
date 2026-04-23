"use client";

import type React from "react";

export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-grow border-t border-border" />
      <span className="mx-4 flex-shrink text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
        {children}
      </span>
      <div className="flex-grow border-t border-border" />
    </div>
  );
}
