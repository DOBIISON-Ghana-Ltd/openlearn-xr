'use client';

import Image from 'next/image';
import { Search, ChevronDown, Clock, BarChart2, Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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

export default function TeachingLibraryClient() {
  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-8 max-w-[1084px]">
      {/* Top Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar Input */}
        <div className="relative w-full md:w-[387px] h-[50px] bg-[#f2fafa] border-2 border-[#ddf3f3] rounded-[10px] flex items-center px-4">
          <input
            type="text"
            placeholder="Search for topics"
            className="w-full bg-transparent text-[16px] text-[#4b5563] placeholder-[#6b7280] outline-none font-normal"
          />
          <Search className="size-5 text-[#6b7280] shrink-0" />
        </div>

        {/* Dropdown Select Filters */}
        <div className="flex items-center gap-6">
          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-light text-[#849396] tracking-wider uppercase">SUBJECT:</span>
            <div className="relative bg-[#4b5563] text-[#e0e3e8] rounded-[8px] px-3 py-2 flex items-center justify-between gap-3 w-[138px] cursor-pointer">
              <span className="text-[14px] font-normal">All Subjects</span>
              <ChevronDown className="size-4 shrink-0 text-[#e0e3e8]" />
            </div>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-light text-[#849396] tracking-wider uppercase">YEAR:</span>
            <div className="relative bg-[#4b5563] text-[#e0e3e8] rounded-[8px] px-3 py-2 flex items-center justify-between gap-3 min-w-[110px] cursor-pointer">
              <span className="text-[14px] font-normal">All Years</span>
              <ChevronDown className="size-4 shrink-0 text-[#e0e3e8]" />
            </div>
          </div>
        </div>
      </div>

      {/* Modules 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LIBRARY_MODULES.map((item) => (
          <div
            key={item.id}
            className="group bg-[#f2fafa] border-2 border-[#ddf3f3] rounded-[20px] overflow-hidden flex flex-col relative transition-all duration-200 hover:shadow-md hover:border-[#459d9f]/40 cursor-pointer"
          >
            {/* Card Thumbnail Top Section */}
            <div className="relative w-full h-[160px] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Card Bottom Content Section with Frosted Glass Overlay */}
            <div className="p-4 bg-white/70 backdrop-blur-[5px] flex flex-col justify-between gap-4 flex-1 border-t border-[#ddf3f3]/80">
              <h3 className="text-[16px] font-normal text-[#111827] leading-snug line-clamp-2">
                {item.title}
              </h3>

              <div className="pt-3 border-t border-[#3b494c]/10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[12px] font-light text-[#849396]">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    <span>{item.duration}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <BarChart2 className="size-3.5" />
                    <span>{item.level}</span>
                  </div>
                </div>

                <div className="size-6 rounded-full border border-[#3b494c]/30 flex items-center justify-center text-[#3b494c] group-hover:border-[#459d9f] group-hover:text-[#459d9f] transition-colors">
                  <Play className="size-3 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
