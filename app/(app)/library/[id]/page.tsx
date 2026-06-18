import type { Metadata } from 'next'
import { connection } from 'next/server'
import ClientPage from './client'

export const metadata: Metadata = {
  title: 'One | Library',
  description:
    'Browse curriculum-aligned virtual science lab collections for JHS and SHS students across Chemistry, Physics, and Biology.',
}

export default async function Page() {
  await connection()
  return <ClientPage />
}

