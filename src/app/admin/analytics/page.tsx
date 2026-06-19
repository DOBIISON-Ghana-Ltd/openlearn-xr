'use client'

import * as React from 'react'
import { AdminShell } from '@/components/layout/admin-shell'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { toastManager } from '@/components/ui/toast'

export default function AdminAnalyticsPage() {
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/users')
        const payload = await res.json()
        const users = payload?.data?.users || []

        const total = users.length
        const onboarded = users.filter((u: any) => u.onboarded).length
        const nonOnboarded = total - onboarded

        const teachers = users.filter((u: any) => u.userRole === 'teacher').length
        const students = users.filter((u: any) => u.userRole === 'student').length

        const conversionRate = total > 0 ? Math.round((onboarded / total) * 100) : 0

        setData({
          total,
          onboarded,
          nonOnboarded,
          teachers,
          students,
          conversionRate,
        })
      } catch (error) {
        console.error('Error loading analytics:', error)
        toastManager.add({
          title: 'Error',
          description: 'Failed to compute system metrics',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <AdminShell title="Analytics Panel">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="size-8 text-amber-600 dark:text-amber-500" />
            <p className="text-sm text-muted-foreground font-medium">Computing analytics metrics...</p>
          </div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Analytics Panel">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Onboarding &amp; Usage Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Conversion metrics and user role breakdown for the OpenLearn pilot program.
          </p>
        </div>

        {/* Top Funnel Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card className="shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider">Onboarding Funnel Conversion</CardDescription>
              <CardTitle className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {data.conversionRate}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted rounded-full h-2 mt-1">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${data.conversionRate}%` }}
                />
              </div>
              <p className="text-2xs text-muted-foreground mt-2">
                {data.onboarded} of {data.total} users finished onboarding
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider">Teacher Ratio</CardDescription>
              <CardTitle className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {data.onboarded > 0 ? Math.round((data.teachers / data.onboarded) * 100) : 0}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted rounded-full h-2 mt-1">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${data.onboarded > 0 ? (data.teachers / data.onboarded) * 100 : 0}%` }}
                />
              </div>
              <p className="text-2xs text-muted-foreground mt-2">
                {data.teachers} total teacher accounts
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider">Student Ratio</CardDescription>
              <CardTitle className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {data.onboarded > 0 ? Math.round((data.students / data.onboarded) * 100) : 0}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted rounded-full h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${data.onboarded > 0 ? (data.students / data.onboarded) * 100 : 0}%` }}
                />
              </div>
              <p className="text-2xs text-muted-foreground mt-2">
                {data.students} total student accounts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visual Funnel Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Conversion Funnel Details */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg">Onboarding Funnel Steps</CardTitle>
              <CardDescription className="text-xs">Dropout rates across registration and onboarding stages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Registered */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded bg-amber-50 text-amber-700 font-bold text-2xs dark:bg-amber-950/20 dark:text-amber-400">1</span>
                    User Sign Up (Registration)
                  </span>
                  <span className="font-semibold">{data.total} (100%)</span>
                </div>
                <div className="h-4 bg-muted rounded-md relative overflow-hidden">
                  <div className="h-full bg-amber-600/20 w-full" />
                </div>
              </div>

              {/* Step 2: Completed Onboarding */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="flex size-5 items-center justify-center rounded bg-amber-50 text-amber-700 font-bold text-2xs dark:bg-amber-950/20 dark:text-amber-400">2</span>
                    Role Selection (Onboarded)
                  </span>
                  <span className="font-semibold">
                    {data.onboarded} ({data.conversionRate}%)
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-md relative overflow-hidden">
                  <div
                    className="h-full bg-amber-600 transition-all duration-500"
                    style={{ width: `${data.conversionRate}%` }}
                  />
                </div>
              </div>

              {/* Bounce rate stats */}
              <div className="rounded-xl border border-dashed border-border p-4 bg-muted/10 text-center">
                <p className="text-xs text-muted-foreground">
                  Funnel Dropout: <span className="font-semibold text-rose-600">{data.nonOnboarded} users</span> ({100 - data.conversionRate}%) abandoned process before role selection.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User distribution */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg">User Role Distribution</CardTitle>
              <CardDescription className="text-xs">Breakdown of roles selected during the onboarding wizard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Teachers bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Teachers</span>
                    <span>
                      {data.teachers} ({data.onboarded > 0 ? Math.round((data.teachers / data.onboarded) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full relative overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${data.onboarded > 0 ? (data.teachers / data.onboarded) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Students bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Students</span>
                    <span>
                      {data.students} ({data.onboarded > 0 ? Math.round((data.students / data.onboarded) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full relative overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${data.onboarded > 0 ? (data.students / data.onboarded) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Pending role selection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Abandoned/Pending</span>
                    <span>
                      {data.nonOnboarded} ({data.total > 0 ? Math.round((data.nonOnboarded / data.total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full relative overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground/40 transition-all duration-500"
                      style={{ width: `${data.total > 0 ? (data.nonOnboarded / data.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="text-2xs text-muted-foreground uppercase tracking-wider block">Completed</span>
                    <span className="text-lg font-bold text-foreground">{data.onboarded}</span>
                  </div>
                  <div>
                    <span className="text-2xs text-muted-foreground uppercase tracking-wider block">Incomplete</span>
                    <span className="text-lg font-bold text-foreground">{data.nonOnboarded}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
