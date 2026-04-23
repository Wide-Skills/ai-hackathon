"use client";

import { Bell, Plus, Search } from "lucide-react";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { setCreateModalOpen } from "@/store/slices/jobsSlice";

const pageInfo: Record<
  string,
  {
    title: string;
    description: string;
    action?: { label: string; href: Route };
  }
> = {
  "/dashboard": {
    title: "Overview",
    description: "Your recruitment pipeline at a glance",
    action: { label: "Post a Job", href: "/dashboard/jobs" },
  },
  "/dashboard/jobs": {
    title: "Job Postings",
    description: "Manage your open positions",
    action: { label: "New Job", href: "/dashboard/jobs" },
  },
  "/dashboard/applicants": {
    title: "Applicants",
    description: "All candidates across your pipeline",
  },
  "/dashboard/screening": {
    title: "AI Screening",
    description: "Automated AI-powered candidate analysis",
  },
  "/dashboard/analytics": {
    title: "Talent Analytics",
    description: "Deep insights into your recruitment performance",
  },
  "/dashboard/settings": {
    title: "Settings",
    description: "Configure your workspace",
  },
};

export default function Header() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const currentPage = Object.entries(pageInfo)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key));

  const info = currentPage?.[1] ?? { title: "Dashboard", description: "" };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-border bg-background/60 px-8 backdrop-blur-md">
      <div>
        <h1 className="font-display text-[22px] font-light text-foreground tracking-tight leading-none">
          {info.title}
        </h1>
        {info.description && (
          <p className="mt-1.5 text-muted-foreground text-[11px] font-bold uppercase tracking-[0.15em]">
            {info.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block w-72">
          <InputGroup className="h-10 rounded-full border-border bg-foreground/[0.01] focus-within:ring-info/20 px-1 overflow-hidden shadow-sm">
            <InputGroupAddon align="inline-start" className="pl-4">
              <Search className="h-3.5 w-3.5 text-muted-foreground/40" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search talent pool..."
              className="text-[14px]"
            />
          </InputGroup>
        </div>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-all hover:bg-secondary active:scale-[0.95] shadow-sm">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-info" />
        </button>

        {info.action && (
          <button
            onClick={() => {
              if (
                info.action?.label === "Post a Job" ||
                info.action?.label === "New Job"
              ) {
                dispatch(setCreateModalOpen(true));
              }
            }}
            className="flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[13px] text-primary-foreground shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            {info.action.label}
          </button>
        )}
      </div>
    </header>
  );
}
