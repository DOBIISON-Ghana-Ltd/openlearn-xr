import * as React from 'react'
import {
  Html,
  Body,
  Head,
  Heading,
  Text,
  Link,
  Container,
  Section,
  Preview,
} from '@react-email/components'

interface ResetPasswordProps {
  url: string
  name?: string
}

export const ResetPassword = ({ url, name }: ResetPasswordProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your OpenLearn password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password</Heading>
          <Text style={text}>Hi {name || 'there'},</Text>
          <Text style={text}>
            We received a request to reset your password for your OpenLearn account. Click the button below to choose a new password:
          </Text>
          <Section style={buttonContainer}>
            <Link href={url} style={button}>
              Reset Password
            </Link>
          </Section>
          <Text style={text}>
            If you did not request this password reset, please ignore this email or contact support if you have concerns.
          </Text>
          <Text style={footer}>The OpenLearn Team</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
}

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const button = {
  backgroundColor: '#10b981',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  fontWeight: 'bold',
}

const footer = {
  color: '#8899a6',
  fontSize: '12px',
  lineHeight: '22px',
  padding: '0 48px',
  marginTop: '24px',
}
export default ResetPassword
