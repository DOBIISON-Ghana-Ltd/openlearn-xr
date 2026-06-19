import { Resend } from 'resend'
import { EmailAdapter, EmailResult, SendEmailOptions } from './types'

export class ResendEmailAdapter implements EmailAdapter {
  private resend: Resend
  private defaultFrom: string

  constructor(config: { apiKey: string; defaultFrom: string }) {
    this.resend = new Resend(config.apiKey)
    this.defaultFrom = config.defaultFrom
  }

  async initialize(): Promise<boolean> {
    return true
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    try {
      const { to, subject, html, text, from } = options
      const { data, error } = await this.resend.emails.send({
        from: from || this.defaultFrom,
        to: [to],
        subject,
        html,
        text: text || undefined,
      })

      if (error) {
        return { success: false, error: new Error(error.message) }
      }

      return { success: true, messageId: data?.id }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e : new Error(String(e)) }
    }
  }
}
