"use client";

import { RiArrowRightSLine } from "@remixicon/react";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type AppRoute =
  | "/dashboard"
  | "/dashboard/jobs"
  | "/dashboard/applicants"
  | "/dashboard/screening"
  | "/dashboard/analytics"
  | "/dashboard/settings";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: AppRoute;
    icon?: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: AppRoute;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-small px-3 font-medium font-sans text-[10px] text-ink-faint uppercase tracking-[0.06em]">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-micro">
        {items.map((item) => {
          const isItemActive =
            pathname === item.url ||
            (item.url !== "/dashboard" && pathname.startsWith(item.url)) ||
            item.isActive;

          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => {
                    window.location.href = item.url;
                  }}
                  isActive={isItemActive}
                  className={cn(
                    "group relative h-9 rounded-standard px-3 shadow-none transition-all duration-150",
                    isItemActive
                      ? "bg-bg-deep font-medium text-primary"
                      : "text-ink-muted hover:bg-bg-alt hover:text-ink-full",
                  )}
                >
                  <div
                    className={cn(
                      "mr-2.5 flex-shrink-0 transition-colors",
                      isItemActive
                        ? "text-primary"
                        : "text-ink-faint group-hover:text-ink-muted",
                    )}
                  >
                    {React.isValidElement(item.icon)
                      ? React.cloneElement(
                          item.icon as React.ReactElement<any>,
                          { className: "size-4 stroke-[1.5px]" },
                        )
                      : item.icon}
                  </div>
                  <span className="font-sans text-[13px] tracking-tight">
                    {item.title}
                  </span>

                  {isItemActive && (
                    <div className="absolute top-1/2 left-0 h-4 w-1 -translate-y-1/2 rounded-r-pill bg-primary" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              defaultOpen={item.isActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="h-9 px-4 text-muted-foreground/60 hover:bg-transparent hover:text-foreground/90"
                  />
                }
              >
                <div className="mr-3 text-muted-foreground/30 group-hover:text-muted-foreground/60">
                  {React.isValidElement(item.icon)
                    ? React.cloneElement(item.icon as React.ReactElement<any>, {
                        className: "size-4.5 stroke-[1.5px]",
                      })
                    : item.icon}
                </div>
                <span className="text-[14px] tracking-tight">{item.title}</span>
                <RiArrowRightSLine className="ml-auto size-4 opacity-30 transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="ml-4 space-y-1 border-border/40 border-l py-1.5">
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        onClick={() => {
                          window.location.href = subItem.url;
                        }}
                        className="h-8 text-[13px] text-muted-foreground/50 transition-colors hover:text-foreground"
                      >
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
