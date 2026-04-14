"use client";

import { Bell, Plus, Search } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  "/dashboard/settings": {
    title: "Settings",
    description: "Configure your workspace",
  },
};

export default function Header() {
  const pathname = usePathname();

  const currentPage = Object.entries(pageInfo)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => pathname.startsWith(key));

  const info = currentPage?.[1] ?? { title: "Dashboard", description: "" };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-border border-b bg-background/80 px-6 backdrop-blur-sm">
      <div>
        <h1 className="font-bold text-foreground text-lg leading-none">
          {info.title}
        </h1>
        {info.description && (
          <p className="mt-0.5 text-muted-foreground text-xs">
            {info.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search candidates, jobs..."
            className="h-9 w-64 rounded-lg border-border bg-muted pl-9 text-sm focus-visible:ring-ring"
          />
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-muted">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </button>

        {info.action && (
          <Link href={info.action.href}>
            <Button
              size="sm"
              className="h-9 gap-1.5 rounded-lg bg-primary font-semibold text-primary-foreground text-sm hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              {info.action.label}
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
