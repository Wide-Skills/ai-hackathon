"use client";

import {
  RiAddLine,
  RiBarChartLine,
  RiBrainLine,
  RiBriefcaseLine,
  RiFileListLine,
  RiGroupLine,
  RiNotification3Line,
  RiSearch2Line,
  RiSettings4Line,
  RiUploadCloud2Line,
} from "@remixicon/react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const getLabel = (p: string) => {
  const map: Record<string, string> = {
    dashboard: "Dashboard",
    applicants: "Candidates",
    jobs: "Jobs",
    screening: "Screening",
    settings: "Settings",
    analytics: "Analytics",
  };
  return map[p] || p.charAt(0).toUpperCase() + p.slice(1);
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const paths = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full shrink-0 items-center justify-between border-line border-b bg-surface px-4 lg:px-8">
      <div className="flex items-center gap-small">
        <SidebarTrigger className="-ml-2 md:hidden" />
        <div className="flex flex-col justify-center">
          <Breadcrumb>
            <BreadcrumbList>
              {paths.map((p, i) => {
                const href = `/${paths.slice(0, i + 1).join("/")}`;
                const isLast = i === paths.length - 1;
                const label = getLabel(p);

                return (
                  <React.Fragment key={p}>
                    <BreadcrumbItem
                      className={cn(!isLast && "hidden sm:inline-flex")}
                    >
                      {isLast ? (
                        <BreadcrumbPage className="font-serif text-[18px] text-primary tracking-tight md:text-[24px]">
                          {label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          render={
                            <button
                              onClick={() => router.push(href as Route)}
                            />
                          }
                          className="cursor-pointer text-ink-faint transition-colors hover:text-primary"
                        >
                          {label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className="hidden sm:inline-flex" />
                    )}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex items-center gap-base">
        {/* command palette trigger */}
        <div className="relative hidden w-80 md:block">
          <button
            onClick={() => setOpen(true)}
            className="group flex h-10 w-full items-center gap-3 rounded-standard border border-line bg-bg2/40 px-3.5 text-left transition-all hover:border-primary/20 hover:bg-surface focus:ring-4 focus:ring-primary-alpha/5 active:scale-[0.98]"
          >
            <RiSearch2Line className="size-4 text-ink-faint transition-colors group-hover:text-primary" />
            <span className="flex-1 font-normal font-sans text-[13px] text-ink-faint">
              Search commands...
            </span>
            <kbd className="pointer-events-none hidden rounded bg-bg-deep px-1.5 py-0.5 font-mono text-[9px] text-ink-faint md:inline-block">
              ⌘K
            </kbd>
          </button>
        </div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick Actions">
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/jobs/new" as Route))
                }
              >
                <RiAddLine className="mr-2 h-4 w-4" />
                <span>Create New Job</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() =>
                    router.push("/dashboard/applicants" as Route),
                  )
                }
              >
                <RiUploadCloud2Line className="mr-2 h-4 w-4" />
                <span>Import Candidates</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Intelligence">
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/screening" as Route))
                }
              >
                <RiBrainLine className="mr-2 h-4 w-4" />
                <span>AI Screening Pipeline</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/analytics" as Route))
                }
              >
                <RiBarChartLine className="mr-2 h-4 w-4" />
                <span>Deep Analytics</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/ai-tasks" as Route))
                }
              >
                <RiFileListLine className="mr-2 h-4 w-4" />
                <span>System Logs & Reasoning</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/jobs" as Route))
                }
              >
                <RiBriefcaseLine className="mr-2 h-4 w-4" />
                <span>View Job Board</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() =>
                    router.push("/dashboard/applicants" as Route),
                  )
                }
              >
                <RiGroupLine className="mr-2 h-4 w-4" />
                <span>Talent Pool</span>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/settings" as Route))
                }
              >
                <RiSettings4Line className="mr-2 h-4 w-4" />
                <span>System Settings</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {/* action tray */}
        <div className="ml-small flex items-center gap-small border-line border-l pl-base">
          <Link href={"/dashboard/ai-tasks" as Route}>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-standard border border-line bg-surface text-ink-faint transition-all hover:bg-bg-alt active:scale-[0.95]">
              <RiNotification3Line className="h-4 w-4" />
              <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-status-success-text shadow-[0_0_8px_rgba(26,112,85,0.4)]" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
