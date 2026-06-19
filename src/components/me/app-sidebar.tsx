"use client";

import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  PlayCircle,
  CreditCard,
  BookOpen,
  Video,
  ChevronDown,
  Plus,
  Check,
  Building2,
  LogOut,
  User,
  Trophy,
  Loader2,
} from "lucide-react";
import useApi from "@/data/hooks/use-api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/adapters/auth/client";
import { cn } from "@/lib/utils/cn";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/lib/constants/routes";
import { useRouter } from "next/navigation";
import { getUniqueSlug } from "@/lib/utils/get-unique-slug";

// ============================================================================
// NAV ORG SWITCHER
// ============================================================================
function NavOrgSwitcher() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: orgList } = authClient.useListOrganizations();
  const [open, setOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [creating, setCreating] = useState(false);
  const queryClient = useQueryClient();

  const handleSetActive = async (orgId: string) => {
    await authClient.organization.setActive({ organizationId: orgId });
    setOpen(false);
    queryClient.invalidateQueries();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setCreating(true);
    try {
      await authClient.organization.create({
        name: newOrgName.trim(),
        slug: getUniqueSlug(newOrgName.trim())
      });
      setNewOrgName("");
      setShowCreate(false);
      setOpen(false);
      queryClient.invalidateQueries();
    } finally {
      setCreating(false);
    }
  };

  const activeOrgInitial = activeOrg?.name?.charAt(0)?.toUpperCase() ?? "O";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 hover:bg-sidebar-accent/60 p-2 rounded-md transition-colors w-full justify-between group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="size-7 rounded-md shrink-0">
            <AvatarImage src={activeOrg?.logo ?? undefined} />
            <AvatarFallback className="bg-emerald-600 text-white text-xs rounded-md font-semibold">
              {activeOrgInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-sm font-semibold truncate max-w-[140px]">
              {activeOrg?.name ?? "Select Organization"}
            </span>
            <span className="text-[10px] text-muted-foreground">Organization</span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform duration-200 shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 py-1 overflow-hidden">
          <div className="px-2 py-1">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1 mb-1">
              Organizations
            </p>
            {orgList?.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSetActive(org.id)}
                className="flex items-center gap-2.5 w-full p-2 rounded-md hover:bg-sidebar-accent/60 transition-colors text-left"
              >
                <Avatar className="size-6 rounded-md shrink-0">
                  <AvatarImage src={org.logo ?? undefined} />
                  <AvatarFallback className="bg-emerald-600 text-white text-[10px] rounded-md font-semibold">
                    {org.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate flex-1">{org.name}</span>
                {org.id === activeOrg?.id && (
                  <Check className="size-3.5 text-emerald-500 shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-border mx-2 my-1" />

          {/* Create new org */}
          {showCreate ? (
            <form onSubmit={handleCreate} className="px-2 pb-1">
              <input
                autoFocus
                type="text"
                placeholder="Organization name…"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                className="w-full text-sm bg-background border border-border rounded-md px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-emerald-500 mb-1.5"
              />
              <div className="flex gap-1.5">
                <button
                  type="submit"
                  disabled={creating || !newOrgName.trim()}
                  className="flex-1 text-xs bg-emerald-600 text-white rounded-md py-1.5 font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  {creating && <Loader2 className="size-3 animate-spin" />}
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 text-xs bg-secondary text-secondary-foreground rounded-md py-1.5 font-medium hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-colors"
            >
              <Plus className="size-3.5" />
              New Organization
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// NAV MAIN — subscription-aware navigation
// ============================================================================
function NavMain() {
  const pathname = usePathname();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: subscription, isPending } = useApi.query(
    "public:org:get:subscription",
    activeOrg?.id ?? "",
    !!activeOrg?.id
  );

  const isSubscribed =
    subscription?.status === "ACTIVE" ||
    subscription?.status === "TRIALING";

  const freeLinks = [
    { name: "Dashboard", href: "/me", icon: LayoutDashboard },
    { name: "My Plays", href: "/me/my-plays", icon: PlayCircle },
  ];

  const premiumLinks = [
    { name: "Module Editor", href: "/me/editor", icon: BookOpen },
    { name: "Live Sessions", href: "/me/sessions", icon: Video },
  ];

  const licenseLink = { name: "License", href: "/me/license", icon: CreditCard };

  return (
    <SidebarContent className="overflow-hidden">
      {/* Free links — always visible */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {freeLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/me" && pathname.startsWith(item.href));
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

      {/* Premium links — only if subscribed */}
      {!isPending && isSubscribed && (
        <>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Studio
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {premiumLinks.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href);
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
        </>
      )}

      {/* License link — always visible */}
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href={licenseLink.href} />}
                isActive={pathname === licenseLink.href}
                className={cn(
                  pathname === licenseLink.href
                    ? "bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20"
                    : "",
                  !isSubscribed &&
                  "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                )}
              >
                <licenseLink.icon className="size-4" />
                <span className="font-medium">{licenseLink.name}</span>
                {!isSubscribed && !isPending && (
                  <span className="ml-auto text-[9px] font-bold bg-amber-500/20 text-amber-600 rounded px-1.5 py-0.5">
                    UPGRADE
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

// ============================================================================
// NAV USER — profile footer with dialog
// ============================================================================
function NavUser() {
  const { data: user } = useApi.query("public:user:get:me");
  const { mutate: logout } = useApi.mutate("public:user:logout");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const userName = user?.name ?? "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => router.push(ROUTES.LOGIN),
    });
  };

  return (
    <>
      <SidebarFooter className="border-t border-sidebar-border/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setDialogOpen(true)}
              className="h-auto py-2 hover:bg-sidebar-accent/60"
            >
              <Avatar className="size-7 rounded-md shrink-0">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="bg-neutral-700 text-white text-xs rounded-md font-semibold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="text-sm font-semibold truncate">{userName}</span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Profile Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Avatar className="size-10 rounded-lg">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="bg-neutral-700 text-white rounded-lg font-semibold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-base">{userName}</DialogTitle>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="account" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="account" className="flex-1 gap-1.5">
                <User className="size-3.5" />
                Account
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex-1 gap-1.5">
                <Trophy className="size-3.5" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Display Name
                </label>
                <div className="text-sm font-medium bg-secondary/50 rounded-md px-3 py-2">
                  {user?.name}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Email Address
                </label>
                <div className="text-sm bg-secondary/50 rounded-md px-3 py-2">
                  {user?.email}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Member Since
                </label>
                <div className="text-sm bg-secondary/50 rounded-md px-3 py-2">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                    : "—"}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                <Trophy className="size-10 text-amber-500 opacity-50" />
                <p className="text-sm font-medium text-muted-foreground">
                  No achievements yet
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Complete modules and sessions to earn XP and badges.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================================================
// MAIN EXPORT — AppSidebar
// ============================================================================
export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border/50">
      <SidebarHeader className="p-2 border-b border-sidebar-border/50">
        {/* Org Switcher */}
        <NavOrgSwitcher />
      </SidebarHeader>

      {/* Subscription-aware navigation */}
      <NavMain />

      {/* User profile + logout */}
      <NavUser />
    </Sidebar>
  );
}
