'use client';

import ModuleCard from '@/components/(new)/common/module-card';
import { Search, ChevronDown } from 'lucide-react';

interface LibraryModule {
  id: string;
  title: string;
  duration: string;
  level: string;
  image: string;
}

const LIBRARY_MODULES: LibraryModule[] = [
  { id: '1', title: 'Measurement of Physical Quantities', duration: '30m', level: 'Beginner', image: '/(new)/module-thumbnail.png' },
  { id: '2', title: 'Measurement of Physical Quantities', duration: '20m', level: 'Intermediate', image: '/(new)/module-thumbnail.png' },
  { id: '3', title: 'Measurement of Physical Quantities', duration: '30m', level: 'Advance', image: '/(new)/module-thumbnail.png' },
  { id: '4', title: 'Measurement of Physical Quantities', duration: '30m', level: 'Beginner', image: '/(new)/module-thumbnail.png' },
  { id: '5', title: 'Measurement of Physical Quantities', duration: '20m', level: 'Intermediate', image: '/(new)/module-thumbnail.png' },
  { id: '6', title: 'Measurement of Physical Quantities', duration: '30m', level: 'Advance', image: '/(new)/module-thumbnail.png' },
  { id: '7', title: 'Measurement of Physical Quantities', duration: '30m', level: 'Beginner', image: '/(new)/module-thumbnail.png' },
  { id: '8', title: 'Measurement of Physical Quantities', duration: '20m', level: 'Intermediate', image: '/(new)/module-thumbnail.png' },
  { id: '9', title: 'Measurement of Physical Quantities', duration: '30m', level: 'Advance', image: '/(new)/module-thumbnail.png' },
];

export default function ClientPage() {
  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-8 max-w-[1084px]">
      {/* Top Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar Input */}
        <div className="relative w-full md:w-[387px] h-[50px] bg-primary-subtle border-2 border-primary-light rounded-[10px] flex items-center px-4">
          <input
            type="text"
            placeholder="Search for topics"
            className="w-full bg-transparent text-normal text-secondary-text placeholder-tertiary outline-none"
          />
          <Search className="size-5 text-tertiary shrink-0" />
        </div>

        {/* Dropdown Select Filters */}
        <div className="flex items-center gap-6">
          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <span className="text-caption text-tertiary tracking-wider uppercase">SUBJECT:</span>
            <div className="relative bg-dark-card text-[#e0e3e8] rounded-[8px] px-3 py-2 flex items-center justify-between gap-3 w-[138px] cursor-pointer">
              <span className="text-small">All Subjects</span>
              <ChevronDown className="size-4 shrink-0 text-[#e0e3e8]" />
            </div>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-caption text-tertiary tracking-wider uppercase">YEAR:</span>
            <div className="relative bg-dark-card text-[#e0e3e8] rounded-[8px] px-3 py-2 flex items-center justify-between gap-3 min-w-[110px] cursor-pointer">
              <span className="text-small">All Years</span>
              <ChevronDown className="size-4 shrink-0 text-[#e0e3e8]" />
            </div>
          </div>
        </div>
      </div>

      {/* Modules 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LIBRARY_MODULES.map((item) => (
          <ModuleCard
            key={item.id}
            data={{
              id: item.id,
              module: {
                title: item.title,
                duration: item.duration,
                difficulty: item.level,
                image: item.image,
              },
            }}
            actionType="play"
          />
        ))}
      </div>
    </div>
  );
}
