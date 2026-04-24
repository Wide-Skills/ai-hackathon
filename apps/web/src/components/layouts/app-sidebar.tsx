"use client";

import {
  BarChart3Icon,
  BriefcaseIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import type * as React from "react";
import { NavMain } from "@/components/layouts/nav-main";
import { NavUser } from "@/components/layouts/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

type AppRoute =
  | "/dashboard"
  | "/dashboard/jobs"
  | "/dashboard/applicants"
  | "/dashboard/screening"
  | "/dashboard/analytics"
  | "/dashboard/settings";

const navItems: Array<{
  title: string;
  url: AppRoute;
  icon: React.ReactNode;
}> = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Jobs",
    url: "/dashboard/jobs",
    icon: <BriefcaseIcon />,
  },
  {
    title: "Applicants",
    url: "/dashboard/applicants",
    icon: <UsersIcon />,
  },
  {
    title: "AI Screening",
    url: "/dashboard/screening",
    icon: <SparklesIcon />,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <BarChart3Icon />,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <Settings2Icon />,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();

  const user = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "",
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-border border-r bg-background"
      {...props}
    >
      <SidebarHeader className="px-4 pt-6 pb-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent"
            >
              <div className="ml-2 grid flex-1 text-left leading-tight">
                <span className="truncate font-display font-light text-[15px] text-foreground uppercase tracking-[0.2em]">
                  Umurava{" "}
                  <span className="text-muted-foreground/40 normal-case italic tracking-tight">
                    AI
                  </span>
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="mt-auto border-border/50 border-t p-4">
        {session?.user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
