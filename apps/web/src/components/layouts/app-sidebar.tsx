"use client";

import {
  BrainCircuit,
  BriefcaseIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  SparklesIcon,
  UsersIcon,
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                <BrainCircuit className="size-5 text-white" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-semibold text-transparent">
                  TalentAI
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  Pro Workspace
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>{session?.user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
