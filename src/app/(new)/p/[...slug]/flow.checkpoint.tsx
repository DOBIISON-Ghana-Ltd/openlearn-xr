'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

const OPTIONS = [
  { id: 'a', label: 'A. Electrons' },
  { id: 'b', label: 'B. Protons' },
  { id: 'c', label: 'C. Air' },
  { id: 'd', label: 'D. I don’t know' },
];

export default function CheckpointFLow() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="flex-1 bg-surface-white pt-5 pb-8 px-6 lg:pl-[345px] lg:pr-8 overflow-y-auto w-full min-h-0">
      <div className="w-full max-w-[748px] flex flex-col items-start gap-4">
        {/* Main Title (Figma Node 1:1728: 48px bold #459d9f) */}
        <h1 className="text-h2 text-primary-cta leading-tight">
          Assessment
        </h1>

        {/* Subtext (Figma Node 1:1729: 16px text-[#111827]) */}
        <p className="text-normal text-primary-text-dark leading-normal w-full max-w-[656px]">
          Answer the questions to show what you have learnt
        </p>

        {/* Step Counter (Figma Node 1:1726: 20px semi-bold #111827) */}
        <div className="mt-2">
          <span className="text-h6 text-primary-text-dark">
            1 of 5
          </span>
        </div>

        {/* Quiz Container Card (Figma Node 1:1715: w-[748px] bg-[#f8fafc] rounded-[15.5px]) */}
        <div className="w-full bg-surface-slate border border-surface-slate rounded-[15.5px] p-6 lg:p-8 flex flex-col gap-4 mt-1 shadow-sm">
          {/* Question Text (Figma Node 1:1717) */}
          <h2 className="text-h6 font-normal text-secondary-text mb-2">
            1. What do you think is at the center of an atom?
          </h2>

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