import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export interface HeroProps {
  className?: string;
}

export default function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        'relative w-full min-h-[611px] overflow-hidden bg-white py-16 md:py-24 flex items-center justify-center',
        className
      )}
    >
      {/* Background Photo Overlay from Figma */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/(new)/hero-bg.png"
          alt="Science Lab Simulation Hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-50"
        />
        {/* Figma double gradient overlay: 40% white tint + vertical gradient fade at top and bottom */}
        <div className="absolute inset-0 bg-white/40" />
        <div className="absolute inset-0 bg-linear-to-b from-white via-transparent to-white opacity-90" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-20 text-center z-10">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-[48px] font-bold text-[#111827] max-w-[1069px] mx-auto leading-tight tracking-tight">
          Interactive Science Simulations for Every High School in Ghana
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base md:text-[16px] font-normal text-[#08111f] max-w-[656px] mx-auto leading-normal">
          Access GES (Ghana Education Service) curriculum aligned 3D science simulations, AI tutoring and smart assessments that help SHS understand STEM concepts not just memorize them.
        </p>

        {/* CTA Buttons */}
        <div className="mt-[34px] flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/modules"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center bg-[#459d9f] hover:bg-[#3b8789] text-[#f8fafc] text-[18px] font-semibold px-5 py-2.5 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(69,157,159,0.3)] transition-all active:scale-98"
          >
            Play Simulations
          </Link>
          <Link
            href="/session/join"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[rgba(156,163,175,0.5)] text-[#08111f] text-[18px] font-semibold px-5 py-2.5 rounded-[10px] transition-all active:scale-98"
          >
            Join a Session
          </Link>
        </div>
      </div>
    </section>
  );
}

