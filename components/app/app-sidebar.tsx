"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Compass, 
  PlayCircle, 
  Users, 
  Globe,
  Settings, 
  ChevronDown
} from "lucide-react";
import useApi from "@/data/hooks/use-api";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const { data } = useApi.query("public:user:get:me");
  const userName = data?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const avatarUrl = data?.image || "";
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/app", icon: Home },
    { name: "Modules", href: "/app/modules", icon: Compass },
    { name: "Sessions", href: "/app/sessions", icon: Users },
    { name: "Community", href: "/app/community", icon: Globe },
    { name: "My Plays", href: "/app/my-plays", icon: PlayCircle },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border/50">
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <button className="flex items-center gap-2 hover:bg-sidebar-accent/50 p-2 rounded-md transition-colors w-full justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-8 rounded-md">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-emerald-600 text-white text-sm rounded-md">{userInitial}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">{userName}</span>
              <span className="text-xs text-muted-foreground">OpenLearn</span>
            </div>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      render={<Link href={item.href} />}
                      isActive={isActive} 
                      className={isActive ? "bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300" : ""}
                    >
                      <item.icon className="size-4" />
                      <span className="font-medium">{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
