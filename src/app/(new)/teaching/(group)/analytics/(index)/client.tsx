'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils/cn';
import useApi from '@/data/hooks/use-api';
import { Infer } from '@/data/types.base';
import { PATHS } from '@/lib/constants/paths';

export default function ClientPage() {
  const { data: sessions } = useApi.query("ses:analytics:get:all");

  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-6 max-w-5xl">
      {/* Full-width Section Title */}
      <h2 className="text-h5 text-secondary-text">Your Sessions</h2>

      {/* Two-Column Layout: Main Sessions Stream (Left) + Quick Stats Widget (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Stream (7 cols): Session Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {sessions?.map((session) => (
            <AnalyticCard key={session.id} data={session} />
          ))}
        </div>

        {/* Right Column (5 cols): Quick Stats */}
        <QuickStats />
      </div>
    </div>
  );
};

type IAnalyticCard = {
  data: Infer["SesAnalyticsGetAll"]["res"][number];
}
function AnalyticCard(props: IAnalyticCard) {
  const {
    id,
    status,
    config,
    _count: { players },
    moduleVersion: { module },
  } = props.data;

  const isLive = status === "ACTIVE" || status === "STAGING";

  return (
    <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-8 rounded-xl flex items-center justify-between gap-4 shadow-xs">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <h3 className="text-large text-secondary-text">{module.title}</h3>
          {isLive ? (
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
        <span className="text-normal text-disable">
          {`${module.collection.name} • ${module.collection.grade}`}
        </span>
        <span
          className={cn(
            'text-caption text-tertiary',
            { 'text-caption text-primary-cta': isLive }
          )}
        >
          {`${players} / ${config.maxAdmissions} Players`}
        </span>
      </div>

      <Link
        href={PATHS.TEACHING.ANALYTICS.DETAIL(id)}
        className={cn(
          'border border-tertiary text-tertiary hover:bg-tertiary hover:text-primary-text-light px-6 py-2 rounded-lg text-normal transition-all cursor-pointer shrink-0',
          { 'border-primary-cta text-primary-cta hover:bg-primary-cta': isLive }
        )}
      >
        View Analytics
      </Link>
    </div>
  )
}

function QuickStats() {
  const { data: stats } = useApi.query("ses:session:get:stats");

  return (
    <div className="lg:col-span-5 flex flex-col">
      <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-8 rounded-xl flex flex-col gap-6 shadow-xs">
        <h3 className="text-h5 text-secondary-text">Quick Stats</h3>

        <div className="flex flex-col gap-3">
          {stats?.map((stat) => (
            <div key={stat.label} className="bg-primary-light border border-primary-cta/10 p-4 rounded-lg flex flex-col gap-2">
              <span className="text-h5 text-secondary-text">{stat.value}</span>
              <span className="text-caption text-secondary-text">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}