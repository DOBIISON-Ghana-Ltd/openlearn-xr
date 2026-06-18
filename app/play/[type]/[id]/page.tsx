import type { Metadata } from 'next'
import { connection } from 'next/server'
import ClientPage from './client'

export const metadata: Metadata = {
  title: 'Play | Lab',
  description: 'Enter the virtual science lab.',
}

export default async function Page() {
  await connection()
  return <ClientPage />
}
