import * as React from 'react'
import { Metadata } from 'next'
import { LoginClient } from './client'

export const metadata: Metadata = {
  title: 'Sign In | OpenLearn',
  description: 'Sign in to your OpenLearn account to access your labs and dashboard.',
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="text-center p-4">Loading form...</div>}>
      <LoginClient />
    </React.Suspense>
  )
}
