import { auth } from '@/adapters/auth/server'
import { headers } from 'next/headers'
import { jsend } from '@/server/api/utils/jsend'

// In-memory mock modules for admin panel demonstration
let mockModules = [
  {
    id: 'circuit-lab',
    title: 'Electric Circuits',
    subject: 'Physics',
    description: 'Build series and parallel circuits to understand current, voltage, and Ohm\'s Law.',
    difficulty: 'Medium',
    status: 'approved',
    author: 'Dr. Sarah Connor',
    createdAt: '2026-05-15T08:00:00Z',
  },
  {
    id: 'titration-lab',
    title: 'Acid-Base Titration',
    subject: 'Chemistry',
    description: 'Determine the concentration of an unknown acid using indicators and titration.',
    difficulty: 'Hard',
    status: 'approved',
    author: 'Prof. Walter White',
    createdAt: '2026-05-16T09:30:00Z',
  },
  {
    id: 'mitosis-lab',
    title: 'Cell Division (Mitosis)',
    subject: 'Biology',
    description: 'Observe phases of mitosis and identify chromosome behaviors.',
    difficulty: 'Easy',
    status: 'approved',
    author: 'Dr. Jane Goodall',
    createdAt: '2026-05-18T11:00:00Z',
  },
  {
    id: 'quantum-physics-lab',
    title: 'Quantum Tunneling Simulation',
    subject: 'Physics',
    description: 'Explore wave functions and quantum mechanics in a 3D potential barrier.',
    difficulty: 'Hard',
    status: 'pending',
    author: 'Dr. Richard Feynman',
    createdAt: '2026-06-01T14:20:00Z',
  },
  {
    id: 'organic-chem-builder',
    title: 'Organic Molecule Constructor',
    subject: 'Chemistry',
    description: 'Assemble complex carbon chains and view functional group configurations in 3D.',
    difficulty: 'Medium',
    status: 'pending',
    author: 'Dr. Alice Smith',
    createdAt: '2026-06-02T10:15:00Z',
  },
]

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== 'admin') {
    return jsend.fail({ message: 'Forbidden' }, 'Forbidden', 403)
  }

  return jsend.success({ modules: mockModules })
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
    const { id, status } = body

    if (!id || !status) {
      return jsend.fail({ message: 'Module ID and Status are required' }, 'Bad Request', 400)
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return jsend.fail({ message: 'Invalid status' }, 'Bad Request', 400)
    }

    const index = mockModules.findIndex(m => m.id === id)
    if (index === -1) {
      return jsend.fail({ message: 'Module not found' }, 'Not Found', 404)
    }

    mockModules[index] = {
      ...mockModules[index],
      status,
    }

    return jsend.success({ module: mockModules[index] })
  } catch (error: any) {
    return jsend.error(error.message || 'Failed to update module')
  }
}
