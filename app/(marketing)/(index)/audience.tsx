import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

const EDUCATORS = [
  'Transform lesson content into AI-generated 3D simulations in minutes.',
  'Host live classroom sessions with real-time leaderboards and progress tracking.',
  'Publish verified modules to the community library or keep them private.',
]

const STUDENTS = [
  "Don't just read about molecular bonds or gravity — manipulate them in 3D.",
  "Join a teacher's session in one click, no account sign-up required.",
  "Create a free account to earn points, maintain streaks, and collect badges.",
]

export default function Audience() {
  return (
    <section
      className="px-6 py-20"
      style={{ backgroundColor: 'oklch(0.965 0.008 95)' }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <h2
            className="text-3xl font-bold tracking-tight lg:text-4xl"
            style={{ color: 'oklch(0.20 0.012 120)' }}
          >
            Built for everyone in the classroom
          </h2>
          <p
            className="mt-4 text-base leading-relaxed"
            style={{ color: 'oklch(0.50 0.012 120)' }}
          >
            Whether you're running the lesson or sitting through it, OpenLearn has something for you.
          </p>
        </div>

        {/* Two-column audience cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Educators */}
          <div
            className="rounded-xl border p-8"
            style={{
              backgroundColor: 'oklch(0.93 0.010 95)',
              borderColor: 'oklch(0.87 0.010 95)',
            }}
          >
            <p className="mb-1 text-2xl">👩🏫</p>
            <h3
              className="mb-6 text-lg font-bold"
              style={{ color: 'oklch(0.20 0.012 120)' }}
            >
              For Educators & Creators
            </h3>
            <ul className="space-y-4">
              {EDUCATORS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 shrink-0 text-sm font-bold"
                    style={{ color: 'oklch(0.72 0.22 145)' }}
                  >
                    ✓
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'oklch(0.40 0.012 120)' }}
                  >
                    {point}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href={ROUTES.REGISTER}
              className="mt-8 inline-flex text-sm font-bold transition-opacity hover:opacity-70"
              style={{ color: 'oklch(0.72 0.22 145)' }}
            >
              Get started as a teacher →
            </Link>
          </div>

          {/* Students */}
          <div
            className="rounded-xl border p-8"
            style={{
              backgroundColor: 'oklch(1.0 0 0)',
              borderColor: 'oklch(0.87 0.010 95)',
            }}
          >
            <p className="mb-1 text-2xl">🧑🎓</p>
            <h3
              className="mb-6 text-lg font-bold"
              style={{ color: 'oklch(0.20 0.012 120)' }}
            >
              For Students & Players
            </h3>
            <ul className="space-y-4">
              {STUDENTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 shrink-0 text-sm font-bold"
                    style={{ color: 'oklch(0.72 0.22 145)' }}
                  >
                    ✓
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'oklch(0.40 0.012 120)' }}
                  >
                    {point}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href={ROUTES.APP.SESSIONS}
              className="mt-8 inline-flex text-sm font-bold transition-opacity hover:opacity-70"
              style={{ color: 'oklch(0.72 0.22 145)' }}
            >
              Join a session →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
