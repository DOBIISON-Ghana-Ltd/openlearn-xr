import * as React from 'react'
import { Metadata } from 'next'
import { ForgotPasswordClient } from './client'

export const metadata: Metadata = {
  title: 'Forgot Password | OpenLearn',
  description: 'Enter your email address to reset your OpenLearn account password.',
}

export default function ForgotPasswordPage() {
  return (
    <React.Suspense fallback={<div className="text-center p-4">Loading form...</div>}>
      <ForgotPasswordClient />
    </React.Suspense>
  )
}
