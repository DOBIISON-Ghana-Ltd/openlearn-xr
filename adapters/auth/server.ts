import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, emailOTP } from 'better-auth/plugins'
import emailService from '@/adapters/email'
import prisma from '@/adapters/db/client'
import { ac, admin as adminRole, editor, user } from './permissions'
import { nextCookies } from 'better-auth/next-js'

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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  },
  user: {
    additionalFields: {
      onboarded: { 
        type: 'boolean', 
        defaultValue: false,
        input: false
      },
      avatarId: {
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