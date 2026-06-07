'use client'

import * as React from 'react'
import { AdminShell } from '@/components/layout/admin-shell'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  UsersIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserCheckIcon,
  ArrowRightIcon,
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, modulesRes] = await Promise.all([
          fetch('/api/admin/users').then(r => r.json()),
          fetch('/api/admin/modules').then(r => r.json())
        ])

        const users = usersRes?.data?.users || []
        const modules = modulesRes?.data?.modules || []

        const totalUsers = users.length
        const teachers = users.filter((u: any) => u.userRole === 'teacher').length
        const students = users.filter((u: any) => u.userRole === 'student').length
        const admins = users.filter((u: any) => u.role === 'admin').length

        const totalModules = modules.length
        const pendingModules = modules.filter((m: any) => m.status === 'pending').length
        const approvedModules = modules.filter((m: any) => m.status === 'approved').length

        setData({
          totalUsers,
          teachers,
          students,
          admins,
          totalModules,
          pendingModules,
          approvedModules,
          users: users.slice(0, 5), // last 5 users
          pendingList: modules.filter((m: any) => m.status === 'pending')
        })
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <AdminShell title="Dashboard">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-8 text-amber-600 dark:text-amber-500" />
            <p className="text-sm text-muted-foreground font-medium">Loading dashboard statistics...</p>
          </div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Admin Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time telemetry and management controls for OpenLearn.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-amber-500 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Users</CardTitle>
                <div className="text-3xl font-extrabold tracking-tight">{data.totalUsers}</div>
              </div>
              <div className="rounded-md bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
                <UsersIcon className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="font-semibold text-foreground">{data.students}</span> students &middot; <span className="font-semibold text-foreground">{data.teachers}</span> teachers
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Labs</CardTitle>
                <div className="text-3xl font-extrabold tracking-tight">{data.approvedModules}</div>
              </div>
              <div className="rounded-md bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                <BeakerIcon className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Approved and live lab simulations
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-rose-500 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Review</CardTitle>
                <div className="text-3xl font-extrabold tracking-tight">{data.pendingModules}</div>
              </div>
              <div className="rounded-md bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                <ClockIcon className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Requires validation to make live
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admins</CardTitle>
                <div className="text-3xl font-extrabold tracking-tight">{data.admins}</div>
              </div>
              <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                <ShieldCheckIcon className="size-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Users with system-wide root access
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Detail Split Panel */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Module approvals */}
          <Card className="lg:col-span-2 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <div>
                <CardTitle className="text-lg">Needs Review</CardTitle>
                <CardDescription className="text-xs">Modules submitted by teachers waiting for approval.</CardDescription>
              </div>
              <Link href="/admin/modules">
                <Button variant="outline" size="sm" className="gap-1 border-amber-600/20 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/20">
                  Manage Modules
                  <ArrowRightIcon className="size-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              {data.pendingList.length === 0 ? (
                <div className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
                  <UserCheckIcon className="size-8 text-muted-foreground/60 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">All modules approved!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Nothing is currently waiting in the approval queue.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.pendingList.map((mod: any) => (
                    <div key={mod.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border p-4 gap-4 bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div>
                        <h4 className="font-semibold text-sm">{mod.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          By <span className="font-medium text-foreground">{mod.author}</span> &middot; {mod.subject}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{mod.description}</p>
                      </div>
                      <Link href="/admin/modules" className="shrink-0">
                        <Button size="sm" className="bg-amber-600 text-white hover:bg-amber-700">
                          Review
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Newest Users */}
          <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <div>
                <CardTitle className="text-lg">Recent Sign Ups</CardTitle>
                <CardDescription className="text-xs">Newly registered accounts.</CardDescription>
              </div>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              {data.users.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No users found.</p>
              ) : (
                <div className="space-y-4">
                  {data.users.map((user: any) => {
                    const userInitials = user.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                    return (
                      <div key={user.id} className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700 font-bold text-xs dark:bg-amber-950/20 dark:text-amber-400 border border-amber-600/10">
                          {userInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate leading-none text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate mt-1">{user.email}</p>
                        </div>
                        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-2xs font-semibold ring-1 ring-inset capitalize bg-muted text-muted-foreground ring-muted/20">
                          {user.userRole || 'Pending'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
