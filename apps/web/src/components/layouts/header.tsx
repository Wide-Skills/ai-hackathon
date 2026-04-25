"use client";

import { RiNotification3Line, RiSearch2Line } from "@remixicon/react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

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

  const paths = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full shrink-0 items-center justify-between border-line border-b bg-surface/80 px-8 backdrop-blur-md lg:px-10">
      <div className="flex flex-col justify-center">
        <Breadcrumb>
          <BreadcrumbList>
            {paths.map((p, i) => {
              const href = `/${paths.slice(0, i + 1).join("/")}`;
              const isLast = i === paths.length - 1;
              const label = getLabel(p);

              return (
                <React.Fragment key={p}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-serif text-[24px] text-primary tracking-tight">
                        {label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        render={
                          <button onClick={() => router.push(href as Route)} />
                        }
                        className="cursor-pointer text-ink-faint transition-colors hover:text-primary"
                      >
                        {label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-base">
        {/* Polished Search Bar */}
        <div className="relative hidden w-80 md:block">
          <div className="group flex h-10 items-center gap-3 rounded-standard border border-line bg-bg2/40 px-3.5 transition-all focus-within:border-primary/20 focus-within:bg-surface focus-within:ring-4 focus-within:ring-primary-alpha/5">
            <RiSearch2Line className="size-4 text-ink-faint transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search anything..."
              className="flex-1 bg-transparent font-normal font-sans text-[13px] outline-none placeholder:text-ink-faint"
            />
            <kbd className="pointer-events-none hidden rounded bg-bg-deep px-1.5 py-0.5 font-mono text-[9px] text-ink-faint md:inline-block">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Action Tray */}
        <div className="ml-small flex items-center gap-small border-line border-l pl-base">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-standard border border-line bg-surface text-ink-faint transition-all hover:bg-bg-alt active:scale-[0.95]">
            <RiNotification3Line className="h-4 w-4" />
            <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-status-success-text shadow-[0_0_8px_rgba(26,112,85,0.4)]" />
          </button>
        </div>
      </div>
    </header>
  );
}
