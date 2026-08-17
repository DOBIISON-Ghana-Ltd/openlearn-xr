'use client';

import Link from 'next/link';
import { FlaskConicalIcon, PlusIcon } from 'lucide-react';
import useApi from '@/data/hooks/use-api';
import { PATHS } from '@/lib/constants/paths';
import { Infer } from '@/data/types.base';
import { match, P } from 'ts-pattern';
import { cn } from '@/lib/utils/cn';
import StateLoading from '@/components/(new)/common/state.loading';
import StateEmpty from '@/components/(new)/common/state.empty';

export default function ClientPage() {
  const { data: user } = useApi.query("app:user:get:me");

  return (
    <div className="py-8 px-10 flex flex-col gap-6 max-w-6xl">

      <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 rounded-xl p-8 flex flex-col gap-4 shadow-xs">
        <h1 className="text-h5 text-secondary-text">
          Good morning, {user?.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href={PATHS.TEACHING.SESSIONS.CREATE}
            className="bg-primary-cta hover:bg-primary-hover text-primary-text-light px-6 py-3 rounded-lg text-normal inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <PlusIcon className="size-5" />
            <span>Create Session</span>
          </Link>

          <Link
            href={PATHS.PLAY('session')}
            className="bg-transparent hover:bg-surface-white/60 text-primary-cta border border-primary-cta px-6 py-3 rounded-lg text-normal inline-flex items-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <span>Join a Session</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <RecentSessions />
          <QuickStats />
        </div>

        {/* GREEN BOX 2 (5 cols): Today's Schedule Shifted Down */}
        <div className="lg:col-span-5 flex flex-col gap-4 pt-0 lg:pt-13">
          <TopSchedulesToday />
        </div>
      </div>
    </div>
  );
}

function RecentSessions() {
  const { data: sessions, isLoading } = useApi.query("ses:session:get:recent");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h5 text-secondary-text">Your Sessions</h2>
        <Link href={PATHS.TEACHING.SESSIONS.ROOT} className="text-primary-cta hover:underline text-small cursor-pointer">
          View All
        </Link>
      </div>

      {match({ sessions, isLoading })
        .with({ isLoading: true }, () => <StateLoading />)
        .with({ sessions: P.nullish, isLoading: false }, { sessions: [] }, () => <StateEmpty message="No recent sessions found." />)
        .with({ sessions: P.select(P.nonNullable) }, (sessions) =>
          sessions.map((session) => (
            <RecentSessionCard key={session.id} data={session} />
          ))
        )
        .exhaustive()
      }
    </div>
  );
};

type IRecentSessionCard = {
  data: Infer["SesSessionGetRecent"]["res"][number];
}
function RecentSessionCard(props: IRecentSessionCard) {
  const {
    id,
    joinCode,
    status,
    config,
    _count: { players },
    moduleVersion: { module },
  } = props.data;

  return (
    <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-8 rounded-xl flex items-center justify-between gap-4 shadow-xs">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <h3 className="text-large text-secondary-text">{module.title}</h3>
          {match(status)
            .with("ACTIVE", "STAGING", () => (
              <span className="bg-primary-light text-primary-cta text-caption px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-primary-cta/20">
                <span className="size-2 rounded-full bg-primary-cta animate-pulse" />
                Live
              </span>
            ))
            .with("CANCELLED", "COMPLETED", () => (
              <span className="bg-tertiary text-primary-text-light text-caption px-3 py-1 rounded-full">
                Completed
              </span>
            ))
            .exhaustive()}
        </div>
        <span className="text-normal text-disable">{`${module.collection.name} • ${module.collection.grade}`}</span>
        <span className="text-caption text-tertiary">{`${players} / ${config.maxAdmissions} students`}</span>
      </div>

      {match(status)
        .with("ACTIVE", "STAGING", () => (
          <Link
            href={PATHS.TEACHING.SESSIONS.DETAIL(joinCode)}
            className="border border-primary-cta text-primary-cta hover:bg-primary-cta hover:text-primary-text-light px-6 py-2 rounded-lg text-normal transition-all cursor-pointer shrink-0"
          >
            Continue
          </Link>
        ))
        .with("CANCELLED", "COMPLETED", () => (
          <Link
            href={PATHS.TEACHING.ANALYTICS.DETAIL(id)}
            className="border border-tertiary text-tertiary hover:bg-tertiary hover:text-primary-text-light px-6 py-2 rounded-lg text-normal transition-all cursor-pointer shrink-0"
          >
            View Report
          </Link>
        ))
        .exhaustive()}
    </div>
  );
};

function QuickStats() {
  return (
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
  )
};

function TopSchedulesToday() {
  const items = [
    { time: "09:00 AM", name: "Atomic Structure", isLive: true },
    { time: "11:30 AM", name: "Reaction Conditions Lab", isLive: false },
  ];

  return (
    <div className="bg-primary-subtle backdrop-blur-[6px] p-8 rounded-xl flex flex-col gap-6 shadow-xs h-full">
      <h2 className="text-h5 text-secondary-text">Today's Schedule</h2>

      <div className="flex flex-col gap-6">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div
              className={cn("size-10 rounded-full flex items-center justify-center shrink-0 bg-tertiary text-primary-text-light", {
                "bg-primary-light text-primary-cta": item.isLive
              })}
            >
              <FlaskConicalIcon className="size-4" />
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-caption text-tertiary">{item.time}</span>
              <span className="text-normal text-secondary-text leading-tight">{item.name}</span>
              <span
                className={cn("text-caption text-disable mt-1", {
                  "text-primary-cta": item.isLive,
                })}
              >
                {item.isLive ? "Live now" : "Upcoming"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}