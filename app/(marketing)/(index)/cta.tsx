import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { MarketingButton } from '@/components/marketing/button'

export default function CTA() {
  return (
    <section
      className="px-6 py-24 text-center"
      style={{
        backgroundColor: 'oklch(0.93 0.010 95)',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'oklch(0.87 0.010 95)',
      }}
    >
      <div className="mx-auto max-w-2xl">
        <h2
          className="text-3xl font-bold tracking-tight lg:text-4xl"
          style={{ color: 'oklch(0.20 0.012 120)' }}
        >
          Ready to bring your curriculum to life?
        </h2>
        <p
          className="mt-5 text-base leading-relaxed"
          style={{ color: 'oklch(0.50 0.012 120)' }}
        >
          Join educators across Ghana who are turning abstract topics into hands-on 3D experiences their students will never forget.
        </p>

        <div className="mt-10 flex justify-center">
          <MarketingButton href={ROUTES.REGISTER} variant="primary" size="lg">
            Get Started for Free
          </MarketingButton>
        </div>

        <p
          className="mt-5 text-sm"
          style={{ color: 'oklch(0.60 0.010 120)' }}
        >
          🔒 Safe for classrooms · Student data privacy compliant
        </p>
      </div>
    </section>
  )
}
