'use client'

import * as React from 'react'
import { useSession } from '@/adapters/auth/client'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=%2Fadmin')
    } else if (status === 'authenticated' && session?.user) {
      if (session.user.role !== 'admin') {
        router.push('/app')
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8 text-amber-600 dark:text-amber-500" />
          <p className="text-sm text-muted-foreground font-medium">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (status === 'authenticated' && session?.user && session.user.role !== 'admin') {
    return null
  }

  return <>{children}</>
}
