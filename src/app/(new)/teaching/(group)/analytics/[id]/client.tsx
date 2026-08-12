'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, CheckCircle2, Info } from 'lucide-react';

interface AnalyticsDetailProps {
  sessionId: string;
}

export default function ClientPage({ sessionId }: AnalyticsDetailProps) {
  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-8 max-w-[1100px]">
      {/* Top Header: Back Button + Session Title */}
      <div className="flex items-center gap-4">
        <Link
          href="/teaching/analytics"
          className="size-10 rounded-full bg-surface-slate border border-primary-cta/20 flex items-center justify-center text-secondary-text shadow-xs hover:bg-primary-light/60 transition-colors shrink-0"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-h5 text-secondary-text">Forces & Motion Session</h1>
      </div>

      {/* Top Row: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Students Joined */}
        <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 rounded-xl flex flex-col gap-1 shadow-xs relative overflow-hidden">
          <span className="text-caption font-semibold text-tertiary tracking-wider uppercase">
            STUDENTS JOINED
          </span>
          <span className="text-h2 text-secondary-text leading-tight">24 / 25</span>
          <div className="flex items-center gap-1.5 mt-2 text-caption font-semibold text-status-online tracking-wide">
            <CheckCircle2 className="size-3.5" />
            <span>96% Attendance</span>
          </div>
        </div>

        {/* Card 2: Completion Rate */}
        <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 rounded-xl flex flex-col gap-1 shadow-xs relative overflow-hidden">
          <span className="text-caption font-semibold text-tertiary tracking-wider uppercase">
            COMPLETION RATE
          </span>
          <span className="text-h2 text-secondary-text leading-tight">96%</span>
          <span className="text-caption font-semibold text-tertiary tracking-wide mt-2">
            Active session goal met
          </span>
        </div>

        {/* Card 3: Average Score */}
        <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 rounded-xl flex flex-col gap-1 shadow-xs relative overflow-hidden">
          <span className="text-caption font-semibold text-tertiary tracking-wider uppercase">
            AVERAGE SCORE
          </span>
          <span className="text-h2 text-secondary-text leading-tight">84%</span>
          <span className="text-caption font-semibold text-tertiary tracking-wide mt-2">
            Above class benchmark
          </span>
        </div>

        {/* Card 4: Participation Rate */}
        <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 rounded-xl flex flex-col gap-1 shadow-xs relative overflow-hidden">
          <span className="text-caption font-semibold text-tertiary tracking-wider uppercase">
            PARTICIPATION RATE
          </span>
          <span className="text-h2 text-secondary-text leading-tight">92%</span>
          <span className="text-caption font-semibold text-tertiary tracking-wide mt-2">
            High engagement level
          </span>
        </div>
      </div>

      {/* Middle Section: Learning Journey Progress + Question Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column (6 cols): Learning Journey Progress */}
        <div className="lg:col-span-6 bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 rounded-xl flex flex-col justify-between gap-6 shadow-xs">
          <div>
            <h2 className="text-h6 text-tertiary">Learning Journey Progress</h2>
            <p className="text-small text-tertiary mt-0.5">
              Show how students progressed through the lesson.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Engage */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-small">
                <span className="font-medium text-tertiary">Engage</span>
                <span className="font-bold text-primary-cta">100%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-disable/30 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-primary-cta to-primary-light rounded-full" />
              </div>
            </div>

            {/* Explore */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-small">
                <span className="font-medium text-tertiary">Explore</span>
                <span className="font-bold text-primary-cta">100%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-disable/30 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-primary-cta to-primary-light rounded-full" />
              </div>
            </div>

            {/* Explain */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-small">
                <span className="font-medium text-tertiary">Explain</span>
                <span className="font-bold text-primary-cta">93%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-disable/30 overflow-hidden">
                <div className="h-full w-[93%] bg-gradient-to-r from-primary-cta to-primary-light rounded-full" />
              </div>
            </div>

            {/* Evaluate */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-small">
                <span className="font-medium text-tertiary">Evaluate</span>
                <span className="font-bold text-primary-cta">82%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-disable/30 overflow-hidden">
                <div className="h-full w-[82%] bg-gradient-to-r from-primary-cta to-primary-light rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Question Performance */}
        <div className="lg:col-span-6 bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 rounded-xl flex flex-col justify-between gap-6 shadow-xs">
          <div>
            <h2 className="text-h6 text-tertiary">Question Performance</h2>
            <p className="text-small text-tertiary mt-0.5">
              Identify which assessment items caused difficulty.
            </p>
          </div>

          {/* 2-Column Grid of Questions */}
          <div className="grid grid-cols-2 gap-3">
            {/* Q1 */}
            <div className="bg-primary-light border border-primary-cta/30 p-3.5 rounded-lg flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-small text-tertiary">Question 1</span>
                <span className="text-micro font-normal text-tertiary uppercase tracking-wider">
                  CLICK FOR DETAILS
                </span>
              </div>
              <span className="text-normal text-tertiary">92%</span>
            </div>

            {/* Q2 */}
            <div className="bg-primary-light border border-primary-cta/30 p-3.5 rounded-lg flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-small text-tertiary">Question 2</span>
                <span className="text-micro font-normal text-tertiary uppercase tracking-wider">
                  CLICK FOR DETAILS
                </span>
              </div>
              <span className="text-normal text-tertiary">85%</span>
            </div>

            {/* Q3 (Critical Difficulty Point) */}
            <div className="bg-warning/20 border border-warning p-3.5 rounded-lg flex items-center justify-between gap-2 relative overflow-hidden">
              <span className="absolute top-0 right-0 bg-warning text-primary-text-light text-[8px] font-bold px-1.5 py-0.5 rounded-bl">
                CRITICAL
              </span>
              <div className="flex flex-col">
                <span className="text-small text-tertiary">Question 3</span>
                <span className="text-micro font-bold text-warning uppercase tracking-wider">
                  DIFFICULTY POINT
                </span>
              </div>
              <span className="text-normal font-semibold text-warning">48%</span>
            </div>

            {/* Q4 */}
            <div className="bg-primary-light border border-primary-cta/30 p-3.5 rounded-lg flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-small text-tertiary">Question 4</span>
                <span className="text-micro font-normal text-tertiary uppercase tracking-wider">
                  CLICK FOR DETAILS
                </span>
              </div>
              <span className="text-normal text-tertiary">96%</span>
            </div>

            {/* Q5 */}
            <div className="bg-primary-light border border-primary-cta/30 p-3.5 rounded-lg flex items-center justify-between gap-2 col-span-1">
              <div className="flex flex-col">
                <span className="text-small text-tertiary">Question 5</span>
                <span className="text-micro font-normal text-tertiary uppercase tracking-wider">
                  CLICK FOR DETAILS
                </span>
              </div>
              <span className="text-normal text-tertiary">96%</span>
            </div>
          </div>

          <div className="pt-3 border-t border-primary-cta/10 flex items-center gap-2 text-caption italic text-tertiary">
            <Info className="size-4 shrink-0 text-tertiary" />
            <span>Details reveal correct answers, common errors, and attempts.</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Engagement Over Time Chart + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column (7 cols): User Engagement Over Time */}
        <div className="lg:col-span-7 bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 rounded-xl flex flex-col justify-between gap-6 shadow-xs">
          <div>
            <h2 className="text-h6 text-tertiary">User Engagement Over Time</h2>
            <p className="text-small text-tertiary mt-0.5">
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
            <div className="flex items-center justify-between text-caption font-semibold text-tertiary px-1">
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>00:00</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Leaderboard */}
        <div className="lg:col-span-5 bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 rounded-xl flex flex-col justify-between gap-6 shadow-xs">
          <h2 className="text-h6 text-tertiary">Leaderboard</h2>

          <div className="flex flex-col">
            {/* Rank 1 */}
            <div className="flex items-center justify-between py-3 border-b border-[#3b494c]/10">
              <div className="flex items-center gap-4">
                <span className="w-4 text-caption font-bold text-tertiary text-center">1</span>
                <div className="size-8 rounded-full bg-dark-card relative overflow-hidden">
                  <Image src="/(new)/teacher-avatar.png" alt="Jane Alpha" fill className="object-cover" />
                </div>
                <span className="text-small text-tertiary">Jane Alpha</span>
              </div>
              <span className="text-caption font-semibold text-tertiary">98.2 pts</span>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center justify-between py-3 border-b border-[#3b494c]/10">
              <div className="flex items-center gap-4">
                <span className="w-4 text-caption font-bold text-tertiary text-center">2</span>
                <div className="size-8 rounded-full bg-dark-card relative overflow-hidden">
                  <Image src="/(new)/teacher-avatar.png" alt="Marc Bloom" fill className="object-cover" />
                </div>
                <span className="text-small text-tertiary">Marc Bloom</span>
              </div>
              <span className="text-caption font-semibold text-tertiary">97.5 pts</span>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center justify-between py-3 border-b border-[#3b494c]/10">
              <div className="flex items-center gap-4">
                <span className="w-4 text-caption font-bold text-tertiary text-center">3</span>
                <div className="size-8 rounded-full bg-dark-card relative overflow-hidden">
                  <Image src="/(new)/teacher-avatar.png" alt="Tariq Khan" fill className="object-cover" />
                </div>
                <span className="text-small text-tertiary">Tariq Khan</span>
              </div>
              <span className="text-caption font-semibold text-tertiary">96.8 pts</span>
            </div>

            {/* Rank 4 */}
            <div className="flex items-center justify-between py-3 border-b border-[#3b494c]/10">
              <div className="flex items-center gap-4">
                <span className="w-4 text-caption font-bold text-tertiary text-center">4</span>
                <div className="size-8 rounded-full bg-dark-card relative overflow-hidden">
                  <Image src="/(new)/teacher-avatar.png" alt="Elena Luo" fill className="object-cover" />
                </div>
                <span className="text-small text-tertiary">Elena Luo</span>
              </div>
              <span className="text-caption font-semibold text-tertiary">95.4 pts</span>
            </div>

            {/* Rank 5 */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <span className="w-4 text-caption font-bold text-tertiary text-center">5</span>
                <div className="size-8 rounded-full bg-dark-card relative overflow-hidden">
                  <Image src="/(new)/teacher-avatar.png" alt="Elena Luo" fill className="object-cover" />
                </div>
                <span className="text-small text-tertiary">Elena Luo</span>
              </div>
              <span className="text-caption font-semibold text-tertiary">95.4 pts</span>
            </div>
          </div>

          <button className="w-full bg-primary-light border border-primary-cta/30 text-secondary-text py-2 rounded-lg text-small font-medium text-center hover:bg-primary-light/80 transition-colors cursor-pointer">
            View All Students
          </button>
        </div>
      </div>
    </div>
  );
}
