import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface HowItWorksProps {
  className?: string;
}

const STEPS = [
  {
    step: '1',
    title: 'Explore Interactive Lessons',
    description:
      'Choose a Physics, Chemistry or Engineering topic and dive into curriculum-aligned lessons brought to life with immersive 3D simulations.',
  },
  {
    step: '2',
    title: 'Learn by Experimenting',
    description:
      'Manipulate variables, perform virtual experiments, and receive AI-guided support as you discover scientific concepts through hands-on exploration.',
  },
  {
    step: '3',
    title: 'Assess & Track Progress',
    description:
      'Complete quizzes, earn achievements, and monitor your learning journey while teachers gain insights into classroom performance.',
  },
];

export default function HowItWorks({ className }: HowItWorksProps) {
  return (
    <section
      className={cn(
        'relative w-full min-h-[573px] bg-primary-subtle py-16 md:py-20 overflow-hidden flex items-center justify-center',
        className
      )}
    >
      {/* Background Decorative Vector Accents from Figma */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-56 opacity-60 hidden xl:block">
        <Image
          src="/(new)/wave-left.svg"
          alt=""
          fill
          sizes="224px"
          className="object-contain object-left"
        />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-56 opacity-60 hidden xl:block">
        <Image
          src="/(new)/wave-right.svg"
          alt=""
          fill
          sizes="224px"
          className="object-contain object-right"
        />
      </div>

      {/* Soft gradient blur overlays from Figma */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-surface-white via-transparent to-surface-white opacity-80" />

      <div className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-20 text-center z-10">
        {/* Section Title */}
        <h2 className="text-h5 sm:text-h4 text-primary-text-dark max-w-[1069px] mx-auto tracking-tight">
          How OpenLearnXR Works
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-normal text-dark-bg max-w-[769px] mx-auto leading-normal">
          Learn STEM through immersive experiences designed to help you understand, practice, and master complex concepts.
        </p>

        {/* Step Items Grid (Clean badge + text columns from Figma, no card background boxes) */}
        <div className="mt-[38px] flex flex-col md:flex-row items-center md:items-start justify-center gap-10 lg:gap-[65px] max-w-6xl mx-auto">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col items-center text-center w-full max-w-[320px]"
            >
              {/* Number Badge */}
              <div className="flex items-center justify-center size-[50px] rounded-full bg-primary-cta text-primary-text-light text-h5 mb-4">
                {item.step}
              </div>

              {/* Step Title */}
              <h3 className="text-h6 text-primary-text-dark mb-3">
                {item.title}
              </h3>

              {/* Step Description */}
              <p className="text-normal text-dark-bg max-w-[306px] leading-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

