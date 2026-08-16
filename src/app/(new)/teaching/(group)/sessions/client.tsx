'use client';

import ImageWithFallback from '@/components/(new)/common/image-with-fallback';
import Link from 'next/link';
import { Presentation, Pencil, Trash2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { match, P } from 'ts-pattern';
import useApi from '@/data/hooks/use-api';
import { PATHS } from '@/lib/constants/paths';
import { Infer } from '@/data/types.base';
import { AVATARS } from '@/lib/constants/avatars';

export default function ClientPage() {
  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-6 max-w-5xl">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Active Now Section */}
          <ActiveSessions />

          {/* Upcoming Today Section */}
          <UpcomingToday />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6 pt-0 lg:pt-11">
          {/* October 2024 Mini Calendar (Aligned with Atomic Structure Card) */}
          <Calendar />

          {/* Recent Activity Card Widget */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

type ICalendarItem = {
  label: string,
  type: "head" | "date:gray" | "date:normal" | "date:active" | "date:priority"
}
function Calendar() {
  const CALENDAR_ITEMS: ICalendarItem[] = [
    { label: "M", type: "head" }, { label: "T", type: "head" }, { label: "W", type: "head" },
    { label: "T", type: "head" }, { label: "F", type: "head" }, { label: "S", type: "head" },
    { label: "S", type: "head" }, { label: "27", type: "date:gray" }, { label: "28", type: "date:gray" },
    { label: "29", type: "date:gray" }, { label: "30", type: "date:gray" }, { label: "1", type: "date:normal" },
    { label: "2", type: "date:normal" }, { label: "3", type: "date:normal" }, { label: "21", type: "date:normal" },
    { label: "22", type: "date:normal" }, { label: "23", type: "date:normal" }, { label: "24", type: "date:active" },
    { label: "25", type: "date:priority" }, { label: "26", type: "date:normal" }, { label: "27", type: "date:normal" },
  ];

  const getClass = (value: ICalendarItem["type"]) => {
    return match(value)
      .with("head", () => "text-caption text-disable")
      .with("date:gray", () => "text-small text-tertiary opacity-30 py-2")
      .with("date:normal", () => "text-small text-tertiary py-2")
      .with("date:active", () => "bg-primary-cta text-primary-text-light text-small py-2 rounded-lg shadow-sm")
      .with("date:priority", () => "relative flex flex-col items-center justify-center py-2 text-small text-tertiary")
      .exhaustive();
  };

  return (
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
        {CALENDAR_ITEMS.map((item, i) => (
          <div key={i} className={getClass(item.type)}>
            <span>{item.label}</span>
            {item.type === "date:priority" && (
              <span className="size-1 rounded-full bg-primary-cta absolute bottom-0.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type IUpcomingItem = {
  id: string;
  time: string;
  date: string;
  title: string;
  info: string;
};
function UpcomingToday() {
  const items: IUpcomingItem[] = [
    { id: "1", time: "14:00", date: "Oct 24", title: "Atomic Structure", info: "Chemistry • Year 2" },
    { id: "2", time: "15:30", date: "Oct 24", title: "Atomic Structure", info: "Chemistry • Year 2" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-h5 text-secondary-text">Upcoming Today</h2>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="bg-primary-subtle border border-[#3b494c]/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center border-r border-[#3b494c]/20 pr-4">
                <span className="text-micro font-light text-disable">{item.time}</span>
                <span className="text-h6 text-disable leading-tight">{item.date}</span>
              </div>

              <div className="flex flex-col">
                <h4 className="text-small text-secondary-text">{item.title}</h4>
                <span className="text-caption text-tertiary">{item.info}</span>
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
        ))}
      </div>
    </div>
  );
}

type IRecentItem = {
  id: string;
  title: string;
  timeAgo: string;
  students: number;
};
function RecentActivity() {
  const items: IRecentItem[] = [
    { id: "1", title: "Atomic Structure", timeAgo: "45m ago", students: 28 },
    { id: "2", title: "Atomic Structure", timeAgo: "2h ago", students: 31 },
  ];

  return (
    <div className="bg-primary-subtle border border-[#3b494c]/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h4 className="text-small text-secondary-text">Recent Activity</h4>
        <Link href="/teaching/history" className="text-caption text-primary-cta hover:underline">
          View History
        </Link>
      </div>

      <div className="flex flex-col gap-4 pt-1">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col">
            <span className="text-small text-tertiary">{item.title}</span>
            <span className="text-caption text-disable">Ended {item.timeAgo} • {item.students} students</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type ISessionItem = Infer["SesSessionGetAll"]["res"][number];

function SessionCard({ data }: { data: ISessionItem }) {
  const { title: moduleTitle, image } = data.moduleVersion.module;
  const title = data.name || moduleTitle;
  const subtitle = `${data.moduleVersion.module.collection.name} • ${data.moduleVersion.module.collection.grade}`;
  const joinedCount = data._count.players;
  const maxAdmissions = data.config.maxAdmissions;
  const players = data.players || [];
  const remainder = joinedCount > players.length ? joinedCount - players.length : 0;

  return (
    <div className="bg-primary-subtle p-4 rounded-xl border border-surface-white/80 flex flex-col md:flex-row gap-4 relative shadow-xs">

      {/* Thumbnail Image with Gradient Overlay */}
      <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
        <ImageWithFallback
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 192px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-caption text-primary-light">
          <Users className="size-3.5" />
          <span>{joinedCount}/{maxAdmissions} Joined</span>
        </div>
      </div>

      {/* Info & Action */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className='space-y-1'>
          <h3 className="text-h6 text-tertiary">{title}</h3>
          <p className="text-normal text-tertiary">{subtitle}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Avatar Overlap Stack */}
          <div className="flex items-center -space-x-2">
            {players.map((p, idx) => (
              <img
                key={idx}
                src={AVATARS[p.avatar]}
                alt={p.name || 'Player avatar'}
                className="size-8 rounded-full object-cover border-2 border-tertiary"
                title={p.name}
              />
            ))}
            {remainder > 0 && (
              <div className="size-8 rounded-full bg-secondary-text border-2 border-tertiary flex items-center justify-center text-primary-text-light text-caption">
                +{remainder}
              </div>
            )}
          </div>

          <Link
            href={PATHS.TEACHING.SESSIONS.DETAIL(data.joinCode)}
            className="border border-primary-cta text-primary-cta hover:bg-primary-cta hover:text-primary-text-light px-6 py-2 rounded-lg text-normal transition-all cursor-pointer"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

function ActiveSessions() {
  const { data: sessions, isLoading } = useApi.query("ses:session:get:all", {
    status: ["ACTIVE", "STAGING"],
  });

  return (
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
        <span className="text-small text-tertiary">
          {sessions?.length ?? 0} {sessions?.length === 1 ? 'Session Running' : 'Sessions Running'}
        </span>
      </div>

      {match({ sessions, isLoading })
        .with({ isLoading: true }, () => <ActiveSessions.Loading />)
        .with(
          { sessions: P.nullish, isLoading: false },
          { sessions: [] },
          () => <ActiveSessions.Empty />
        )
        .with({ sessions: P.select(P.nonNullable) }, (sessions) =>
          sessions.map((session) => (
            <SessionCard key={session.id} data={session} />
          ))
        )
        .exhaustive()
      }
    </div>
  );
}

ActiveSessions.Loading = function ActiveSessionsLoading() {
  return (
    <div className="bg-primary-subtle border border-surface-white/80 p-8 rounded-xl text-secondary-text text-normal">
      Loading active sessions...
    </div>
  );
};

ActiveSessions.Empty = function ActiveSessionsEmpty() {
  return (
    <div className="bg-primary-subtle border border-surface-white/80 p-8 rounded-xl text-secondary-text text-normal">
      No active sessions running.
    </div>
  );
};