import Cookies from 'js-cookie'
import { env } from '@/lib/config/env'

const POSTHOG_KEY = env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = env.NEXT_PUBLIC_POSTHOG_HOST

let posthogInstance: any = null

export async function initPostHog() {
  if (typeof window === 'undefined') return null

  const consent = Cookies.get('openlearn-cookie-consent')
  if (consent !== 'accepted') {
    return null
  }

  try {
    const { default: posthog } = await import('posthog-js')
    if (POSTHOG_KEY) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        loaded: (ph) => {
          posthogInstance = ph
        },
      })
      return posthog
    }
  } catch (err) {
    console.error('Failed to initialize PostHog:', err)
  }
  return null
}

export function trackPostHogEvent(event: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return
  const consent = Cookies.get('openlearn-cookie-consent')
  if (consent !== 'accepted') return

  if (posthogInstance) {
    posthogInstance.capture(event, properties)
  } else {
    initPostHog().then((ph) => {
      if (ph) {
        ph.capture(event, properties)
      }
    })
  }
}

export function identifyPostHogUser(userId: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return
  const consent = Cookies.get('openlearn-cookie-consent')
  if (consent !== 'accepted') return

  if (posthogInstance) {
    posthogInstance.identify(userId, properties)
  } else {
    initPostHog().then((ph) => {
      if (ph) {
        ph.identify(userId, properties)
      }
    })
  }
}
