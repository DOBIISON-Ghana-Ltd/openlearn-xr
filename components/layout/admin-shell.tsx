'use client'

import * as React from 'react'
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AdminNav } from './admin-nav'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/menu'
import { useSession, signOut } from '@/adapters/auth/client'
import Link from 'next/link'

interface AdminShellProps {
  children: React.ReactNode
  title?: string
}

export function AdminShell({ children, title = 'OpenLearn Admin' }: AdminShellProps) {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Admin'
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-sidebar-border/50">
        <AdminNav />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="font-semibold text-lg text-foreground">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer outline-none">
                <Avatar>
                  {session?.user?.image && <AvatarImage src={session.user.image} alt={userName} />}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <div className="px-3 py-2 text-xs border-b border-border text-muted-foreground">
                  <p className="font-semibold text-foreground truncate">{userName}</p>
                  <p className="truncate">{session?.user?.email}</p>
                </div>
                <DropdownMenuItem render={<Link href="/admin" />}>
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/app" />}>
                  User Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackURL: '/' })}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
export default AdminShell
