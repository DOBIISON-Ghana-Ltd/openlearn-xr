const FEATURES = [
  {
    tag: 'AI Generation',
    title: 'AI-Powered 3D Simulations',
    description:
      'No coding required. Turn static text into interactive, controllable 3D environments — chemical mixtures, physics gravity labs, biology models.',
  },
  {
    tag: 'Assessment',
    title: 'Instant Checkpoint Quizzes',
    description:
      'AI-generated questions embedded directly into the simulation to test player comprehension mid-experiment, not after.',
  },
  {
    tag: 'Classroom',
    title: 'Live Classroom Sessions',
    description:
      'Host a module, share a quick join link, and let anonymous or signed-in students participate instantly — no setup friction.',
  },
  {
    tag: 'Analytics',
    title: 'Real-Time Analytics',
    description:
      'Session creators get a clean dashboard showing student marks, completion rates, and problem areas — right as they happen.',
  },
]

export default function Features() {
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
            Features
          </p>
          <h2
            className="text-3xl font-bold tracking-tight lg:text-4xl"
            style={{ color: 'oklch(0.20 0.012 120)' }}
          >
            Everything your classroom needs
          </h2>
        </div>

        {/* 4-up feature grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border p-6 transition-transform hover:-translate-y-1"
              style={{
                backgroundColor: 'oklch(1.0 0 0)',
                borderColor: 'oklch(0.87 0.010 95)',
              }}
            >
              <p
                className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'oklch(0.72 0.22 145)' }}
              >
                {feature.tag}
              </p>
              <h3
                className="mb-3 text-base font-bold leading-snug"
                style={{ color: 'oklch(0.20 0.012 120)' }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'oklch(0.50 0.012 120)' }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
