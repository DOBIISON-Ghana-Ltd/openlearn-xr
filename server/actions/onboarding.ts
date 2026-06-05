'use server'

import { auth } from '@/adapters/auth/server'
import { prisma } from '@/adapters/db/client'
import { headers } from 'next/headers'

export async function completeOnboarding(role: 'teacher' | 'student') {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session || !session.user) {
    throw new Error('Unauthorized')
  }

  const userId = session.user.id

  await prisma.user.update({
    where: { id: userId },
    data: {
      onboarded: true,
      userRole: role,
    },
  })

  return { success: true }
}
