import { prisma } from '@/adapters/db/client'
import { auth } from '@/adapters/auth/server'
import { headers } from 'next/headers'
import { jsend } from '@/server/api/utils/jsend'

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== 'admin') {
    return jsend.fail({ message: 'Forbidden' }, 'Forbidden', 403)
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return jsend.success({ users })
  } catch (error: any) {
    return jsend.error(error.message || 'Failed to fetch users')
  }
}

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== 'admin') {
    return jsend.fail({ message: 'Forbidden' }, 'Forbidden', 403)
  }

  try {
    const body = await req.json()
    const { userId, role, onboarded } = body

    if (!userId) {
      return jsend.fail({ message: 'User ID is required' }, 'Bad Request', 400)
    }

    const data: any = {}
    if (role !== undefined) data.role = role
    if (onboarded !== undefined) data.onboarded = onboarded

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    })

    return jsend.success({ user: updatedUser })
  } catch (error: any) {
    return jsend.error(error.message || 'Failed to update user')
  }
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== 'admin') {
    return jsend.fail({ message: 'Forbidden' }, 'Forbidden', 403)
  }

  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return jsend.fail({ message: 'User ID is required' }, 'Bad Request', 400)
    }

    if (userId === session.user.id) {
      return jsend.fail({ message: 'Cannot delete your own account' }, 'Bad Request', 400)
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    return jsend.success({ deleted: true })
  } catch (error: any) {
    return jsend.error(error.message || 'Failed to delete user')
  }
}
