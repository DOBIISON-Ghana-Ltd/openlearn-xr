import { z } from 'zod'

export const idSchema = z.string().min(12).max(12)

export const paginationParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export type PaginationParams = z.infer<typeof paginationParamsSchema>

export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
})

export type PaginationMeta = z.infer<typeof paginationMetaSchema>
