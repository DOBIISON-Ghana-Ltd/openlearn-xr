'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function TeachingDashboardClient() {
  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-6 max-w-[1084px]">
      {/* RED BOX 1: Top Hero Banner */}
      <div className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 rounded-xl p-8 flex flex-col gap-4 shadow-xs">
        <h1 className="text-[24px] font-semibold text-[#4b5563]">
          Good morning, Mr. Mensah
        </h1>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/teaching/sessions/create"
            className="bg-[#459d9f] hover:bg-[#3b8789] text-[#f8fafc] px-6 py-3 rounded-lg text-[16px] font-normal inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <Plus className="size-5" />
            <span>Create Session</span>
          </Link>

          <button
            type="button"
            className="bg-transparent hover:bg-white/60 text-[#459d9f] border border-[#459d9f] px-6 py-3 rounded-lg text-[16px] font-normal inline-flex items-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <span>Join a Session</span>
          </button>
        </div>
      </div>

      {/* RED BOX 2: Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* GREEN BOX 1 (7 cols): Your Sessions + Quick Stats */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Header Row: Your Sessions */}
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-semibold text-[#4b5563]">Your Sessions</h2>
            <Link href="/teaching/sessions" className="text-[#459d9f] hover:underline text-[14px] font-normal cursor-pointer">
              View All
            </Link>
          </div>

          {/* Session Card 1 (Live) */}
          <div className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-8 rounded-xl flex items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h3 className="text-[18px] font-normal text-[#4b5563]">Atomic Structure</h3>
                <span className="bg-[#ddf3f3] text-[#459d9f] text-[12px] font-light px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-[#00daf3]/20">
                  <span className="size-2 rounded-full bg-[#459d9f] animate-pulse" />
                  Live
                </span>
              </div>
              <span className="text-[16px] font-normal text-[#9ca3af]">Physics • Year 2</span>
              <span className="text-[12px] font-light text-[#459d9f]">18 / 25 students</span>
            </div>

            <Link
              href="/teaching/sessions/live"
              className="border border-[#459d9f] text-[#459d9f] hover:bg-[#459d9f] hover:text-white px-6 py-2 rounded-lg text-[16px] font-normal transition-all cursor-pointer shrink-0"
            >
              Continue
            </Link>
          </div>

          {/* Session Card 2 (Completed) */}
          <div className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-8 rounded-xl flex items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h3 className="text-[18px] font-normal text-[#4b5563]">Forces & Motion</h3>
                <span className="bg-[#6b7280] text-[#bac9cc] text-[12px] font-light px-3 py-1 rounded-full">
                  Completed
                </span>
              </div>
              <span className="text-[16px] font-normal text-[#9ca3af]">Physics • Year 1</span>
              <span className="text-[12px] font-light text-[#6b7280]">24 students</span>
            </div>

            <Link
              href="/teaching/analytics/forces-motion"
              className="border border-[#3b494c] text-[#6b7280] hover:bg-[#6b7280] hover:text-white px-6 py-2 rounded-lg text-[16px] font-normal transition-all cursor-pointer shrink-0"
            >
              View Report
            </Link>
          </div>

          {/* Quick Stats Block inside Green Box 1 */}
          <div className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-8 rounded-xl flex flex-col gap-5 shadow-xs mt-2">
            <h2 className="text-[24px] font-semibold text-[#4b5563]">Quick Stats</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#ddf3f3] border border-[#459d9f]/10 p-4 rounded-lg flex flex-col gap-2">
                <span className="text-[24px] font-semibold text-[#4b5563]">8</span>
                <span className="text-[12px] font-light text-[#4b5563]">Sessions This Week</span>
              </div>

              <div className="bg-[#ddf3f3] border border-[#459d9f]/10 p-4 rounded-lg flex flex-col gap-2">
                <span className="text-[24px] font-semibold text-[#4b5563]">142</span>
                <span className="text-[12px] font-light text-[#4b5563]">Students Engaged</span>
              </div>

              <div className="bg-[#ddf3f3] border border-[#459d9f]/10 p-4 rounded-lg flex flex-col gap-2">
                <span className="text-[24px] font-semibold text-[#4b5563]">85%</span>
                <span className="text-[12px] font-light text-[#4b5563]">Avg. Engagement</span>
              </div>
            </div>
          </div>
        </div>

        {/* GREEN BOX 2 (5 cols): Today's Schedule Shifted Down */}
        <div className="lg:col-span-5 flex flex-col gap-4 pt-0 lg:pt-[44px]">
          <div className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-8 rounded-xl flex flex-col gap-6 shadow-xs h-full">
            <h2 className="text-[24px] font-semibold text-[#4b5563]">Today's Schedule</h2>

            <div className="flex flex-col gap-6">
              {/* Item 1 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-10 rounded-full bg-[#ddf3f3] flex items-center justify-center text-[#459d9f] shrink-0">
                    <FlaskIcon className="size-4" />
                  </div>
                  <div className="w-px flex-1 bg-[#3b494c]/30 my-2" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-[12px] font-light text-[#6b7280]">09:00 AM</span>
                  <span className="text-[16px] font-normal text-[#4b5563]">Atomic Structure</span>
                  <span className="text-[12px] font-light text-[#459d9f]">Live now</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-10 rounded-full bg-[#6b7280] flex items-center justify-center text-white shrink-0">
                    <FlaskIcon className="size-4" />
                  </div>
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-[12px] font-light text-[#6b7280]">11:30 AM</span>
                  <span className="text-[16px] font-normal text-[#4b5563] leading-tight">
                    Reaction Conditions Lab
                  </span>
                  <span className="text-[12px] font-light text-[#9ca3af] mt-1">Upcoming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlaskIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.782 17.562l-4.782-7.562v-5h1c.552 0 1-.448 1-1s-.448-1-1-1h-8c-.552 0-1 .448-1 1s.448 1 1 1h1v5l-4.782 7.562c-.553.874-.633 1.956-.214 2.9.42.943 1.341 1.538 2.378 1.538h10.636c1.037 0 1.958-.595 2.378-1.538.419-.944.339-2.026-.214-2.9z" />
    </svg>
  );
}
