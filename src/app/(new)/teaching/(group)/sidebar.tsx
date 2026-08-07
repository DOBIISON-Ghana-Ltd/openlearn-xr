'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

import { DashboardOutlineSvg } from '@/components/(new)/svgs/dashboard-outline-svg';
import { DashboardFilledSvg } from '@/components/(new)/svgs/dashboard-filled-svg';
import { SessionsOutlineSvg } from '@/components/(new)/svgs/sessions-outline-svg';
import { SessionsFilledSvg } from '@/components/(new)/svgs/sessions-filled-svg';
import { LibraryOutlineSvg } from '@/components/(new)/svgs/library-outline-svg';
import { LibraryFilledSvg } from '@/components/(new)/svgs/library-filled-svg';
import { AnalyticsOutlineSvg } from '@/components/(new)/svgs/analytics-outline-svg';
import { AnalyticsFilledSvg } from '@/components/(new)/svgs/analytics-filled-svg';
import { ResourcesOutlineSvg } from '@/components/(new)/svgs/resources-outline-svg';
import { ResourcesFilledSvg } from '@/components/(new)/svgs/resources-filled-svg';
import { SettingsOutlineSvg } from '@/components/(new)/svgs/settings-outline-svg';
import { SettingsFilledSvg } from '@/components/(new)/svgs/settings-filled-svg';

const SIDEBAR_NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/teaching',
    OutlineIcon: DashboardOutlineSvg,
    FilledIcon: DashboardFilledSvg,
  },
  {
    id: 'sessions',
    label: 'Sessions',
    href: '/teaching/sessions',
    OutlineIcon: SessionsOutlineSvg,
    FilledIcon: SessionsFilledSvg,
  },
  {
    id: 'library',
    label: 'Library',
    href: '/teaching/library',
    OutlineIcon: LibraryOutlineSvg,
    FilledIcon: LibraryFilledSvg,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/teaching/analytics',
    OutlineIcon: AnalyticsOutlineSvg,
    FilledIcon: AnalyticsFilledSvg,
  },
  {
    id: 'resources',
    label: 'Resources',
    href: '/teaching/resources',
    OutlineIcon: ResourcesOutlineSvg,
    FilledIcon: ResourcesFilledSvg,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/teaching/settings',
    OutlineIcon: SettingsOutlineSvg,
    FilledIcon: SettingsFilledSvg,
  },
];

export function TeachingSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-[356px] shrink-0 bg-surface-slate pt-6 pb-12 pl-6 md:pl-20 pr-0 sticky top-[101px] h-[calc(100dvh-101px)] flex flex-col justify-start gap-14 overflow-y-auto">
      <div className="flex flex-col gap-3 w-full">
        {SIDEBAR_NAV.map((item) => {
          const isActive =
            item.href === '/teaching'
              ? pathname === '/teaching'
              : pathname.startsWith(item.href);

          const Icon = isActive ? item.FilledIcon : item.OutlineIcon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'w-full h-[50px] flex items-center gap-3 px-5 py-3 rounded-l-xl rounded-r-none text-normal transition-all',
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

      {/* Sidebar Bottom: Help Center & User Profile */}
      <div className="flex flex-col gap-1 pr-6 md:pr-8">
        <Link
          href="/help"
          className="flex items-center gap-4 px-8 py-3 text-disable hover:text-secondary-text text-small transition-colors"
        >
          <HelpCircle className="size-5 shrink-0" />
          <span>Help Center</span>
        </Link>

        <div className="bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-4 rounded-xl flex items-center gap-4 shadow-xs">
          <div className="relative size-10 rounded-full overflow-hidden border-primary-cta/30 shrink-0">
            <Image
              src="/(new)/teacher-avatar.png"
              alt="Mr. Mensah"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-small text-secondary-text">Mr. Mensah</span>
            <span className="text-caption text-secondary-text">Teacher</span>
          </div>
        </div>
      </div>
    </aside>
  );
}