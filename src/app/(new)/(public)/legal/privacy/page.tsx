import * as React from 'react'
import { Metadata } from 'next'
import { LegalLayout } from '@/components/(new)/common/legal-layout'
import { PRIVACY_POLICY } from '@/lib/constants/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy describing how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return <LegalLayout content={PRIVACY_POLICY} />
}
