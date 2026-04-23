"use client";

import {
  BriefcaseIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  SparklesIcon,
  UsersIcon,
  BarChart3Icon,
} from "lucide-react";
import type { Route } from "next";
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

const navItems: Array<{
  title: string;
  url: Route;
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
    <Sidebar collapsible="icon" className="border-r border-border bg-background" {...props}>
      <SidebarHeader className="pt-6 px-4 pb-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent"
            >
           
              <div className="grid flex-1 text-left leading-tight ml-1">
                <span className="truncate font-display text-[16px] font-light tracking-tight text-foreground uppercase">
                  Umurava <span className="text-muted-foreground italic normal-case">AI</span>
                </span>
              
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto border-t border-border/50">
        {session?.user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
