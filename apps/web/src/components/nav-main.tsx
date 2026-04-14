"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: Route;
    icon?: React.ReactNode;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            pathname === item.url ||
            (pathname.startsWith(`${item.url}/`) && item.url !== "/dashboard");

          return (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url} passHref legacyBehavior>
                <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
