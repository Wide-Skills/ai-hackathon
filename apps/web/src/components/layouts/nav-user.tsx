"use client";

import {
  RiArrowUpDownLine,
  RiLogoutCircleLine,
  RiSparklingLine,
  RiUserLine,
} from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth");
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton className="rounded-standard transition-colors hover:bg-bg-alt/30 active:bg-bg-alt/50" />
            }
          >
            <Avatar className="h-7 w-7 rounded-micro border border-line">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-micro bg-bg-deep font-bold text-[10px] text-ink-faint">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2 grid flex-1 text-left leading-tight">
              <span className="truncate font-medium font-sans text-[13px] text-primary tracking-tight">
                {user.name}
              </span>
              <span className="truncate font-normal font-sans text-[11px] text-ink-faint tracking-tight">
                {user.email}
              </span>
            </div>
            <RiArrowUpDownLine className="ml-auto size-3.5 text-ink-faint opacity-40" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 border-line bg-surface shadow-none"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={12}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-base border-line border-b bg-bg/20 px-4 py-4 text-left">
                  <Avatar className="h-9 w-9 rounded-micro border border-line">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-micro bg-bg-deep font-bold text-[11px] text-ink-faint">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-serif text-[15px] text-primary">
                      {user.name}
                    </span>
                    <span className="truncate font-normal font-sans text-[11px] text-ink-faint">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuGroup>
                <Link href="/dashboard/settings" passHref>
                  <DropdownMenuItem>
                    <RiUserLine className="size-4" />
                    Account Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <RiSparklingLine className="size-4" />
                  Plan Details
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-0.5 bg-border/40" />

              <DropdownMenuItem onClick={handleLogout}>
                <RiLogoutCircleLine className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
