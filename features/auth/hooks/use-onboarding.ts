import { useSession } from '@/adapters/auth/client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function useOnboarding() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const isComplete = session.user.onboarded
      const isOnboardingPage = pathname === '/onboarding'

      if (!isComplete && !isOnboardingPage) {
        router.push('/onboarding')
      } else if (isComplete && isOnboardingPage) {
        router.push('/app')
      }
    }
  }, [session, status, pathname, router])

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}
