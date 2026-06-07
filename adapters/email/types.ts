export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: Error
}

export interface EmailAdapter {
  initialize?: () => Promise<boolean>
  sendEmail(options: SendEmailOptions): Promise<EmailResult>
}
