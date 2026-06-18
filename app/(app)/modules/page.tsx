import type { Metadata } from 'next'
import { connection } from 'next/server'
import ClientPage from './client'

export const metadata: Metadata = {
  title: 'Modules',
  description:
    'Explore curriculum-aligned virtual science lab modules for JHS and SHS students across Chemistry, Physics, and Biology.',
}

export default async function Page() {
  await connection()
  return <ClientPage />
}
