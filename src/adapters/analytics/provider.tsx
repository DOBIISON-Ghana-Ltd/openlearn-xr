'use client'

import * as React from 'react'
import Cookies from 'js-cookie'
import Script from 'next/script'
import { initPostHog, trackPostHogEvent, identifyPostHogUser } from './posthog'
import { trackGAEvent, GA_MEASUREMENT_ID } from './google'

interface AnalyticsContextType {
  track: (event: string, properties?: Record<string, any>) => void
  identify: (userId: string, properties?: Record<string, any>) => void
  consent: 'accepted' | 'denied' | null
}

const AnalyticsContext = React.createContext<AnalyticsContextType>({
  track: () => {},
  identify: () => {},
  consent: null,
})

export function useAnalytics() {
  return React.useContext(AnalyticsContext)
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = React.useState<'accepted' | 'denied' | null>(null)

  const checkConsent = React.useCallback(() => {
    const value = Cookies.get('openlearn-cookie-consent') as 'accepted' | 'denied' | undefined
    setConsent(value || null)
    if (value === 'accepted') {
      initPostHog()
    }
  }, [])

  React.useEffect(() => {
    checkConsent()
    window.addEventListener('cookie-consent-change', checkConsent)
    return () => {
      window.removeEventListener('cookie-consent-change', checkConsent)
    }
  }, [checkConsent])

  const track = React.useCallback((event: string, properties?: Record<string, any>) => {
    if (consent !== 'accepted') return
    trackPostHogEvent(event, properties)
    trackGAEvent(event, properties)
  }, [consent])

  const identify = React.useCallback((userId: string, properties?: Record<string, any>) => {
    if (consent !== 'accepted') return
    identifyPostHogUser(userId, properties)
  }, [consent])

  return (
    <AnalyticsContext.Provider value={{ track, identify, consent }}>
      {children}
      {consent === 'accepted' && GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}
    </AnalyticsContext.Provider>
  )
}
export default AnalyticsProvider
