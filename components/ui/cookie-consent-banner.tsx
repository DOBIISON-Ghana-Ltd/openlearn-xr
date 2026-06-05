'use client'

import * as React from 'react'
import Cookies from 'js-cookie'
import { motion, AnimatePresence } from 'motion/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CookieConsentBanner() {
  const [show, setShow] = React.useState(false)

  React.useEffect(() => {
    const consent = Cookies.get('openlearn-cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  const handleConsent = (value: 'accepted' | 'denied') => {
    Cookies.set('openlearn-cookie-consent', value, { expires: 365 })
    setShow(false)
    window.dispatchEvent(new Event('cookie-consent-change'))
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl"
        >
          <Card className="flex flex-col gap-4 p-5 shadow-2xl border border-emerald-100/50 bg-background dark:border-neutral-800">
            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-sm text-foreground">Cookie Consent</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We use cookies to personalize content, analyze our traffic, and improve virtual labs. You can choose to accept or deny optional analytical tracking. Read our{' '}
                <a href="/legal/cookies" className="underline hover:text-foreground">
                  Cookie Policy
                </a>{' '}
                for details.
              </p>
            </div>
            <div className="flex gap-2.5 justify-end">
              <Button size="sm" variant="ghost" onClick={() => handleConsent('denied')}>
                Deny
              </Button>
              <Button size="sm" onClick={() => handleConsent('accepted')}>
                Accept
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default CookieConsentBanner
