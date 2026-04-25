"use client";

import {
  RiBarChartLine,
  RiBriefcaseLine,
  RiDashboardLine,
  RiGroupLine,
  RiSettingsLine,
  RiSparklingLine,
} from "@remixicon/react";
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
    icon: <RiDashboardLine />,
  },
  {
    title: "Jobs",
    url: "/dashboard/jobs",
    icon: <RiBriefcaseLine />,
  },
  {
    title: "Applicants",
    url: "/dashboard/applicants",
    icon: <RiGroupLine />,
  },
  {
    title: "AI Screening",
    url: "/dashboard/screening",
    icon: <RiSparklingLine />,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <RiBarChartLine />,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <RiSettingsLine />,
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
      className="border-line border-r bg-bg"
      {...props}
    >
      <SidebarHeader className="px-5 pt-8 pb-10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent"
            >
              <div className="flex items-center gap-[6px]">
                <div className="size-[16px] shrink-0 rounded-micro bg-primary" />
                <span className="truncate font-medium font-sans text-[15px] text-primary tracking-[-0.3px]">
                  Umurava AI
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="mt-auto border-line border-t bg-surface/50 p-comfortable">
        {session?.user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
