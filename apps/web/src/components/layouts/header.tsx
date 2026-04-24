"use client";

import { Bell, Plus, Search } from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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
    action: { label: "Post a Job", href: "/dashboard/jobs/new" },
  },
  "/dashboard/jobs": {
    title: "Job Postings",
    description: "Manage your open positions",
    action: { label: "New Job", href: "/dashboard/jobs/new" },
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
  const router = useRouter();

  const currentPage = Object.entries(pageInfo)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key));

  const info = currentPage?.[1] ?? { title: "Dashboard", description: "" };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-border/50 border-b bg-background/60 px-8 backdrop-blur-md">
      <div>
        <h1 className="font-display font-light text-[20px] text-foreground leading-none tracking-tight">
          {info.title}
        </h1>
        {info.description && (
          <p className="mt-1.5 font-bold text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
            {info.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden w-72 md:block">
          <InputGroup className="flex h-10 items-center overflow-hidden rounded-pill border-border/50 bg-foreground/[0.02] px-1 shadow-ethereal focus-within:ring-info/20">
            <InputGroupAddon
              align="inline-start"
              className="flex items-center justify-center pl-4"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground/40" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search talent pool..."
              className="border-none font-medium text-[13px] focus-visible:ring-0"
            />
          </InputGroup>
        </div>

        <button className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-pill border border-border/50 bg-background shadow-ethereal transition-all hover:bg-secondary active:scale-[0.95]">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-info" />
        </button>

        {info.action && (
          <button
            onClick={() => {
              if (info.action?.href) {
                router.push(info.action.href);
              }
            }}
            className="btn-pill-primary flex h-10 shrink-0 items-center justify-center px-6 text-[13px]"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            {info.action.label}
          </button>
        )}
      </div>
    </header>
  );
}
