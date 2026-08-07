'use client';

import { cn } from '@/lib/utils/cn';

const LEADERBOARD = [
  { id: 1, name: 'Mentimeter', points: '967p', isUser: true, bg: 'bg-accent-gold', emoji: '🏅', widthClass: 'w-full' },
  { id: 2, name: 'Personio', points: '912p', isUser: false, bg: 'bg-accent-sky', emoji: '🍉', widthClass: 'w-[94%]' },
  { id: 3, name: 'Guru', points: '874p', isUser: false, bg: 'bg-accent-magenta', emoji: '❄️', widthClass: 'w-[88%]' },
  { id: 4, name: 'Trello', points: '828p', isUser: false, bg: 'bg-accent-pink', emoji: '🐹', widthClass: 'w-[82%]' },
  { id: 5, name: 'Slack', points: '782p', isUser: false, bg: 'bg-accent-purple', emoji: '🌸', widthClass: 'w-[76%]' },
  { id: 6, name: '1Password', points: '749p', isUser: false, bg: 'bg-accent-royal', emoji: '🍀', widthClass: 'w-[70%]' },
  { id: 7, name: 'Monday', points: '680p', isUser: false, bg: 'bg-accent-yellow', emoji: '🎅', widthClass: 'w-[62%]' },
  { id: 8, name: 'Gusto', points: '647p', isUser: false, bg: 'bg-accent-salmon', emoji: '🕵️', widthClass: 'w-[55%]' },
];

export default function ResultFLow() {
  return (
    <div className="flex-1 bg-surface-white pt-6 pb-12 px-6 lg:px-20 overflow-y-auto w-full min-h-0 flex flex-col justify-center">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16">
        {/* Left Column: Result & Score Summary */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-10 py-4">
          {/* Header Title & Subtitle */}
          <div className="flex flex-col gap-3">
            <h1 className="text-h2 text-primary-cta leading-tight">
              Good Job!
            </h1>
            <p className="text-normal text-primary-text-dark">
              You have completed <span className="text-primary-cta font-semibold">Atomic Structure</span>.
            </p>
          </div>

          {/* Points Earned Box */}
          <div className="flex flex-col items-center lg:items-start gap-1 mt-4">
            <span className="text-button text-primary-text-dark">
              Points Earned
            </span>
            <span className="text-display text-primary-cta leading-none mt-1">
              967
            </span>
          </div>
        </div>

        {/* Right Column: Leaderboard Visual Bar Chart */}
        <div className="w-full max-w-[540px] flex flex-col gap-3.5 pr-6">
          {LEADERBOARD.map((item) => (
            <div key={item.id} className="flex items-center gap-4 w-full">
              {/* Point Label */}
              <div className="w-[60px] sm:w-[70px] shrink-0 text-right text-h6 font-bold text-primary-cta">
                {item.points}
              </div>

              {/* Progress Bar Container */}
              <div className="flex-1 bg-transparent rounded-[3.1px] h-[46.7px] relative flex items-center">
                <div
                  className={cn(
                    'h-full rounded-[3.1px] px-6 flex items-center justify-between relative transition-all duration-500 shadow-sm',
                    item.bg,
                    item.widthClass
                  )}
                >
                  {/* Name & YOU Label */}
                  <div className="flex flex-col justify-center text-primary-text-light leading-tight">
                    <span className="text-h6 font-normal text-primary-text-light drop-shadow-xs">
                      {item.name}
                    </span>
                    {item.isUser && (
                      <span className="text-[11px] font-bold text-primary-text-light/90 tracking-wider uppercase -mt-0.5">
                        YOU
                      </span>
                    )}
                  </div>

                  {/* Floating Avatar / Emoji Circle Badge */}
                  <div className="absolute -right-5 size-[46.7px] bg-surface-white rounded-full flex items-center justify-center shadow-md border-[2.3px] border-surface-white z-10">
                    <span className="text-[22px] sm:text-[24px] select-none">{item.emoji}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

