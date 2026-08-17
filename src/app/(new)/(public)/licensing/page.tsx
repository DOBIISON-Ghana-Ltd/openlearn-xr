import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { PATHS } from '@/lib/constants/paths';

export const metadata: Metadata = {
  title: 'Institutional Licensing',
  description: 'Enterprise and institutional licensing for schools, universities, and training organizations.',
};

export default function LicensingPage() {
  return (
    <div className="min-h-[calc(100dvh-var(--spacing)*20)] flex-center flex-col gap-4 px-6 py-20 text-center bg-surface-white">
      <h1 className="text-display font-bold text-primary-cta">
        Coming Soon
      </h1>
      <p className="text-normal text-secondary-text max-w-md">
        We are working on our institutional licensing plans. Check back soon.
      </p>
      <Link
        href={PATHS.MODULES}
        className="mt-4 px-6 py-3 bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button rounded-xl transition-all cursor-pointer shadow-xs active:scale-98 font-semibold"
      >
        Explore Modules
      </Link>
    </div>
  );
}
