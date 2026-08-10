'use client';

import { nuqs } from '@/lib/utils/nuqs';
import { useDebouncedCallback } from '@mantine/hooks';
import { SearchIcon } from 'lucide-react';

export function HeaderSearch() {
  const [state, setState] = nuqs.getStates("sim:modules", { history: "push" });

  const handleSearch = useDebouncedCallback((val: string) => {
    setState({
      search: val ? val : null
    });
  }, 300);

  return (
    <div className='relative flex items-center h-12 w-84 bg-primary-subtle border-2 border-primary-light rounded-[10px] px-4 transition-colors focus-within:border-primary-cta'>
      <input
        type="text"
        placeholder='Search for topics'
        defaultValue={state.search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full bg-transparent pr-8 text-large text-primary-text-dark placeholder:text-tertiary focus:outline-none"
      />
      <SearchIcon className="absolute right-4 size-6 shrink-0 text-tertiary pointer-events-none" />
    </div>
  );
}

