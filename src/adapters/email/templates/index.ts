import EmailOtp, { type IEmailOtp } from './email-otp'

const templates = {
  'email-otp': EmailOtp
} as const

export interface ITemplatePropsMap {
  'email-otp': IEmailOtp
}

export default templates
