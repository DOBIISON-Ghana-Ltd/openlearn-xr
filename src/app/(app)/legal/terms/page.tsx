import * as React from 'react'
import { Metadata } from 'next'
import { LegalLayout } from '@/components/app/legal-layout'
import { TERMS_OF_SERVICE } from '@/lib/constants/legal'

export const metadata: Metadata = {
  title: 'Terms of Service | OpenLearn',
  description: 'Terms of Service and conditions for using the OpenLearn platform.',
}

export default function TermsPage() {
  return <LegalLayout content={TERMS_OF_SERVICE} />
}
