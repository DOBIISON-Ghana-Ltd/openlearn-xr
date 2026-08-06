'use client';

import { cn } from '@/lib/utils/cn';

const LEADERBOARD = [
  { id: 1, name: 'Mentimeter', points: '967p', isUser: true, bg: 'bg-[#facc46]', emoji: '🏅', widthClass: 'w-full' },
  { id: 2, name: 'Personio', points: '912p', isUser: false, bg: 'bg-[#65a3e1]', emoji: '🍉', widthClass: 'w-[94%]' },
  { id: 3, name: 'Guru', points: '874p', isUser: false, bg: 'bg-[#e93d82]', emoji: '❄️', widthClass: 'w-[88%]' },
  { id: 4, name: 'Trello', points: '828p', isUser: false, bg: 'bg-[#f06e8e]', emoji: '🐹', widthClass: 'w-[82%]' },
  { id: 5, name: 'Slack', points: '782p', isUser: false, bg: 'bg-[#7d6cb5]', emoji: '🌸', widthClass: 'w-[76%]' },
  { id: 6, name: '1Password', points: '749p', isUser: false, bg: 'bg-[#5e92f3]', emoji: '🍀', widthClass: 'w-[70%]' },
  { id: 7, name: 'Monday', points: '680p', isUser: false, bg: 'bg-[#fff05a]', emoji: '🎅', widthClass: 'w-[62%]' },
  { id: 8, name: 'Gusto', points: '647p', isUser: false, bg: 'bg-[#f18c99]', emoji: '🕵️', widthClass: 'w-[55%]' },
];

export default function ResultFLow() {
  return (
    <div className={cn('flex-1 bg-white pt-6 pb-12 px-6 lg:px-20 overflow-y-auto w-full min-h-0 flex flex-col justify-center')}>
      <div className={cn('w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16')}>
        {/* Left Column: Result & Score Summary */}
        <div className={cn('flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-10 py-4')}>
          {/* Header Title & Subtitle */}
          <div className={cn('flex flex-col gap-3')}>
            <h1 className={cn('text-[40px] sm:text-[48px] font-bold text-[#459d9f] leading-tight')}>
              Good Job!
            </h1>
            <p className={cn('text-[16px] font-normal text-[#111827]')}>
              You have completed <span className={cn('text-[#459d9f] font-semibold')}>Atomic Structure</span>.
            </p>
          </div>

          {/* Points Earned Box */}
          <div className={cn('flex flex-col items-center lg:items-start gap-1 mt-4')}>
            <span className={cn('text-[18px] font-semibold text-[#111827]')}>
              Points Earned
            </span>
            <span className={cn('text-[72px] font-bold text-[#459d9f] leading-none mt-1')}>
              967
            </span>
          </div>
        </div>

        {/* Right Column: Leaderboard Visual Bar Chart */}
        <div className={cn('w-full max-w-[540px] flex flex-col gap-3.5 pr-6')}>
          {LEADERBOARD.map((item) => (
            <div key={item.id} className={cn('flex items-center gap-4 w-full')}>
              {/* Point Label */}
              <div className={cn('w-[60px] sm:w-[70px] shrink-0 text-right text-[20px] sm:text-[23px] font-bold text-[#459d9f]')}>
                {item.points}
              </div>

              {/* Progress Bar Container */}
              <div className={cn('flex-1 bg-gray-100/50 rounded-[3.1px] h-[46.7px] relative flex items-center')}>
                <div
                  className={cn(
                    'h-full rounded-[3.1px] px-6 flex items-center justify-between relative transition-all duration-500 shadow-sm',
                    item.bg,
                    item.widthClass
                  )}
                >
                  {/* Name & YOU Label */}
                  <div className={cn('flex flex-col justify-center text-white leading-tight')}>
                    <span className={cn('text-[18px] sm:text-[22px] font-normal text-white drop-shadow-xs')}>
                      {item.name}
                    </span>
                    {item.isUser && (
                      <span className={cn('text-[11px] font-bold text-white/90 tracking-wider uppercase -mt-0.5')}>
                        YOU
                      </span>
                    )}
                  </div>

                  {/* Floating Avatar / Emoji Circle Badge */}
                  <div
                    className={cn(
                      'absolute -right-5 size-[46.7px] bg-white rounded-full flex items-center justify-center shadow-md border-[2.3px] border-white z-10'
                    )}
                  >
                    <span className={cn('text-[22px] sm:text-[24px] select-none')}>{item.emoji}</span>
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