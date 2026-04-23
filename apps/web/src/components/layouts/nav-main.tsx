"use client";

import { ChevronRightIcon } from "lucide-react";
import { usePathname } from "next/navigation";
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
import React from "react";

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
      <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const isItemActive = pathname === item.url || (item.url !== '/dashboard' && pathname.startsWith(item.url)) || item.isActive;
          
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
                    "h-10 px-4 transition-all duration-300 rounded-lg relative group overflow-hidden mb-1",
                    "hover:bg-secondary/30 active:scale-[0.98]",
                    isItemActive 
                      ? "bg-secondary/50 text-foreground font-medium shadow-ethereal" 
                      : "text-muted-foreground/50 hover:text-foreground/80"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 transition-colors mr-3",
                    isItemActive ? "text-primary" : "text-muted-foreground/20 group-hover:text-muted-foreground/40"
                  )}>
                    {React.isValidElement(item.icon) 
                      ? React.cloneElement(item.icon as React.ReactElement<any>, { className: "size-4 stroke-[1.5px]" })
                      : item.icon
                    }
                  </div>
                  <span className="text-[14px] tracking-tight">{item.title}</span>
                  
                  {isItemActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-primary/60 rounded-r-full" />
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
                    className="h-9 px-4 text-muted-foreground/60 hover:text-foreground/90 hover:bg-transparent"
                  />
                }
              >
                <div className="text-muted-foreground/30 group-hover:text-muted-foreground/60 mr-3">
                  {React.isValidElement(item.icon)
                    ? React.cloneElement(item.icon as React.ReactElement<any>, { className: "size-4.5 stroke-[1.5px]" })
                    : item.icon
                  }
                </div>
                <span className="text-[14px] tracking-tight">{item.title}</span>
                <ChevronRightIcon className="ml-auto size-3.5 transition-transform duration-200 group-data-open/collapsible:rotate-90 opacity-30" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="ml-4 border-l border-border/40 py-1.5 space-y-1">
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        onClick={() => {
                          window.location.href = subItem.url;
                        }}
                        className="h-8 text-[13px] text-muted-foreground/50 hover:text-foreground transition-colors"
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
