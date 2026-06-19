import * as React from 'react'
import { Metadata } from 'next'
import { MyPlaysClient } from './client'

export const metadata: Metadata = {
  title: 'My Plays | OpenLearn',
  description: 'View your completed lab runs and scores.',
}

export default function MyPlaysPage() {
  return <MyPlaysClient />
}
