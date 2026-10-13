import { z } from 'zod'

// Client-safe variables that Next.js can bundle and expose client-side.
// These MUST be prefixed with NEXT_PUBLIC_.
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_IMAGE_URL: z.url(),

  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string(),
  NEXT_PUBLIC_POSTHOG_HOST: z.url(),

  NEXT_PUBLIC_PUSHER_KEY: z.string(),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string(),
  NEXT_PUBLIC_PUSHER_HOST: z.string().optional(),
  NEXT_PUBLIC_PUSHER_PORT: z.string().optional(),

  // Piloting
  NEXT_PUBLIC_ENABLE_SURVEY: z.stringbool().default(false),
})

// Server-only variables + client variables (inherited)
const serverSchema = clientSchema.extend({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),

  BETTER_AUTH_SECRET: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  EMAIL_PROVIDER: z.enum(['console', 'ses', 'resend']).default('console'),
  RESEND_API_KEY: z.string(),

  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),

  PAYSTACK_SECRET_KEY: z.string(),

  PUSHER_APP_ID: z.string(),
  PUSHER_SECRET: z.string(),
})

// Build client inputs
const clientEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL,

  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,

  NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  NEXT_PUBLIC_PUSHER_HOST: process.env.NEXT_PUBLIC_PUSHER_HOST,
  NEXT_PUBLIC_PUSHER_PORT: process.env.NEXT_PUBLIC_PUSHER_PORT,

  NEXT_PUBLIC_ENABLE_SURVEY: process.env.NEXT_PUBLIC_ENABLE_SURVEY,
}

// Build server inputs
const serverEnv = {
  ...clientEnv,
  NODE_ENV: process.env.NODE_ENV,

  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,

  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
  RESEND_API_KEY: process.env.RESEND_API_KEY,

  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,

  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,

  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
}

// Select schema based on execution context.
// Safe type-assertion allows client code to import env and see the full type signature,
// though only client-safe keys will actually be populated.
const shouldSkipValidation = process.env.SKIP_ENV_VALIDATION === 'true'

const activeServerSchema = shouldSkipValidation ? serverSchema.partial() : serverSchema
const activeClientSchema = shouldSkipValidation ? clientSchema.partial() : clientSchema

export const env = typeof window === 'undefined'
  ? (activeServerSchema.parse(serverEnv) as z.infer<typeof serverSchema>)
  : (activeClientSchema.parse(clientEnv) as z.infer<typeof serverSchema>)
