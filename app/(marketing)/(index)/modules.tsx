import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { MarketingButton } from '@/components/marketing/button'

const MODULES = [
  {
    subject: 'Chemistry',
    emoji: '⚗️',
    title: '3D Ideal Gas Law Simulator',
    description: "Manipulate pressure, volume, and temperature in a real-time 3D environment and observe Boyle's Law in action.",
    creator: 'OpenLearn Team',
  },
  {
    subject: 'Biology',
    emoji: '🌿',
    title: 'Photosynthesis Light Reactions Lab',
    description: 'Explore the light-dependent reactions of photosynthesis with interactive chloroplast models and quiz checkpoints.',
    creator: 'OpenLearn Team',
  },
  {
    subject: 'Physics',
    emoji: '🔭',
    title: "Newton's Laws of Motion Lab",
    description: 'Apply forces to objects in 3D space and discover the relationship between mass, acceleration, and friction.',
    creator: 'OpenLearn Team',
  },
  {
    subject: 'Chemistry',
    emoji: '🧪',
    title: 'Acid-Base Reactions Lab',
    description: 'Mix acids and bases in a virtual lab, track pH changes in real time, and answer inline checkpoint questions.',
    creator: 'OpenLearn Team',
  },
]

export default function Modules() {
  return (
    <section
      className="px-6 py-20"
      style={{ backgroundColor: 'oklch(0.955 0.008 95)' }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: 'oklch(0.50 0.012 120)' }}
          >
            Community Labs
          </p>
          <h2
            className="text-3xl font-bold tracking-tight lg:text-4xl"
            style={{ color: 'oklch(0.20 0.012 120)' }}
          >
            Ready to play right now
          </h2>
          <p
            className="mt-4 text-base"
            style={{ color: 'oklch(0.50 0.012 120)' }}
          >
            4 admin-verified modules built for the curriculum
          </p>
        </div>

        {/* Module card grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((mod) => (
            <div
              key={mod.title}
              className="overflow-hidden rounded-xl border transition-transform hover:-translate-y-1"
              style={{
                backgroundColor: 'oklch(1.0 0 0)',
                borderColor: 'oklch(0.87 0.010 95)',
              }}
            >
              {/* Thumbnail area */}
              <div
                className="flex aspect-video items-center justify-center"
                style={{ backgroundColor: 'oklch(0.93 0.010 95)' }}
              >
                <span className="text-5xl">{mod.emoji}</span>
              </div>

              {/* Card body */}
              <div className="p-4">
                {/* Subject pill */}
                <span
                  className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: 'oklch(0.91 0.010 95)',
                    color: 'oklch(0.30 0.012 120)',
                  }}
                >
                  {mod.subject}
                </span>

                {/* Title */}
                <h3
                  className="mt-2.5 text-sm font-bold leading-snug"
                  style={{ color: 'oklch(0.20 0.012 120)' }}
                >
                  {mod.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-2 text-xs leading-relaxed"
                  style={{ color: 'oklch(0.55 0.010 120)' }}
                >
                  {mod.description}
                </p>

                {/* Play button */}
                <MarketingButton
                  href={ROUTES.APP.MODULES}
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                >
                  ▶ Play Demo
                </MarketingButton>

                {/* Creator + verified */}
                <div className="mt-3 flex items-center justify-between">
                  <p
                    className="text-xs"
                    style={{ color: 'oklch(0.60 0.010 120)' }}
                  >
                    {mod.creator}
                  </p>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: 'oklch(0.72 0.22 145)' }}
                  >
                    ✓ Admin Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
