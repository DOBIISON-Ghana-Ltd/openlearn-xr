import { createElement, type Attributes, type FC } from 'react'
import { render, toPlainText } from '@react-email/components'
import templates, { type ITemplatePropsMap } from './templates'
import { EmailAdapter } from './types'
import { ResendEmailAdapter } from './resend-adapter'
import { SesEmailAdapter } from './ses-adapter'
import { ConsoleEmailAdapter } from './console-adapter'
import { env } from '@/lib/config/env'

export * from './types'
export * from './resend-adapter'
export * from './ses-adapter'
export * from './templates'

type TemplateKey = keyof ITemplatePropsMap

function createTypedElement<P extends {}>(Component: FC<P>, props: P) {
  return createElement(Component as FC<P & Attributes>, props as P & Attributes)
}

export function createEmailAdapter(): EmailAdapter {
  const provider = env.EMAIL_PROVIDER
  const defaultFrom = env.EMAIL_FROM

  if (provider === 'ses' && env.AWS_ACCESS_KEY_ID) {
    return new SesEmailAdapter({
      region: env.AWS_REGION,
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
      defaultFrom,
    })
  }

  if (provider === 'resend' && env.RESEND_API_KEY) {
    return new ResendEmailAdapter({
      apiKey: env.RESEND_API_KEY,
      defaultFrom,
    })
  }

  // Fallback to console for local dev without keys
  return new ConsoleEmailAdapter(defaultFrom)
}

class EmailService {
  public adapter: EmailAdapter | null
  public initialized: boolean
  public initializationError: Error | null

  constructor() {
    this.adapter = null
    this.initialized = false
    this.initializationError = null
  }

  async initialize() {
    if (this.initialized) return true
    if (this.initializationError) return false

    try {
      this.adapter = createEmailAdapter()

      if (this.adapter.initialize) {
        const ok = await this.adapter.initialize()
        if (!ok) {
          throw new Error('Email adapter failed to initialize')
        }
      }

      this.initialized = true
      console.log('Email service initialized successfully')
      return true
    } catch (error) {
      this.initializationError = error instanceof Error ? error : new Error(String(error))
      console.error('Failed to initialize email service:', error)
      return false
    }
  }

  async sendEmail<K extends TemplateKey>(options: {
    template: K
    props: ITemplatePropsMap[K]
    subject?: string
    recipient: string
    sender?: string
  }) {
    const { template, props, recipient, sender, subject } = options
    const isDev = env.NODE_ENV !== 'production'

    if (!this.initialized) {
      await this.initialize()
    }

    if (!this.initialized || !this.adapter) {
      throw new Error('Email service not available - initialization failed')
    }

    const Component = templates[template] as FC<typeof props>
    const htmlContent = await render(createTypedElement(Component, props))
    const textContent = toPlainText(htmlContent)

    const devRecipient = env.EMAIL_DEV_TO
    const to = isDev && devRecipient ? devRecipient : recipient

    const info = await this.adapter.sendEmail({
      to,
      subject: subject || 'OpenLearn',
      html: htmlContent,
      text: textContent,
      from: sender,
    })

    console.log(`Email sent successfully to ${recipient} with template ${template}`)
    return info
  }
}

const emailService = new EmailService()
export default emailService
