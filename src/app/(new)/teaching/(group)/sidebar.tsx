'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PATHS } from '@/lib/constants/paths';

import {
  DashboardOutlineSvg,
  DashboardFilledSvg,
  SessionsOutlineSvg,
  SessionsFilledSvg,
  LibraryOutlineSvg,
  LibraryFilledSvg,
  AnalyticsOutlineSvg,
  AnalyticsFilledSvg,
  ResourcesOutlineSvg,
  ResourcesFilledSvg,
  SettingsOutlineSvg,
  SettingsFilledSvg,
} from '@/components/(new)/svgs';

const SIDEBAR_NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: PATHS.TEACHING.ROOT,
    OutlineIcon: DashboardOutlineSvg,
    FilledIcon: DashboardFilledSvg,
  },
  {
    id: 'sessions',
    label: 'Sessions',
    href: PATHS.TEACHING.SESSIONS.ROOT,
    OutlineIcon: SessionsOutlineSvg,
    FilledIcon: SessionsFilledSvg,
  },
  {
    id: 'library',
    label: 'Library',
    href: PATHS.TEACHING.LIBRARY,
    OutlineIcon: LibraryOutlineSvg,
    FilledIcon: LibraryFilledSvg,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: PATHS.TEACHING.ANALYTICS.HOME,
    OutlineIcon: AnalyticsOutlineSvg,
    FilledIcon: AnalyticsFilledSvg,
  },
  {
    id: 'resources',
    label: 'Resources',
    href: PATHS.TEACHING.RESOURCES,
    OutlineIcon: ResourcesOutlineSvg,
    FilledIcon: ResourcesFilledSvg,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: PATHS.TEACHING.SETTINGS,
    OutlineIcon: SettingsOutlineSvg,
    FilledIcon: SettingsFilledSvg,
  },
];

export function TeachingSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full max-w-sm shrink-0 bg-surface-slate pt-6 pb-12 pl-6 md:pl-20 pr-0 sticky top-20 h-[calc(100dvh-var(--spacing)*20)] flex flex-col justify-start gap-14 overflow-y-auto">
      <div className="flex flex-col gap-3 w-full">
        {SIDEBAR_NAV.map((item) => {
          const isActive =
            item.href === PATHS.TEACHING.ROOT
              ? pathname === PATHS.TEACHING.ROOT
              : pathname.startsWith(item.href);

          const Icon = isActive ? item.FilledIcon : item.OutlineIcon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'w-full h-12 flex items-center gap-3 px-5 py-3 rounded-l-xl rounded-r-none text-normal transition-all',
                {
                  'bg-primary-cta text-primary-text-light shadow-sm font-semibold': isActive,
                  'bg-primary-subtle text-secondary-text hover:bg-primary-light/60 hover:text-primary-text-dark': !isActive,
                }
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}