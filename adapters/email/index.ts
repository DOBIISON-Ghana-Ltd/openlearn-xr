import { EmailAdapter } from './types'
import { ResendEmailAdapter } from './resend-adapter'
import { SesEmailAdapter } from './ses-adapter'

export * from './types'
export * from './resend-adapter'
export * from './ses-adapter'

export function createEmailAdapter(): EmailAdapter {
  const provider = process.env.EMAIL_PROVIDER || 'resend'
  const defaultFrom = process.env.EMAIL_FROM || 'OpenLearn <noreply@openlearn.app>'

  if (provider === 'ses') {
    return new SesEmailAdapter({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      defaultFrom,
    })
  }

  // Default to Resend
  return new ResendEmailAdapter({
    apiKey: process.env.RESEND_API_KEY || '',
    defaultFrom,
  })
}
