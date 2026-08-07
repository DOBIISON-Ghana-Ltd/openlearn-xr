'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Presentation,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';

export default function SessionsClient() {
  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-6 max-w-[1084px]">
      {/* RED BOX 1: Top Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-4 w-full">
        <Link
          href="/teaching/sessions/create"
          className="bg-primary-cta hover:bg-primary-hover text-primary-text-light px-6 py-3 rounded-lg text-normal inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
        >
          <Presentation className="size-5 shrink-0" />
          <span>Create Session</span>
        </Link>

        <button
          type="button"
          className="bg-transparent hover:bg-surface-white/60 text-primary-cta border border-primary-cta px-6 py-3 rounded-lg text-normal inline-flex items-center gap-2 transition-all cursor-pointer active:scale-98"
        >
          <span>Join a Session</span>
        </button>
      </div>

      {/* RED BOX 2: 2-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* GREEN BOX 1 (7 cols): Active Now Header & Card + Upcoming Today */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Active Now Section */}
          <div className="flex flex-col gap-4">
            {/* Active Now Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-h5 text-secondary-text">Active Now</h2>
                <span className="bg-primary-light text-primary-cta text-caption px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-primary-cta/20">
                  <span className="size-2 rounded-full bg-primary-cta animate-pulse" />
                  Live
                </span>
              </div>
              <span className="text-small text-tertiary">3 Sessions Running</span>
            </div>

            {/* Live Session Card */}
            <div className="bg-primary-subtle p-4 rounded-xl border border-surface-white/80 flex flex-col md:flex-row gap-6 relative shadow-xs">
              {/* Top Right Live Dot Indicator */}
              <div className="absolute top-4 right-4 size-2 rounded-full bg-primary-cta" />

              {/* Thumbnail Image with Gradient Overlay */}
              <div className="relative w-full md:w-[192px] h-[128px] rounded-lg overflow-hidden shrink-0">
                <Image
                  src="/(new)/module-thumbnail.png"
                  alt="Atomic Structure"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-caption text-primary-light">
                  <Users className="size-3.5" />
                  <span>24/30 Joined</span>
                </div>
              </div>

              {/* Info & Action */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-h5 text-tertiary">Atomic Structure</h3>
                  <p className="text-normal text-tertiary">Physics • Year 2</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Avatar Overlap Stack */}
                  <div className="flex items-center -space-x-2">
                    <div className="size-8 rounded-full bg-secondary-text border-2 border-tertiary" />
                    <div className="size-8 rounded-full bg-secondary-text border-2 border-tertiary" />
                    <div className="size-8 rounded-full bg-secondary-text border-2 border-tertiary flex items-center justify-center text-primary-text-light text-caption">
                      +22
                    </div>
                  </div>

                  <Link
                    href="/teaching/sessions/live"
                    className="border border-primary-cta text-primary-cta hover:bg-primary-cta hover:text-primary-text-light px-6 py-2 rounded-lg text-normal transition-all cursor-pointer"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Today Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-h5 text-secondary-text">Upcoming Today</h2>

            <div className="flex flex-col gap-3">
              {/* List Row 1 */}
              <div className="bg-primary-subtle border border-[#3b494c]/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center border-r border-[#3b494c]/20 pr-4">
                    <span className="text-micro font-light text-disable">14:00</span>
                    <span className="text-h6 text-disable leading-tight">Oct 24</span>
                  </div>

                  <div className="flex flex-col">
                    <h4 className="text-small text-secondary-text">Atomic Structure</h4>
                    <span className="text-caption text-tertiary">Chemistry • Year 2</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" className="p-1.5 text-tertiary hover:text-primary-cta transition-colors cursor-pointer">
                    <Pencil className="size-4.5" />
                  </button>
                  <button type="button" className="p-1.5 text-tertiary hover:text-red-500 transition-colors cursor-pointer">
                    <Trash2 className="size-4.5" />
                  </button>
                </div>
              </div>

              {/* List Row 2 */}
              <div className="bg-primary-subtle border border-[#3b494c]/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center border-r border-[#3b494c]/20 pr-4">
                    <span className="text-micro font-light text-disable">15:30</span>
                    <span className="text-h6 text-disable leading-tight">Oct 24</span>
                  </div>

                  <div className="flex flex-col">
                    <h4 className="text-small text-secondary-text">Atomic Structure</h4>
                    <span className="text-caption text-tertiary">Chemistry • Year 2</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" className="p-1.5 text-tertiary hover:text-primary-cta transition-colors cursor-pointer">
                    <Pencil className="size-4.5" />
                  </button>
                  <button type="button" className="p-1.5 text-tertiary hover:text-red-500 transition-colors cursor-pointer">
                    <Trash2 className="size-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GREEN BOX 2 (5 cols): Right Column with content shifted down to align with First Card */}
        <div className="lg:col-span-5 flex flex-col gap-6 pt-0 lg:pt-[44px]">
          {/* October 2024 Mini Calendar (Aligned with Atomic Structure Card) */}
          <div className="bg-primary-subtle border border-[#3b494c]/20 rounded-2xl p-6 flex flex-col gap-6 shadow-xs">
            {/* Header Month / Year */}
            <div className="flex items-center justify-between">
              <h3 className="text-normal text-secondary-text">October 2024</h3>
              <div className="flex items-center gap-2">
                <button type="button" className="p-1 text-secondary-text hover:text-primary-text-dark">
                  <ChevronLeft className="size-4" />
                </button>
                <button type="button" className="p-1 text-secondary-text hover:text-primary-text-dark">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-y-4 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <span key={i} className="text-caption text-disable">
                  {day}
                </span>
              ))}

              {/* Previous month days */}
              {[27, 28, 29, 30].map((d) => (
                <span key={d} className="text-small text-tertiary opacity-30 py-2">
                  {d}
                </span>
              ))}

              {/* Current month days 1-3 */}
              {[1, 2, 3].map((d) => (
                <span key={d} className="text-small text-tertiary py-2">
                  {d}
                </span>
              ))}

              {/* Row 2: 21, 22, 23, 24 (active), 25, 26, 27 */}
              {[21, 22, 23].map((d) => (
                <span key={d} className="text-small text-tertiary py-2">
                  {d}
                </span>
              ))}

              {/* Active Oct 24 */}
              <div className="bg-primary-cta text-primary-text-light text-small py-2 rounded-lg shadow-sm">
                24
              </div>

              {/* Day 25 with Teal Dot Indicator */}
              <div className="relative flex flex-col items-center justify-center py-2 text-small text-tertiary">
                <span>25</span>
                <span className="size-1 rounded-full bg-primary-cta absolute bottom-0.5" />
              </div>

              {[26, 27].map((d) => (
                <span key={d} className="text-small text-tertiary py-2">
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Activity Card Widget */}
          <div className="bg-primary-subtle border border-[#3b494c]/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-small text-secondary-text">Recent Activity</h4>
              <Link href="/teaching/history" className="text-caption text-primary-cta hover:underline">
                View History
              </Link>
            </div>

            <div className="flex flex-col gap-4 pt-1">
              <div className="flex flex-col">
                <span className="text-small text-tertiary">Atomic Structure</span>
                <span className="text-caption text-disable">Ended 45m ago • 28 students</span>
              </div>

              <div className="flex flex-col">
                <span className="text-small text-tertiary">Atomic Structure</span>
                <span className="text-caption text-disable">Ended 2h ago • 31 students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
