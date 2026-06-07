import { SESClient, SendEmailCommand, GetSendQuotaCommand } from '@aws-sdk/client-ses'
import { EmailAdapter, EmailResult, SendEmailOptions } from './types'

export class SesEmailAdapter implements EmailAdapter {
  private sesClient: SESClient
  private defaultFrom: string

  constructor(config: {
    region: string
    accessKeyId: string
    secretAccessKey: string
    defaultFrom: string
  }) {
    this.sesClient = new SESClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
    this.defaultFrom = config.defaultFrom
  }

  async initialize(): Promise<boolean> {
    try {
      await this.sesClient.send(new GetSendQuotaCommand({}))
      return true
    } catch (error) {
      console.error('Failed to initialize SES adapter:', error)
      return false
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    try {
      const { to, subject, html, text, from } = options

      const command = new SendEmailCommand({
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: html,
            },
            Text: text
              ? {
                  Charset: 'UTF-8',
                  Data: text,
                }
              : undefined,
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
        Source: from || this.defaultFrom,
      })

      const response = await this.sesClient.send(command)
      return { success: true, messageId: response.MessageId }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e : new Error(String(e)) }
    }
  }
}
