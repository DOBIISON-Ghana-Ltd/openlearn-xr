'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

interface SessionItem {
  id: string;
  title: string;
  subjectGrade: string;
  studentsInfo: string;
  status: 'Live' | 'Completed';
}

const ANALYTICS_SESSIONS: SessionItem[] = [
  {
    id: '1',
    title: 'Atomic Structure',
    subjectGrade: 'Physics • Year 2',
    studentsInfo: '18 / 25 students',
    status: 'Live',
  },
  {
    id: '2',
    title: 'Forces & Motion',
    subjectGrade: 'Physics • Year 1',
    studentsInfo: '24 students',
    status: 'Completed',
  },
  {
    id: '3',
    title: 'Forces & Motion',
    subjectGrade: 'Physics • Year 1',
    studentsInfo: '24 students',
    status: 'Completed',
  },
  {
    id: '4',
    title: 'Forces & Motion',
    subjectGrade: 'Physics • Year 1',
    studentsInfo: '24 students',
    status: 'Completed',
  },
];

export default function AnalyticsClient() {
  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-6 max-w-[1084px]">
      {/* Full-width Section Title */}
      <h2 className="text-h5 text-secondary-text">Your Sessions</h2>

      {/* Two-Column Layout: Main Sessions Stream (Left) + Quick Stats Widget (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Stream (7 cols): Session Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {ANALYTICS_SESSIONS.map((session) => (
            <div
              key={session.id}
              className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-8 rounded-xl flex items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-large text-secondary-text">{session.title}</h3>
                  {session.status === 'Live' ? (
                    <span className="bg-primary-light text-primary-cta text-caption px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-primary-cta/20">
                      <span className="size-2 rounded-full bg-primary-cta animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="bg-tertiary text-primary-text-light text-caption px-3 py-1 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
                <span className="text-normal text-disable">{session.subjectGrade}</span>
                <span
                  className={cn(
                    session.status === 'Live'
                      ? 'text-caption text-primary-cta'
                      : 'text-caption text-tertiary'
                  )}
                >
                  {session.studentsInfo}
                </span>
              </div>

              <Link
                href={`/teaching/analytics/${session.id}`}
                className={cn(
                  session.status === 'Live'
                    ? 'border border-primary-cta text-primary-cta hover:bg-primary-cta hover:text-primary-text-light px-6 py-2 rounded-lg text-normal transition-all cursor-pointer shrink-0'
                    : 'border border-tertiary text-tertiary hover:bg-tertiary hover:text-primary-text-light px-6 py-2 rounded-lg text-normal transition-all cursor-pointer shrink-0'
                )}
              >
                View Analytics
              </Link>
            </div>
          ))}
        </div>

        {/* Right Column (5 cols): Quick Stats */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-8 rounded-xl flex flex-col gap-6 shadow-xs">
            <h3 className="text-h5 text-secondary-text">Quick Stats</h3>

            <div className="flex flex-col gap-3">
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
      </div>
    </div>
  );
}
