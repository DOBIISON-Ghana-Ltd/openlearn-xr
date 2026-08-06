'use client';

import Link from 'next/link';

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
      <h2 className="text-[24px] font-semibold text-[#4b5563]">Your Sessions</h2>

      {/* Two-Column Layout: Main Sessions Stream (Left) + Quick Stats Widget (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Stream (7 cols): Session Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {ANALYTICS_SESSIONS.map((session) => (
            <div
              key={session.id}
              className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-8 rounded-xl flex items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-[18px] font-normal text-[#4b5563]">{session.title}</h3>
                  {session.status === 'Live' ? (
                    <span className="bg-[#ddf3f3] text-[#459d9f] text-[12px] font-light px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-[#00daf3]/20">
                      <span className="size-2 rounded-full bg-[#459d9f] animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="bg-[#6b7280] text-[#bac9cc] text-[12px] font-light px-3 py-1 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
                <span className="text-[16px] font-normal text-[#9ca3af]">{session.subjectGrade}</span>
                <span
                  className={
                    session.status === 'Live'
                      ? 'text-[12px] font-light text-[#459d9f]'
                      : 'text-[12px] font-light text-[#6b7280]'
                  }
                >
                  {session.studentsInfo}
                </span>
              </div>

              <Link
                href={`/teaching/analytics/${session.id}`}
                className={
                  session.status === 'Live'
                    ? 'border border-[#459d9f] text-[#459d9f] hover:bg-[#459d9f] hover:text-white px-6 py-2 rounded-lg text-[16px] font-normal transition-all cursor-pointer shrink-0'
                    : 'border border-[#3b494c] text-[#6b7280] hover:bg-[#6b7280] hover:text-white px-6 py-2 rounded-lg text-[16px] font-normal transition-all cursor-pointer shrink-0'
                }
              >
                View Analytics
              </Link>
            </div>
          ))}
        </div>

        {/* Right Column (5 cols): Quick Stats */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#f2fafa] backdrop-blur-[6px] border border-white/80 p-8 rounded-xl flex flex-col gap-6 shadow-xs">
            <h3 className="text-[24px] font-semibold text-[#4b5563]">Quick Stats</h3>

            <div className="flex flex-col gap-3">
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
      </div>
    </div>
  );
}
