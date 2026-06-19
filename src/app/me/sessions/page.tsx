import * as React from 'react'
import { Metadata } from 'next'
import { SessionsClient } from './client'

export const metadata: Metadata = {
  title: 'Lab Sessions | OpenLearn',
  description: 'Manage and join live collaborative laboratory sessions.',
}

export default function SessionsPage() {
  return <SessionsClient />
}
