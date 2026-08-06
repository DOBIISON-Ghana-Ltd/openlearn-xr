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
          className="bg-[#459d9f] hover:bg-[#3b8789] text-[#f8fafc] px-6 py-3 rounded-lg text-[16px] font-normal inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
        >
          <Presentation className="size-5 shrink-0" />
          <span>Create Session</span>
        </Link>

        <button
          type="button"
          className="bg-transparent hover:bg-white/60 text-[#459d9f] border border-[#459d9f] px-6 py-3 rounded-lg text-[16px] font-normal inline-flex items-center gap-2 transition-all cursor-pointer active:scale-98"
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
                <h2 className="text-[24px] font-semibold text-[#4b5563]">Active Now</h2>
                <span className="bg-[#ddf3f3] text-[#459d9f] text-[12px] font-light px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-[#00daf3]/20">
                  <span className="size-2 rounded-full bg-[#459d9f] animate-pulse" />
                  Live
                </span>
              </div>
              <span className="text-[14px] font-normal text-[#849396]">3 Sessions Running</span>
            </div>

            {/* Live Session Card */}
            <div className="bg-[#f2fafa] p-4 rounded-xl border border-white/80 flex flex-col md:flex-row gap-6 relative shadow-xs">
              {/* Top Right Live Dot Indicator */}
              <div className="absolute top-4 right-4 size-2 rounded-full bg-[#459d9f]" />

              {/* Thumbnail Image with Gradient Overlay */}
              <div className="relative w-full md:w-[192px] h-[128px] rounded-lg overflow-hidden shrink-0">
                <Image
                  src="/(new)/module-thumbnail.png"
                  alt="Atomic Structure"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[12px] font-light text-[#c3f5ff]">
                  <Users className="size-3.5" />
                  <span>24/30 Joined</span>
                </div>
              </div>

              {/* Info & Action */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-[24px] font-semibold text-[#6b7280]">Atomic Structure</h3>
                  <p className="text-[16px] font-normal text-[#849396]">Physics • Year 2</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Avatar Overlap Stack */}
                  <div className="flex items-center -space-x-2">
                    <div className="size-8 rounded-full bg-[#4b5563] border-2 border-[#6b7280]" />
                    <div className="size-8 rounded-full bg-[#4b5563] border-2 border-[#6b7280]" />
                    <div className="size-8 rounded-full bg-[#4b5563] border-2 border-[#6b7280] flex items-center justify-center text-white text-[12px] font-light">
                      +22
                    </div>
                  </div>

                  <Link
                    href="/teaching/sessions/live"
                    className="border border-[#459d9f] text-[#459d9f] hover:bg-[#459d9f] hover:text-white px-6 py-2 rounded-lg text-[16px] font-normal transition-all cursor-pointer"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Today Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[24px] font-semibold text-[#4b5563]">Upcoming Today</h2>

            <div className="flex flex-col gap-3">
              {/* List Row 1 */}
              <div className="bg-[#f2fafa] border border-[#3b494c]/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center border-r border-[#3b494c]/20 pr-4">
                    <span className="text-[10px] font-light text-[#9ca3af]">14:00</span>
                    <span className="text-[20px] font-semibold text-[#9ca3af] leading-tight">Oct 24</span>
                  </div>

                  <div className="flex flex-col">
                    <h4 className="text-[14px] font-normal text-[#4b5563]">Atomic Structure</h4>
                    <span className="text-[12px] font-light text-[#849396]">Chemistry • Year 2</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" className="p-1.5 text-[#6b7280] hover:text-[#459d9f] transition-colors cursor-pointer">
                    <Pencil className="size-4.5" />
                  </button>
                  <button type="button" className="p-1.5 text-[#6b7280] hover:text-red-500 transition-colors cursor-pointer">
                    <Trash2 className="size-4.5" />
                  </button>
                </div>
              </div>

              {/* List Row 2 */}
              <div className="bg-[#f2fafa] border border-[#3b494c]/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center border-r border-[#3b494c]/20 pr-4">
                    <span className="text-[10px] font-light text-[#9ca3af]">15:30</span>
                    <span className="text-[20px] font-semibold text-[#9ca3af] leading-tight">Oct 24</span>
                  </div>

                  <div className="flex flex-col">
                    <h4 className="text-[14px] font-normal text-[#4b5563]">Atomic Structure</h4>
                    <span className="text-[12px] font-light text-[#849396]">Chemistry • Year 2</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" className="p-1.5 text-[#6b7280] hover:text-[#459d9f] transition-colors cursor-pointer">
                    <Pencil className="size-4.5" />
                  </button>
                  <button type="button" className="p-1.5 text-[#6b7280] hover:text-red-500 transition-colors cursor-pointer">
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
          <div className="bg-[#f2fafa] border border-[#3b494c]/20 rounded-2xl p-6 flex flex-col gap-6 shadow-xs">
            {/* Header Month / Year */}
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-normal text-[#4b5563]">October 2024</h3>
              <div className="flex items-center gap-2">
                <button type="button" className="p-1 text-[#4b5563] hover:text-[#111827]">
                  <ChevronLeft className="size-4" />
                </button>
                <button type="button" className="p-1 text-[#4b5563] hover:text-[#111827]">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-y-4 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <span key={i} className="text-[12px] font-light text-[#9ca3af]">
                  {day}
                </span>
              ))}

              {/* Previous month days */}
              {[27, 28, 29, 30].map((d) => (
                <span key={d} className="text-[14px] font-normal text-[#6b7280] opacity-30 py-2">
                  {d}
                </span>
              ))}

              {/* Current month days 1-3 */}
              {[1, 2, 3].map((d) => (
                <span key={d} className="text-[14px] font-normal text-[#6b7280] py-2">
                  {d}
                </span>
              ))}

              {/* Row 2: 21, 22, 23, 24 (active), 25, 26, 27 */}
              {[21, 22, 23].map((d) => (
                <span key={d} className="text-[14px] font-normal text-[#6b7280] py-2">
                  {d}
                </span>
              ))}

              {/* Active Oct 24 */}
              <div className="bg-[#459d9f] text-[#f8fafc] text-[14px] font-normal py-2 rounded-lg shadow-[0px_0px_7.5px_rgba(0,229,255,0.3)]">
                24
              </div>

              {/* Day 25 with Teal Dot Indicator */}
              <div className="relative flex flex-col items-center justify-center py-2 text-[14px] font-normal text-[#6b7280]">
                <span>25</span>
                <span className="size-1 rounded-full bg-[#459d9f] absolute bottom-0.5" />
              </div>

              {[26, 27].map((d) => (
                <span key={d} className="text-[14px] font-normal text-[#6b7280] py-2">
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Activity Card Widget */}
          <div className="bg-[#f2fafa] border border-[#3b494c]/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-normal text-[#4b5563]">Recent Activity</h4>
              <Link href="/teaching/history" className="text-[12px] font-light text-[#459d9f] hover:underline">
                View History
              </Link>
            </div>

            <div className="flex flex-col gap-4 pt-1">
              <div className="flex flex-col">
                <span className="text-[14px] font-normal text-[#6b7280]">Atomic Structure</span>
                <span className="text-[12px] font-light text-[#9ca3af]">Ended 45m ago • 28 students</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[14px] font-normal text-[#6b7280]">Atomic Structure</span>
                <span className="text-[12px] font-light text-[#9ca3af]">Ended 2h ago • 31 students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
