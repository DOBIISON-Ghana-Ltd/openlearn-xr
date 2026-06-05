'use client'

import * as React from 'react'
import { useSession } from '@/adapters/auth/client'
import { useRouter, usePathname } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export default function AppRouteLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
    } else if (status === 'authenticated' && session?.user) {
      if (!session.user.onboarded) {
        router.push('/onboarding')
      }
    }
  }, [session, status, pathname, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Checking session...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (status === 'authenticated' && session?.user && !session.user.onboarded) {
    return null
  }

  return <>{children}</>
}
