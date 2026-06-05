import * as React from 'react'
import { Metadata } from 'next'
import { RegisterClient } from './client'

export const metadata: Metadata = {
  title: 'Sign Up | OpenLearn',
  description: 'Create an OpenLearn account and start learning with interactive 3D science labs.',
}

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<div className="text-center p-4">Loading form...</div>}>
      <RegisterClient />
    </React.Suspense>
  )
}
