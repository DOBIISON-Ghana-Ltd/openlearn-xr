import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, emailOTP, organization } from 'better-auth/plugins'
import emailService from '@/adapters/email'
import prisma from '@/adapters/db/client'
import { ac, admin as adminRole, editor, user } from './permissions'
import { nextCookies } from 'better-auth/next-js'
import { env } from '@/lib/config/env'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 30 * 60,
    },
  },
  advanced: {
    database: {
      generateId: false,
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    }
  },
  user: {
    additionalFields: {
      onboarded: {
        type: 'boolean',
        defaultValue: false,
        input: false
      },
      avatar: {
        type: "string",
        required: false,
        defaultValue: null,
        input: false
      },
      metadata: {
        type: "json",
        required: false,
        defaultValue: null,
        input: false
      }
    },
  },
  plugins: [
    admin({
      ac,
      roles: {
        user,
        editor,
        admin: adminRole,
      },
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
    organization(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        await emailService.sendEmail({
          template: 'email-otp',
          props: { otp, type },
          recipient: email,
          subject: 'Your OpenLearn verification code',
        })
      },
    }),
    nextCookies()
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session["user"];
export type Roles = "admin" | "user" | "editor" | ("admin" | "user" | "editor")[];