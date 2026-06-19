import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from '@react-email/components'

export interface IEmailOtp {
  type: 'sign-in' | 'email-verification' | 'forget-password' | 'change-email'
  otp: string
}

const typeConfig: Record<
  IEmailOtp['type'],
  { preview: string; heading: string; description: string }
> = {
  'sign-in': {
    preview: 'Your OpenLearn sign-in code',
    heading: 'Sign-In Verification',
    description: 'Use the code below to complete your sign-in to OpenLearn.',
  },
  'email-verification': {
    preview: 'Verify your OpenLearn email address',
    heading: 'Verify Your Email',
    description: 'Use the code below to verify your OpenLearn email address.',
  },
  'forget-password': {
    preview: 'Reset your OpenLearn password',
    heading: 'Reset Your Password',
    description: 'Use the code below to reset your OpenLearn account password.',
  },
  'change-email': {
    preview: 'Confirm your new OpenLearn email address',
    heading: 'Confirm Email Change',
    description: 'Use the code below to confirm your new email address for OpenLearn.',
  },
}

export default function EmailOtp(props: IEmailOtp) {
  const { type, otp } = props
  const year = new Date().getFullYear()
  const { preview, heading, description } = typeConfig[type]

  return (
    <Html>
      <Head />
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="bg-[#efeef1] font-sans">
          <Preview>{preview}</Preview>
          <Container className="max-w-145 my-7.5 mx-auto bg-white">
            <Section className="p-7.5">
              <Row>
                <Column>
                  <Section className="w-28.5 h-10 bg-black mx-auto" />
                </Column>
              </Row>
            </Section>

            <Section className="w-full">
              <Row>
                <Column className="[border-bottom:1px_solid_rgb(238,238,238)] w-62.25" />
                <Column className="[border-bottom:1px_solid_rgb(16,185,129)] w-25.5" />
                <Column className="[border-bottom:1px_solid_rgb(238,238,238)] w-62.25" />
              </Row>
            </Section>

            <Section className="pt-1.25 px-5 pb-2.5">
              <Text className="text-[20px] font-bold leading-normal mt-2 mb-1">{heading}</Text>

              <Text className="text-[14px] leading-normal mt-2 mb-6">
                {description} This code is valid for 10 minutes.
              </Text>

              <Section className="bg-[#f3f4f6] rounded py-6 mb-6">
                <Row>
                  <Column>
                    <Text className="text-center text-[#111] text-[36px] font-bold tracking-[0.25em] my-0">
                      {otp}
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Text className="text-[13px] leading-normal text-[#6b6b6b]">
                If you did not request this, you can safely ignore this email.
              </Text>

              <Text className="text-[14px] leading-normal mt-4">
                Thanks,
                <br />
                OpenLearn Team
              </Text>
            </Section>
          </Container>

          <Section className="max-w-145 mx-auto">
            <Row>
              <Text className="text-center text-[#706a7b]">© {year} OpenLearn. All Rights Reserved</Text>
            </Row>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}

EmailOtp.PreviewProps = {
  type: 'email-verification',
  otp: '748291',
} satisfies IEmailOtp
