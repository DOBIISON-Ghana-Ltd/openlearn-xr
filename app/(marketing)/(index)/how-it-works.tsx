const STEPS = [
  {
    number: '01',
    tag: 'Upload & Extract',
    title: 'Drop in your syllabus or textbook chapter',
    description:
      'Our AI automatically extracts abstract topics that are perfect for visual, hands-on learning — so you never start from scratch.',
  },
  {
    number: '02',
    tag: 'Generate the 3D Module',
    title: 'Select your topic. The AI builds the lab.',
    description:
      'Watch a 3D simulation environment appear — complete with user controls and embedded checkpoint questions — in minutes.',
  },
  {
    number: '03',
    tag: 'Play or Host',
    title: 'Solo or live classroom — your choice',
    description:
      'Play it yourself, or launch a live Session. Share a join link with your class. No student accounts required to jump in.',
  },
]

export default function HowItWorks() {
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
            How It Works
          </p>
          <h2
            className="text-3xl font-bold tracking-tight lg:text-4xl"
            style={{ color: 'oklch(0.20 0.012 120)' }}
          >
            From lesson plan to 3D lab in minutes
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative rounded-xl border p-6"
              style={{
                backgroundColor: 'oklch(1.0 0 0)',
                borderColor: 'oklch(0.87 0.010 95)',
              }}
            >
              {/* Decorative number */}
              <p
                className="mb-3 font-bold"
                style={{
                  fontSize: '3.5rem',
                  lineHeight: 1,
                  color: 'oklch(0.91 0.010 95)',
                }}
              >
                {step.number}
              </p>

              {/* Step tag */}
              <p
                className="mb-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: 'oklch(0.72 0.22 145)' }}
              >
                {step.tag}
              </p>

              {/* Title */}
              <h3
                className="mb-3 text-base font-bold leading-snug"
                style={{ color: 'oklch(0.20 0.012 120)' }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'oklch(0.50 0.012 120)' }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
