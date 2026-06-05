import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/adapters/db/client'
import { createEmailAdapter } from '@/adapters/email'
import { VerifyEmail } from '@/adapters/email/templates/verify-email'
import { ResetPassword } from '@/adapters/email/templates/reset-password'

const emailAdapter = createEmailAdapter()

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await emailAdapter.sendEmail({
        to: user.email,
        subject: 'Reset your OpenLearn password',
        react: ResetPassword({ url, name: user.name }),
      })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await emailAdapter.sendEmail({
        to: user.email,
        subject: 'Verify your email address for OpenLearn',
        react: VerifyEmail({ url, name: user.name }),
      })
    },
  },
  user: {
    additionalFields: {
      role: { type: 'string', defaultValue: 'user' },
      onboarded: { type: 'boolean', defaultValue: false },
      userRole: { type: 'string', required: false },
    },
  },
})

export type Session = typeof auth.$Infer.Session
