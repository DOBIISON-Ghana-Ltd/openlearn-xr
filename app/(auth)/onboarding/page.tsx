import * as React from 'react'
import { Metadata } from 'next'
import { OnboardingClient } from './client'

export const metadata: Metadata = {
  title: 'Onboarding | OpenLearn',
  description: 'Complete your profile setup to start exploring OpenLearn.',
}

export default function OnboardingPage() {
  return (
    <React.Suspense fallback={<div className="text-center p-4">Loading onboarding...</div>}>
      <OnboardingClient />
    </React.Suspense>
  )
}
