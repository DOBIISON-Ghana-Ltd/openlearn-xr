import { z } from 'zod'

// Client-safe variables that Next.js can bundle and expose client-side.
// These MUST be prefixed with NEXT_PUBLIC_.
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.url().optional(),
  NEXT_PUBLIC_STORAGE_URL: z.url().default("http://localhost:3000/api/upload"),
  NEXT_PUBLIC_IMAGE_URL: z.url().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.url().default("https://us.i.posthog.com"),
  NEXT_PUBLIC_PUSHER_KEY: z.string().optional(),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string().default("mt1"),
  NEXT_PUBLIC_PUSHER_HOST: z.string().optional(),
  NEXT_PUBLIC_PUSHER_PORT: z.string().optional(),
  NEXT_PUBLIC_PUSHER_FORCE_TLS: z.string().optional(),
})

// Server-only variables + client variables (inherited)
const serverSchema = clientSchema.extend({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.url().optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  EMAIL_PROVIDER: z.enum(['console', 'ses', 'resend']).default('console'),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("OpenLearn <noreply@openlearn.app>"),
  AWS_REGION: z.string().default("us-east-1"),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_SES_SENDER: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),
  EMAIL_DEV_TO: z.string().optional(),
  PUSHER_APP_ID: z.string().optional(),
  PUSHER_KEY: z.string().optional(),
  PUSHER_SECRET: z.string().optional(),
  PUSHER_CLUSTER: z.string().default("mt1"),
})

// Build client inputs
const clientEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_APP_URL, // fallback to App URL if not defined
  NEXT_PUBLIC_STORAGE_URL: process.env.NEXT_PUBLIC_STORAGE_URL,
  NEXT_PUBLIC_IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  NEXT_PUBLIC_PUSHER_HOST: process.env.NEXT_PUBLIC_PUSHER_HOST,
  NEXT_PUBLIC_PUSHER_PORT: process.env.NEXT_PUBLIC_PUSHER_PORT,
  NEXT_PUBLIC_PUSHER_FORCE_TLS: process.env.NEXT_PUBLIC_PUSHER_FORCE_TLS,
}

// Build server inputs
const serverEnv = {
  ...clientEnv,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_SES_SENDER: process.env.AWS_SES_SENDER,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET, // handle both keys for backwards compatibility
  EMAIL_DEV_TO: process.env.EMAIL_DEV_TO,
  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  PUSHER_KEY: process.env.PUSHER_KEY || process.env.NEXT_PUBLIC_PUSHER_KEY,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
  PUSHER_CLUSTER: process.env.PUSHER_CLUSTER || process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
}

// Select schema based on execution context.
// Safe type-assertion allows client code to import env and see the full type signature,
// though only client-safe keys will actually be populated.
export const env = typeof window === 'undefined'
  ? serverSchema.parse(serverEnv)
  : clientSchema.parse(clientEnv) as z.infer<typeof serverSchema>
