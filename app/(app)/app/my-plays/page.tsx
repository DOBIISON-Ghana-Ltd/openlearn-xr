import * as React from 'react'
import { Metadata } from 'next'
import { MyPlaysClient } from './client'
import { AppShell } from '@/components/layout/app-shell'

export const metadata: Metadata = {
  title: 'My Plays | OpenLearn',
  description: 'View your completed lab runs and scores.',
}

export default function MyPlaysPage() {
  return (
    <AppShell title="My Plays">
      <MyPlaysClient />
    </AppShell>
  )
}
