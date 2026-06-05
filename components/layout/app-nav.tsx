'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  LayoutDashboardIcon,
  BeakerIcon,
  UsersIcon,
  TrophyIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  LogOutIcon,
} from 'lucide-react'
import { useSession, signOut } from '@/adapters/auth/client'

export function AppNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'admin'

  const links = [
    { label: 'Dashboard', href: '/app', icon: LayoutDashboardIcon },
    { label: 'Explore Modules', href: '/app/modules', icon: BeakerIcon },
    { label: 'Sessions', href: '/app/sessions', icon: UsersIcon },
    { label: 'My Plays', href: '/app/my-plays', icon: TrophyIcon },
    { label: 'Community', href: '/app/community', icon: MessageSquareIcon },
  ]

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border/50 py-4 px-6">
        <Link href="/app" className="flex items-center gap-2 text-lg font-bold tracking-tight text-sidebar-foreground">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-black text-sm">
            O
          </span>
          OpenLearn
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton isActive={isActive} render={<Link href={link.href} />}>
                  <Icon className="size-4" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}

          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname.startsWith('/admin')}
                render={<Link href="/admin" />}
                className="text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              >
                <ShieldCheckIcon className="size-4" />
                <span>Admin Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut({ callbackURL: '/' })}>
              <LogOutIcon className="size-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
export default AppNav
