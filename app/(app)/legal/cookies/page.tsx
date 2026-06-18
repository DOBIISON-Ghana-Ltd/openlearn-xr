import * as React from 'react'
import { Metadata } from 'next'
import { LegalLayout } from '@/components/app/legal-layout'
import { COOKIE_POLICY } from '@/lib/constants/legal'

export const metadata: Metadata = {
  title: 'Cookie Policy | OpenLearn',
  description: 'Cookie Policy explaining how we use cookies on our educational platform.',
}

export default function CookiesPage() {
  return <LegalLayout content={COOKIE_POLICY} />
}
