import * as React from 'react'
import { Metadata } from 'next'
import { VerifyEmailClient } from './client'

export const metadata: Metadata = {
  title: 'Verify Email | OpenLearn',
  description: 'Verify your email address to complete your OpenLearn account registration.',
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<div className="text-center p-4">Verifying...</div>}>
      <VerifyEmailClient />
    </React.Suspense>
  )
}
