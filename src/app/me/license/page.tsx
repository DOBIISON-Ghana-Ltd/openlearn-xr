import * as React from 'react'
import { Metadata } from 'next'
import { LicenseClient } from './client'

export const metadata: Metadata = {
  title: 'Organization License | OpenLearn',
  description: 'Manage your organization subscription and billing.',
}

export default function LicensePage() {
  return <LicenseClient />
}
