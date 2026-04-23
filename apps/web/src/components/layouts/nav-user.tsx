"use client";

import { BadgeCheckIcon, ChevronsUpDownIcon, LogOutIcon, Sparkles } from "lucide-react";
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
              <SidebarMenuButton
                className="hover:bg-transparent active:bg-transparent"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-pill border border-border/20 shadow-ethereal">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-pill bg-secondary/50 text-muted-foreground/50 text-[10px] font-bold">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight ml-2">
              <span className="truncate text-[13px] font-medium text-foreground tracking-tight">{user.name}</span>
              <span className="truncate text-muted-foreground/40 text-[11px] font-medium tracking-tight">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-3 w-3 text-muted-foreground/20" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className=""
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={12}
          >
           <DropdownMenuGroup>
             <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-4 text-left border-b border-border/40 mb-2">
                <Avatar className="h-10 w-10 rounded-xl border border-border/50 shadow-sm">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-xl bg-secondary text-muted-foreground text-[12px] font-bold">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-[14px] font-bold text-foreground tracking-tight">{user.name}</span>
                  <span className="truncate text-muted-foreground text-[12px] font-medium tracking-tight">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuGroup>
              <Link href="/dashboard/settings" passHref>
                <DropdownMenuItem>
                  <BadgeCheckIcon />
                  Account Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Sparkles  />
                Plan Details
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="my-0.5 bg-border/40" />
            
            <DropdownMenuItem
              onClick={handleLogout}
            >
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
           </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
