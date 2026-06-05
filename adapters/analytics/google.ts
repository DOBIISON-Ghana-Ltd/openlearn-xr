import Cookies from 'js-cookie'

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function trackGAEvent(event: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return
  const consent = Cookies.get('openlearn-cookie-consent')
  if (consent !== 'accepted') return

  const anyWindow = window as any
  if (anyWindow.gtag && GA_MEASUREMENT_ID) {
    anyWindow.gtag('event', event, properties)
  }
}
