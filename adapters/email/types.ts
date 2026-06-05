import { ReactElement } from 'react'

export interface SendEmailOptions {
  to: string
  subject: string
  react?: ReactElement
  html?: string
  from?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: Error
}

export interface EmailAdapter {
  sendEmail(options: SendEmailOptions): Promise<EmailResult>
}
