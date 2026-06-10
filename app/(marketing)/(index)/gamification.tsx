const REWARDS = [
  {
    icon: '🔥',
    label: 'Streaks',
    description: 'Keep the daily learning momentum going. Miss a day, start over.',
  },
  {
    icon: '🏅',
    label: 'Badges',
    description: 'Unlock achievements like "Molecule Master", "Speed Runner", and more.',
  },
  {
    icon: '🏆',
    label: 'Leaderboards',
    description: 'Friendly competition for completing modules — see where you rank.',
  },
]

const BADGES = ['🔬', '⚡', '🧬', '🔭', '🌡️', '🧪']

export default function Gamification() {
  return (
    <section
      className="px-6 py-20"
      style={{ backgroundColor: 'oklch(0.965 0.008 95)' }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: 'oklch(0.50 0.012 120)' }}
          >
            Play. Earn. Repeat.
          </p>
          <h2
            className="text-3xl font-bold tracking-tight lg:text-4xl"
            style={{ color: 'oklch(0.20 0.012 120)' }}
          >
            Learning that rewards every win
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left — feature rows */}
          <div className="space-y-8">
            {REWARDS.map((reward) => (
              <div key={reward.label} className="flex items-start gap-5">
                <span className="text-3xl">{reward.icon}</span>
                <div>
                  <h3
                    className="mb-1 text-base font-bold"
                    style={{ color: 'oklch(0.20 0.012 120)' }}
                  >
                    {reward.label}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'oklch(0.50 0.012 120)' }}
                  >
                    {reward.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — CSS profile card mock */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'oklch(1.0 0 0)',
              borderColor: 'oklch(0.87 0.010 95)',
            }}
          >
            {/* Avatar row */}
            <div className="flex items-center gap-4">
              <div
                className="flex size-12 items-center justify-center rounded-full text-xl font-bold"
                style={{
                  backgroundColor: 'oklch(0.88 0.12 145)',
                  color: 'oklch(0.35 0.16 145)',
                }}
              >
                A
              </div>
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: 'oklch(0.20 0.012 120)' }}
                >
                  Ama Owusu
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'oklch(0.60 0.010 120)' }}
                >
                  Grade 10 · Science
                </p>
              </div>
            </div>

            {/* Divider */}
            <div
              className="my-5 h-px"
              style={{ backgroundColor: 'oklch(0.91 0.010 95)' }}
            />

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { value: '14', label: '🔥 Day Streak' },
                { value: '2,340', label: '⭐ Points' },
                { value: '6', label: '🏅 Badges' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg py-3"
                  style={{ backgroundColor: 'oklch(0.93 0.010 95)' }}
                >
                  <p
                    className="text-lg font-bold"
                    style={{ color: 'oklch(0.20 0.012 120)' }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: 'oklch(0.55 0.010 120)' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              className="my-5 h-px"
              style={{ backgroundColor: 'oklch(0.91 0.010 95)' }}
            />

            {/* Badges grid */}
            <p
              className="mb-3 text-xs font-bold uppercase tracking-widest"
              style={{ color: 'oklch(0.60 0.010 120)' }}
            >
              Recent Badges
            </p>
            <div className="grid grid-cols-6 gap-2">
              {BADGES.map((badge, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-lg text-xl"
                  style={{ backgroundColor: 'oklch(0.93 0.010 95)' }}
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
