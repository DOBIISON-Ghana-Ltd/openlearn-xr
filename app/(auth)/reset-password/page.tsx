import * as React from 'react'
import { Metadata } from 'next'
import { ResetPasswordClient } from './client'

export const metadata: Metadata = {
  title: 'Reset Password | OpenLearn',
  description: 'Enter your new password to secure your OpenLearn account.',
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="text-center p-4">Loading form...</div>}>
      <ResetPasswordClient />
    </React.Suspense>
  )
}
