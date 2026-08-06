'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AnalyticsDetailProps {
  sessionId: string;
}

export default function AnalyticsDetailClient({ sessionId }: AnalyticsDetailProps) {
  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-8 max-w-[1100px]">
      {/* Top Header: Back Button + Session Title */}
      <div className="flex items-center gap-4">
        <Link
          href="/teaching/analytics"
          className="size-10 rounded-full bg-[#f8fafc] border border-slate-200 flex items-center justify-center text-[#4b5563] shadow-xs hover:bg-slate-100 transition-colors shrink-0"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-[24px] font-semibold text-[#4b5563]">Forces & Motion Session</h1>
      </div>

      {/* Top Row: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Students Joined */}
        <div className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-6 rounded-xl flex flex-col gap-1 shadow-xs relative overflow-hidden">
          <span className="text-[12px] font-semibold text-[#849396] tracking-wider uppercase">
            STUDENTS JOINED
          </span>
          <span className="text-[36px] font-semibold text-[#4b5563] leading-tight">24 / 25</span>
          <div className="flex items-center gap-1.5 mt-2 text-[12px] font-semibold text-[#34d399] tracking-wide">
            <CheckCircle2 className="size-3.5" />
            <span>96% Attendance</span>
          </div>
        </div>

        {/* Card 2: Completion Rate */}
        <div className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-6 rounded-xl flex flex-col gap-1 shadow-xs relative overflow-hidden">
          <span className="text-[12px] font-semibold text-[#849396] tracking-wider uppercase">
            COMPLETION RATE
          </span>
          <span className="text-[36px] font-semibold text-[#4b5563] leading-tight">96%</span>
          <span className="text-[12px] font-semibold text-[#849396] tracking-wide mt-2">
            Active session goal met
          </span>
        </div>

        {/* Card 3: Average Score */}
        <div className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-6 rounded-xl flex flex-col gap-1 shadow-xs relative overflow-hidden">
          <span className="text-[12px] font-semibold text-[#849396] tracking-wider uppercase">
            AVERAGE SCORE
          </span>
          <span className="text-[36px] font-semibold text-[#4b5563] leading-tight">84%</span>
          <span className="text-[12px] font-semibold text-[#849396] tracking-wide mt-2">
            Above class benchmark
          </span>
        </div>

        {/* Card 4: Participation Rate */}
        <div className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-6 rounded-xl flex flex-col gap-1 shadow-xs relative overflow-hidden">
          <span className="text-[12px] font-semibold text-[#849396] tracking-wider uppercase">
            PARTICIPATION RATE
          </span>
          <span className="text-[36px] font-semibold text-[#4b5563] leading-tight">92%</span>
          <span className="text-[12px] font-semibold text-[#849396] tracking-wide mt-2">
            High engagement level
          </span>
        </div>
      </div>

      {/* Middle Section: Learning Journey Progress + Question Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column (6 cols): Learning Journey Progress */}
        <div className="lg:col-span-6 bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-6 rounded-xl flex flex-col justify-between gap-6 shadow-xs">
          <div>
            <h2 className="text-[20px] font-semibold text-[#6b7280]">Learning Journey Progress</h2>
            <p className="text-[14px] font-normal text-[#849396] mt-0.5">
              Show how students progressed through the lesson.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Engage */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-medium text-[#6b7280]">Engage</span>
                <span className="font-bold text-[#459d9f]">100%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#9ca3af]/30 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-[#459d9f] to-[#9fd5d7] rounded-full" />
              </div>
            </div>

            {/* Explore */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-medium text-[#6b7280]">Explore</span>
                <span className="font-bold text-[#459d9f]">100%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#9ca3af]/30 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-[#459d9f] to-[#9fd5d7] rounded-full" />
              </div>
            </div>

            {/* Explain */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-medium text-[#6b7280]">Explain</span>
                <span className="font-bold text-[#459d9f]">93%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#9ca3af]/30 overflow-hidden">
                <div className="h-full w-[93%] bg-gradient-to-r from-[#459d9f] to-[#9fd5d7] rounded-full" />
              </div>
            </div>

            {/* Practice */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-medium text-[#6b7280]">Practice</span>
                <span className="font-bold text-[#459d9f]">88%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#9ca3af]/30 overflow-hidden">
                <div className="h-full w-[88%] bg-gradient-to-r from-[#459d9f] to-[#9fd5d7] rounded-full" />
              </div>
            </div>

            {/* Evaluate */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-medium text-[#6b7280]">Evaluate</span>
                <span className="font-bold text-[#459d9f]">82%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#9ca3af]/30 overflow-hidden">
                <div className="h-full w-[82%] bg-gradient-to-r from-[#459d9f] to-[#9fd5d7] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Question Performance */}
        <div className="lg:col-span-6 bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-6 rounded-xl flex flex-col justify-between gap-6 shadow-xs">
          <div>
            <h2 className="text-[20px] font-semibold text-[#6b7280]">Question Performance</h2>
            <p className="text-[14px] font-normal text-[#849396] mt-0.5">
              Identify which assessment items caused difficulty.
            </p>
          </div>

          {/* 2-Column Grid of Questions */}
          <div className="grid grid-cols-2 gap-3">
            {/* Q1 */}
            <div className="bg-[#ddf3f3] border border-[#459d9f]/30 p-3.5 rounded-lg flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[14px] font-normal text-[#6b7280]">Question 1</span>
                <span className="text-[10px] font-normal text-[#849396] uppercase tracking-wider">
                  CLICK FOR DETAILS
                </span>
              </div>
              <span className="text-[16px] font-normal text-[#6b7280]">92%</span>
            </div>

            {/* Q2 */}
            <div className="bg-[#ddf3f3] border border-[#459d9f]/30 p-3.5 rounded-lg flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[14px] font-normal text-[#6b7280]">Question 2</span>
                <span className="text-[10px] font-normal text-[#849396] uppercase tracking-wider">
                  CLICK FOR DETAILS
                </span>
              </div>
              <span className="text-[16px] font-normal text-[#6b7280]">85%</span>
            </div>

            {/* Q3 (Critical Difficulty Point) */}
            <div className="bg-[#f59e0b]/20 border border-[#f59e0b] p-3.5 rounded-lg flex items-center justify-between gap-2 relative overflow-hidden">
              <span className="absolute top-0 right-0 bg-[#f59e0b] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl">
                CRITICAL
              </span>
              <div className="flex flex-col">
                <span className="text-[14px] font-normal text-[#6b7280]">Question 3</span>
                <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">
                  DIFFICULTY POINT
                </span>
              </div>
              <span className="text-[16px] font-semibold text-[#f59e0b]">48%</span>
            </div>

            {/* Q4 */}
            <div className="bg-[#ddf3f3] border border-[#459d9f]/30 p-3.5 rounded-lg flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[14px] font-normal text-[#6b7280]">Question 4</span>
                <span className="text-[10px] font-normal text-[#849396] uppercase tracking-wider">
                  CLICK FOR DETAILS
                </span>
              </div>
              <span className="text-[16px] font-normal text-[#6b7280]">96%</span>
            </div>

            {/* Q5 */}
            <div className="bg-[#ddf3f3] border border-[#459d9f]/30 p-3.5 rounded-lg flex items-center justify-between gap-2 col-span-1">
              <div className="flex flex-col">
                <span className="text-[14px] font-normal text-[#6b7280]">Question 5</span>
                <span className="text-[10px] font-normal text-[#849396] uppercase tracking-wider">
                  CLICK FOR DETAILS
                </span>
              </div>
              <span className="text-[16px] font-normal text-[#6b7280]">96%</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#3b494c]/10 flex items-center gap-2 text-[12px] italic text-[#849396]">
            <Info className="size-4 shrink-0 text-[#849396]" />
            <span>Details reveal correct answers, common errors, and attempts.</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Engagement Over Time Chart + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column (7 cols): User Engagement Over Time */}
        <div className="lg:col-span-7 bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-6 rounded-xl flex flex-col justify-between gap-6 shadow-xs">
          <div>
            <h2 className="text-[20px] font-semibold text-[#6b7280]">User Engagement Over Time</h2>
            <p className="text-[14px] font-normal text-[#849396] mt-0.5">
              Total interactions recorded in the XR workspace.
            </p>
          </div>

          {/* Engagement SVG Chart */}
          <div className="w-full flex flex-col gap-4">
            <div className="relative w-full h-[180px]">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#459d9f" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#459d9f" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#849396" strokeDasharray="3 3" strokeOpacity="0.3" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#849396" strokeDasharray="3 3" strokeOpacity="0.3" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#849396" strokeDasharray="3 3" strokeOpacity="0.3" />

                {/* Area Gradient */}
                <path
                  d="M 0,140 L 50,155 L 100,120 L 150,145 L 200,125 L 250,90 L 300,135 L 350,120 L 400,100 L 450,130 L 500,110 L 500,180 L 0,180 Z"
                  fill="url(#engagementGradient)"
                />

                {/* Line Path */}
                <path
                  d="M 0,140 L 50,155 L 100,120 L 150,145 L 200,125 L 250,90 L 300,135 L 350,120 L 400,100 L 450,130 L 500,110"
                  fill="none"
                  stroke="#459d9f"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Time Labels */}
            <div className="flex items-center justify-between text-[12px] font-semibold text-[#849396] px-1">
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>00:00</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Leaderboard */}
        <div className="lg:col-span-5 bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-6 rounded-xl flex flex-col justify-between gap-6 shadow-xs">
          <h2 className="text-[20px] font-semibold text-[#6b7280]">Leaderboard</h2>

          <div className="flex flex-col">
            {/* Rank 1 */}
            <div className="flex items-center justify-between py-3 border-b border-[#3b494c]/10">
              <div className="flex items-center gap-4">
                <span className="w-4 text-[12px] font-bold text-[#849396] text-center">1</span>
                <div className="size-8 rounded-full bg-slate-300 relative overflow-hidden">
                  <Image src="/(new)/teacher-avatar.png" alt="Jane Alpha" fill className="object-cover" />
                </div>
                <span className="text-[14px] font-normal text-[#6b7280]">Jane Alpha</span>
              </div>
              <span className="text-[12px] font-semibold text-[#849396]">98.2 pts</span>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center justify-between py-3 border-b border-[#3b494c]/10">
              <div className="flex items-center gap-4">
                <span className="w-4 text-[12px] font-bold text-[#849396] text-center">2</span>
                <div className="size-8 rounded-full bg-slate-300 relative overflow-hidden">
                  <Image src="/(new)/teacher-avatar.png" alt="Marc Bloom" fill className="object-cover" />
                </div>
                <span className="text-[14px] font-normal text-[#6b7280]">Marc Bloom</span>
              </div>
              <span className="text-[12px] font-semibold text-[#849396]">97.5 pts</span>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center justify-between py-3 border-b border-[#3b494c]/10">
              <div className="flex items-center gap-4">
                <span className="w-4 text-[12px] font-bold text-[#849396] text-center">3</span>
                <div className="size-8 rounded-full bg-slate-300 relative overflow-hidden">
                  <Image src="/(new)/teacher-avatar.png" alt="Tariq Khan" fill className="object-cover" />
                </div>
                <span className="text-[14px] font-normal text-[#6b7280]">Tariq Khan</span>
              </div>
              <span className="text-[12px] font-semibold text-[#849396]">96.8 pts</span>
            </div>

            {/* Rank 4 */}
            <div className="flex items-center justify-between py-3 border-b border-[#3b494c]/10">
              <div className="flex items-center gap-4">
                <span className="w-4 text-[12px] font-bold text-[#849396] text-center">4</span>
                <div className="size-8 rounded-full bg-slate-300 relative overflow-hidden">
                  <Image src="/(new)/teacher-avatar.png" alt="Elena Luo" fill className="object-cover" />
                </div>
                <span className="text-[14px] font-normal text-[#6b7280]">Elena Luo</span>
              </div>
              <span className="text-[12px] font-semibold text-[#849396]">95.4 pts</span>
            </div>

            {/* Rank 5 */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <span className="w-4 text-[12px] font-bold text-[#849396] text-center">5</span>
                <div className="size-8 rounded-full bg-slate-300 relative overflow-hidden">
                  <Image src="/(new)/teacher-avatar.png" alt="Elena Luo" fill className="object-cover" />
                </div>
                <span className="text-[14px] font-normal text-[#6b7280]">Elena Luo</span>
              </div>
              <span className="text-[12px] font-semibold text-[#849396]">95.4 pts</span>
            </div>
          </div>

          <button className="w-full bg-[#ddf3f3] border border-[#459d9f]/30 text-[#4b5563] py-2 rounded-lg text-[14px] font-medium text-center hover:bg-[#cdebeb] transition-colors cursor-pointer">
            View All Students
          </button>
        </div>
      </div>
    </div>
  );
}
