'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

const OPTIONS = [
  { id: 'a', label: 'A. Electrons' },
  { id: 'b', label: 'B. Protons' },
  { id: 'c', label: 'C. Air' },
  { id: 'd', label: 'D. I don’t know' },
];

export default function EngageFLow() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="flex-1 bg-primary-subtle pt-5 pb-8 px-8 lg:pl-[345px] lg:pr-8 overflow-y-auto w-full min-h-0">
      <div className="w-full max-w-[748px] flex flex-col items-start gap-4">
        {/* Main Title (Figma Node 78:17: 48px bold #459d9f) */}
        <h1 className="text-h2 text-primary-cta leading-tight">
          Let’s get curious!
        </h1>

        {/* Subtext (Figma Node 78:18: 16px text-[#111827] max-w-[656px]) */}
        <p className="text-normal text-primary-text-dark leading-normal w-full max-w-[656px] mb-2">
          Everything around you, from your device to your body is made of atoms. But if atoms are are not visible to the eyes, how do scientists know what’s inside them?
        </p>

        {/* Section Heading & Step Counter (Figma Nodes 78:30 & 78:31) */}
        <div className="flex flex-col gap-1 w-full">
          <h2 className="text-h6 text-primary-text-dark">
            Questions: What do you already know?
          </h2>
          <span className="text-normal text-tertiary">
            1 of 5
          </span>
        </div>

        {/* Quiz Container Card (Figma Node 78:19: w-[748px] min-h-[307px] bg-[#f8fafc] rounded-[15.5px]) */}
        <div className="w-full bg-surface-slate border border-surface-slate rounded-[15.5px] p-6 lg:p-8 flex flex-col gap-4 mt-2">
          {/* Question Text */}
          <h3 className="text-h6 font-normal text-secondary-text mb-2">
            1. What do you think is at the center of an atom?
          </h3>

          {/* Options Stack */}
          <div className="flex flex-col gap-3.5 w-full">
            {OPTIONS.map((opt) => {
              const isSelected = selectedOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={cn(
                    'w-full bg-primary-subtle rounded-[5.7px] px-4 py-3 flex items-center transition-all cursor-pointer border',
                    {
                      'border-primary-cta ring-2 ring-primary-cta/20 bg-primary-light/60': isSelected,
                      'border-transparent hover:bg-primary-light/40': !isSelected,
                    }
                  )}
                >
                  <span className="text-h6 font-normal text-secondary-text">
                    {opt.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}