'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AppShell } from '@/components/layout/app-shell'
import { useSession } from '@/adapters/auth/client'
import { BeakerIcon, UsersIcon, TrophyIcon, ArrowRightIcon } from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'User'
  const userRole = session?.user?.userRole || 'student'

  return (
    <AppShell title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 p-6 md:p-8 text-white shadow-md dark:from-emerald-950 dark:to-emerald-900">
          <h2 className="text-2xl font-bold md:text-3xl">Welcome, {userName}!</h2>
          <p className="mt-2 text-emerald-100 text-sm md:text-base max-w-xl">
            You are logged in as a <span className="font-semibold capitalize">{userRole}</span>. Ready to explore interactive 3D science simulations?
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/app/modules">
              <Button className="bg-white border-white text-emerald-700 hover:bg-emerald-50">
                Explore Labs
                <ArrowRightIcon className="size-4 text-emerald-700" />
              </Button>
            </Link>
            {userRole === 'teacher' && (
              <Link href="/app/sessions">
                <Button className="bg-emerald-750 border-emerald-500/20 text-white hover:bg-emerald-700">
                  Host a Lab Session
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">My Plays</CardTitle>
                <div className="text-2xl font-bold">12</div>
              </div>
              <TrophyIcon className="size-6 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Completed simulation runs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Labs</CardTitle>
                <div className="text-2xl font-bold">4</div>
              </div>
              <BeakerIcon className="size-6 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Science modules available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">Hosted Sessions</CardTitle>
                <div className="text-2xl font-bold">2</div>
              </div>
              <UsersIcon className="size-6 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Collaborative group play</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
export default DashboardPage
