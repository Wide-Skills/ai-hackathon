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
      <SidebarHeader className="h-20 flex flex-col justify-center px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent transition-none group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
            >
              <div className="flex items-center gap-[10px] group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center">
                <div className="size-[22px] shrink-0 rounded-micro bg-primary flex items-center justify-center font-serif text-[13px] text-white italic group-data-[collapsible=icon]:mx-auto">
                   U
                </div>
                <span className="truncate font-serif font-medium text-[18px] text-primary tracking-tight group-data-[collapsible=icon]:hidden">
                  Umurava
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="mt-auto border-line border-t bg-bg px-3 py-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-4 group-data-[collapsible=icon]:items-center">
        {session?.user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
