import { EmailAdapter, SendEmailOptions } from './types'

export class ConsoleEmailAdapter implements EmailAdapter {
  constructor(private readonly defaultFrom: string) {}

  async initialize() {
    return true
  }

  async sendEmail(options: SendEmailOptions) {
    const from = options.from || this.defaultFrom
    
    console.log('\n================================================================')
    console.log(`📧 MOCK EMAIL SENT`)
    console.log(`To:      ${options.to}`)
    console.log(`From:    ${from}`)
    console.log(`Subject: ${options.subject}`)
    console.log('----------------------------------------------------------------')
    console.log(options.text)
    console.log('================================================================\n')
    
    return {
      success: true,
      messageId: `console-mock-${Date.now()}`
    }
  }
}
