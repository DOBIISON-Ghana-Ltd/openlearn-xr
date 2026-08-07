'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function TeachingDashboardClient() {
  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-6 max-w-[1084px]">
      {/* RED BOX 1: Top Hero Banner */}
      <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 rounded-xl p-8 flex flex-col gap-4 shadow-xs">
        <h1 className="text-h5 text-secondary-text">
          Good morning, Mr. Mensah
        </h1>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/teaching/sessions/create"
            className="bg-primary-cta hover:bg-primary-hover text-primary-text-light px-6 py-3 rounded-lg text-normal inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <Plus className="size-5" />
            <span>Create Session</span>
          </Link>

          <button
            type="button"
            className="bg-transparent hover:bg-surface-white/60 text-primary-cta border border-primary-cta px-6 py-3 rounded-lg text-normal inline-flex items-center gap-2 transition-all cursor-pointer active:scale-98"
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
            <h2 className="text-h5 text-secondary-text">Your Sessions</h2>
            <Link href="/teaching/sessions" className="text-primary-cta hover:underline text-small cursor-pointer">
              View All
            </Link>
          </div>

          {/* Session Card 1 (Live) */}
          <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-8 rounded-xl flex items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h3 className="text-large text-secondary-text">Atomic Structure</h3>
                <span className="bg-primary-light text-primary-cta text-caption px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-primary-cta/20">
                  <span className="size-2 rounded-full bg-primary-cta animate-pulse" />
                  Live
                </span>
              </div>
              <span className="text-normal text-disable">Physics • Year 2</span>
              <span className="text-caption text-primary-cta">18 / 25 students</span>
            </div>

            <Link
              href="/teaching/sessions/live"
              className="border border-primary-cta text-primary-cta hover:bg-primary-cta hover:text-primary-text-light px-6 py-2 rounded-lg text-normal transition-all cursor-pointer shrink-0"
            >
              Continue
            </Link>
          </div>

          {/* Session Card 2 (Completed) */}
          <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-8 rounded-xl flex items-center justify-between gap-4 shadow-xs">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h3 className="text-large text-secondary-text">Forces & Motion</h3>
                <span className="bg-tertiary text-primary-text-light text-caption px-3 py-1 rounded-full">
                  Completed
                </span>
              </div>
              <span className="text-normal text-disable">Physics • Year 1</span>
              <span className="text-caption text-tertiary">24 students</span>
            </div>

            <Link
              href="/teaching/analytics/forces-motion"
              className="border border-tertiary text-tertiary hover:bg-tertiary hover:text-primary-text-light px-6 py-2 rounded-lg text-normal transition-all cursor-pointer shrink-0"
            >
              View Report
            </Link>
          </div>

          {/* Quick Stats Block inside Green Box 1 */}
          <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-8 rounded-xl flex flex-col gap-5 shadow-xs mt-2">
            <h2 className="text-h5 text-secondary-text">Quick Stats</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-primary-light border border-primary-cta/10 p-4 rounded-lg flex flex-col gap-2">
                <span className="text-h5 text-secondary-text">8</span>
                <span className="text-caption text-secondary-text">Sessions This Week</span>
              </div>

              <div className="bg-primary-light border border-primary-cta/10 p-4 rounded-lg flex flex-col gap-2">
                <span className="text-h5 text-secondary-text">142</span>
                <span className="text-caption text-secondary-text">Students Engaged</span>
              </div>

              <div className="bg-primary-light border border-primary-cta/10 p-4 rounded-lg flex flex-col gap-2">
                <span className="text-h5 text-secondary-text">85%</span>
                <span className="text-caption text-secondary-text">Avg. Engagement</span>
              </div>
            </div>
          </div>
        </div>

        {/* GREEN BOX 2 (5 cols): Today's Schedule Shifted Down */}
        <div className="lg:col-span-5 flex flex-col gap-4 pt-0 lg:pt-[44px]">
          <div className="bg-primary-subtle backdrop-blur-[6px] p-8 rounded-xl flex flex-col gap-6 shadow-xs h-full">
            <h2 className="text-h5 text-secondary-text">Today's Schedule</h2>

            <div className="flex flex-col gap-6">
              {/* Item 1 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-10 rounded-full bg-primary-light flex items-center justify-center text-primary-cta shrink-0">
                    <FlaskIcon className="size-4" />
                  </div>
                  <div className="w-px flex-1 bg-primary-cta/30 my-2" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-caption text-tertiary">09:00 AM</span>
                  <span className="text-normal text-secondary-text">Atomic Structure</span>
                  <span className="text-caption text-primary-cta">Live now</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-10 rounded-full bg-tertiary flex items-center justify-center text-primary-text-light shrink-0">
                    <FlaskIcon className="size-4" />
                  </div>
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-caption text-tertiary">11:30 AM</span>
                  <span className="text-normal text-secondary-text leading-tight">
                    Reaction Conditions Lab
                  </span>
                  <span className="text-caption text-disable mt-1">Upcoming</span>
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
