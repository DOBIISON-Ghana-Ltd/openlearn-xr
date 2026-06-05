import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/adapters/auth/server'

export const { GET, POST } = toNextJsHandler(auth)
