import { z } from 'zod'

export const ZOnboardingRole = z.enum(['educator', 'student', 'other'])

export const ZOnboardingMetadata = z.object({
  role: ZOnboardingRole,
  school: z.string().max(120, 'Too long').optional(),
  subjects: z
    .array(z.string())
    .min(1, 'Please select at least one subject of interest'),
})

export type IOnboardingMetadata = z.infer<typeof ZOnboardingMetadata>
export type IOnboardingRole = z.infer<typeof ZOnboardingRole>
