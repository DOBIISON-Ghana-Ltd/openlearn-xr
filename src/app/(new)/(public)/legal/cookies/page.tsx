import * as React from 'react'
import { Metadata } from 'next'
import { COOKIE_POLICY } from '@/lib/constants/legal'
import { LegalLayout } from '@/components/(new)/common/legal-layout'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy explaining how we use cookies on our educational platform.',
}

export default function CookiesPage() {
  return <LegalLayout content={COOKIE_POLICY} />
}
