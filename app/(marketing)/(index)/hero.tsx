import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { MarketingButton } from '@/components/marketing/button'

export default function Hero() {
  return (
    <section
      className="px-6 py-20 lg:py-32"
      style={{ backgroundColor: 'oklch(0.965 0.008 95)' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left — text content */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <span
              className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{
                backgroundColor: 'oklch(0.87 0.010 95)',
                color: 'oklch(0.30 0.012 120)',
              }}
            >
              ✦ AI-Powered Science Education
            </span>

            {/* Headline */}
            <h1
              className="text-4xl font-bold leading-[1.15] tracking-tight lg:text-5xl"
              style={{ color: 'oklch(0.20 0.012 120)' }}
            >
              Turn Any Curriculum into 3D Playable Virtual Labs.{' '}
              <span style={{ color: 'oklch(0.72 0.22 145)' }}>Instantly.</span>
            </h1>

            {/* Subheadline */}
            <p
              className="mt-6 text-lg leading-relaxed"
              style={{ color: 'oklch(0.50 0.012 120)' }}
            >
              Upload your teaching materials. Our AI generates interactive 3D simulations and checkpoint quizzes. Host live sessions, track student progress, and make learning unforgettable.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <MarketingButton href={ROUTES.REGISTER} variant="primary" size="lg">
                Create a Module — Free
              </MarketingButton>
              <MarketingButton href={ROUTES.APP.MODULES} variant="outline" size="lg">
                Explore Community Labs
              </MarketingButton>
            </div>
          </div>

          {/* Right — visual split panel */}
          <div className="relative flex flex-col gap-4 lg:flex-row">
            {/* Dashboard preview card */}
            <div
              className="flex-1 rounded-2xl border p-5"
              style={{
                backgroundColor: 'oklch(1.0 0 0)',
                borderColor: 'oklch(0.87 0.010 95)',
              }}
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'oklch(0.87 0.010 95)' }} />
                <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: 'oklch(0.91 0.010 95)' }} />
              </div>
              <div className="space-y-2.5">
                {[60, 85, 45, 70, 55].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="h-7 rounded-md"
                      style={{
                        width: `${w}%`,
                        backgroundColor: i === 1
                          ? 'oklch(0.88 0.12 145)'
                          : 'oklch(0.93 0.008 95)',
                      }}
                    />
                    <div
                      className="h-2 w-8 rounded-full"
                      style={{ backgroundColor: 'oklch(0.91 0.010 95)' }}
                    />
                  </div>
                ))}
              </div>
              <p
                className="mt-4 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'oklch(0.60 0.010 120)' }}
              >
                Live Session Dashboard
              </p>
            </div>

            {/* 3D Lab preview card */}
            <div
              className="flex-1 rounded-2xl border p-5"
              style={{
                backgroundColor: 'oklch(0.93 0.010 95)',
                borderColor: 'oklch(0.87 0.010 95)',
              }}
            >
              <div className="flex h-32 items-center justify-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-5xl">⚗️</span>
                  <span className="text-2xl">🔬</span>
                </div>
              </div>
              <div
                className="mt-3 h-1.5 w-full rounded-full"
                style={{ backgroundColor: 'oklch(0.87 0.010 95)' }}
              >
                <div
                  className="h-1.5 w-3/5 rounded-full"
                  style={{ backgroundColor: 'oklch(0.72 0.22 145)' }}
                />
              </div>
              <p
                className="mt-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'oklch(0.60 0.010 120)' }}
              >
                Interactive 3D Lab
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
