import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url().optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_SES_SENDER: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000")
})

export const env = typeof window === 'undefined' ? envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  AWS_REGION: process.env.AWS_REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_SES_SENDER: process.env.AWS_SES_SENDER,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
}) : {} as z.infer<typeof envSchema>
