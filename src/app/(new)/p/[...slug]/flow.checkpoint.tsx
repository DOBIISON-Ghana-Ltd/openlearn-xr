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
    <div className={cn('flex-1 bg-white pt-5 pb-8 px-6 lg:pl-[345px] lg:pr-8 overflow-y-auto w-full min-h-0')}>
      <div className={cn('w-full max-w-[748px] flex flex-col items-start gap-4')}>
        {/* Main Title (Figma Node 1:1728: 48px bold #459d9f) */}
        <h1 className={cn('text-[36px] sm:text-[48px] font-bold text-[#459d9f] leading-tight')}>
          Assessment
        </h1>

        {/* Subtext (Figma Node 1:1729: 16px text-[#111827]) */}
        <p className={cn('text-[16px] font-normal text-[#111827] leading-normal w-full max-w-[656px]')}>
          Answer the questions to show what you have learnt
        </p>

        {/* Step Counter (Figma Node 1:1726: 20px semi-bold #111827) */}
        <div className={cn('mt-2')}>
          <span className={cn('text-[20px] font-semibold text-[#111827]')}>
            1 of 5
          </span>
        </div>

        {/* Quiz Container Card (Figma Node 1:1715: w-[748px] bg-[#f8fafc] rounded-[15.5px]) */}
        <div className={cn('w-full bg-[#f8fafc] border border-[#f8fafc] rounded-[15.5px] p-6 lg:p-8 flex flex-col gap-4 mt-1 shadow-sm')}>
          {/* Question Text (Figma Node 1:1717) */}
          <h2 className={cn('text-[20.5px] font-normal text-[#4b5563] mb-2')}>
            1. What do you think is at the center of an atom?
          </h2>

          {/* Options Stack */}
          <div className={cn('flex flex-col gap-3.5 w-full')}>
            {OPTIONS.map((opt) => {
              const isSelected = selectedOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={cn(
                    'w-full bg-[#f2fafa] rounded-[5.7px] px-4 py-3 flex items-center transition-all cursor-pointer border',
                    {
                      'border-[#459d9f] ring-2 ring-[#459d9f]/20 bg-[#e6f5f5]': isSelected,
                      'border-transparent hover:bg-[#ebf7f7]': !isSelected,
                    }
                  )}
                >
                  <span className={cn('text-[20.5px] font-normal text-[#4b5563]')}>
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