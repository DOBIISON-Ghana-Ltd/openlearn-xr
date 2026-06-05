import { z } from 'zod'
import { paginationMetaSchema } from '../../schema.base'

export const sessionSchema = z.object({
  id: z.string(),
  code: z.string(),
  status: z.enum(['active', 'completed']),
  hostId: z.string(),
  moduleId: z.string(),
  createdAt: z.string(),
})

export type SessionData = z.infer<typeof sessionSchema>

export const sessionListResponseSchema = z.object({
  items: z.array(sessionSchema),
  meta: paginationMetaSchema,
})
