import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, emailOTP, organization } from 'better-auth/plugins'
import emailService from '@/adapters/email'
import prisma from '@/adapters/db/client'
import { ac, admin as adminRole, editor, user } from './permissions'
import { nextCookies } from 'better-auth/next-js'
import { env } from '@/lib/config/env'
import { getInitialOrganization } from '@/lib/actions/get-initial-organization'
import { createDefaultSubscription } from '@/lib/actions/create-default-subscription'

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
      metadata: {
        type: "json",
        required: false,
        defaultValue: null,
        input: false
      }
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const orgId = await getInitialOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: orgId,
            },
          };
        }
      }
    }
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
      adminRoles: ['admin']
    }),
    organization({
      organizationHooks: {
        afterCreateOrganization: async ({ organization }) => {
          await createDefaultSubscription(organization.id);
        }
      }
    }),
    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        emailService.sendEmail({
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
export type UserRole = "admin" | "user" | "editor";
export type Roles = UserRole | UserRole[];