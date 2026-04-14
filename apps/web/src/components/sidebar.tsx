"use client";

import {
  BrainCircuit,
  Briefcase,
  Cpu,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems: Array<{
  href: Route;
  icon: typeof LayoutDashboard;
  label: string;
  badge?: string;
  badgeVariant?: "primary";
}> = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/jobs", icon: Briefcase, label: "Jobs", badge: "4" },
  {
    href: "/dashboard/applicants",
    icon: Users,
    label: "Applicants",
    badge: "142",
  },
  {
    href: "/dashboard/screening",
    icon: Cpu,
    label: "AI Screening",
    badge: "New",
    badgeVariant: "primary" as const,
  },
];

const bottomItems: Array<{
  href: Route;
  icon: typeof Settings;
  label: string;
}> = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-slate-800 border-r bg-slate-900">
      <div className="flex h-16 items-center border-slate-800 border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500">
            <BrainCircuit className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight">
              TalentAI
            </span>
            <p className="text-[10px] text-slate-500 leading-none">
              by Umurava
            </p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-1">
          <p className="mb-2 px-3 font-semibold text-[10px] text-slate-600 uppercase tracking-widest">
            Recruitment
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-all duration-150",
                    isActive
                      ? "bg-blue-600 text-white shadow-blue-500/30 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-slate-300",
                      )}
                    />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 font-semibold text-[10px]",
                        isActive
                          ? "bg-blue-500 text-white"
                          : item.badgeVariant === "primary"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-400",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-6">
          <p className="mb-2 px-3 font-semibold text-[10px] text-slate-600 uppercase tracking-widest">
            Workspace
          </p>
          <nav className="space-y-0.5">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-all duration-150",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      isActive
                        ? "text-white"
                        : "text-slate-500 group-hover:text-slate-300",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mx-1 mt-6">
          <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-600/30 to-blue-800/20 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <p className="font-semibold text-white text-xs">AI Credits</p>
            </div>
            <div className="mb-2 flex items-end justify-between">
              <span className="font-bold text-2xl text-white">847</span>
              <span className="text-slate-400 text-xs">/ 1,000</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-[84.7%] rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
            </div>
            <p className="mt-1.5 text-[10px] text-slate-500">
              153 screenings remaining
            </p>
          </div>
        </div>
      </div>

      <div className="border-slate-800 border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 font-bold text-white text-xs">
            HR
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-sm text-white">
              HR Manager
            </p>
            <p className="truncate text-slate-500 text-xs">Umurava Inc.</p>
          </div>
          <button
            className="rounded p-1 text-slate-600 transition-colors hover:text-red-400"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
