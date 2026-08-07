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
        'relative flex items-center h-[50px] w-[333px] bg-primary-subtle border-2 border-primary-light rounded-[10px] px-4 transition-colors focus-within:border-primary-cta',
        className
      )}
    >
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="w-full bg-transparent pr-8 text-large text-primary-text-dark placeholder:text-tertiary focus:outline-none"
      />
      <Search className="absolute right-4 size-[24px] shrink-0 text-tertiary pointer-events-none" />
    </div>
  );
}

