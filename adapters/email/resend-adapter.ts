import { Resend } from 'resend'
import { EmailAdapter, EmailResult, SendEmailOptions } from './types'

export class ResendEmailAdapter implements EmailAdapter {
  private resend: Resend
  private defaultFrom: string

  constructor(config: { apiKey: string; defaultFrom: string }) {
    this.resend = new Resend(config.apiKey)
    this.defaultFrom = config.defaultFrom
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    try {
      const { to, subject, html, react, from } = options
      const { data, error } = await this.resend.emails.send({
        from: from || this.defaultFrom,
        to: [to],
        subject,
        html: html || undefined,
        react: react || undefined,
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
