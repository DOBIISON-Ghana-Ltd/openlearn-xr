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
  UsersIcon,
  BeakerIcon,
  BarChart3Icon,
  ArrowLeftIcon,
} from 'lucide-react'

export function AdminNav() {
  const pathname = usePathname()

  const links = [
    { label: 'Admin Dashboard', href: '/admin', icon: LayoutDashboardIcon },
    { label: 'Manage Modules', href: '/admin/modules', icon: BeakerIcon },
    { label: 'Manage Users', href: '/admin/users', icon: UsersIcon },
    { label: 'Analytics Panel', href: '/admin/analytics', icon: BarChart3Icon },
  ]

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border/50 py-4 px-6 bg-amber-950/10 dark:bg-amber-950/20">
        <Link href="/admin" className="flex items-center gap-2 text-lg font-bold tracking-tight text-amber-700 dark:text-amber-400">
          <span className="flex size-7 items-center justify-center rounded-md bg-amber-700 text-white font-black text-sm">
            A
          </span>
          OpenLearn Admin
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  isActive={isActive}
                  render={<Link href={link.href} />}
                  className="hover:bg-amber-50 dark:hover:bg-amber-950/10"
                >
                  <Icon className="size-4" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/app" />}>
              <ArrowLeftIcon className="size-4" />
              <span>Back to App</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
export default AdminNav
