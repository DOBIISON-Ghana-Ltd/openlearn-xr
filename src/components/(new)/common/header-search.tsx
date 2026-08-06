'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface HeaderSearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export function HeaderSearch({
  placeholder = 'Search for topics',
  onSearch,
  className,
}: HeaderSearchProps) {
  return (
    <div
      className={cn(
        'relative flex items-center h-[50px] w-[333px] bg-[#f2fafa] border-2 border-[#ddf3f3] rounded-[10px] px-4 transition-colors focus-within:border-[#459d9f]',
        className
      )}
    >
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="w-full bg-transparent pr-8 text-[18px] font-normal text-[#111827] placeholder:text-[#6b7280] focus:outline-none"
      />
      <Search className="absolute right-4 size-[24px] shrink-0 text-[#6b7280] pointer-events-none" />
    </div>
  );
}

