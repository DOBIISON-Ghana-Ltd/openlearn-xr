'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { nuqs } from '@/lib/utils/nuqs';
import { PATHS } from '@/lib/constants/paths';
import { useDebouncedCallback } from '@mantine/hooks';
import { SearchIcon } from 'lucide-react';

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = nuqs.getStates('sim:modules', { history: 'push' });
  const [searchVal, setSearchVal] = useState(state.search || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with state (e.g., when Back/Forward browser buttons are pressed)
  useEffect(() => {
    setSearchVal(state.search || '');
  }, [state.search]);

  const handleSearch = useDebouncedCallback((val: string) => {
    if (pathname === PATHS.MODULES) {
      setState({ search: val ? val : null });
    } else {
      router.push(nuqs.getUrl('sim:modules', { search: val || undefined }, PATHS.MODULES));
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    handleSearch(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative flex items-center h-12 w-84 bg-primary-subtle border-2 border-primary-light rounded-[10px] px-4 transition-colors focus-within:border-primary-cta">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for topics"
        value={searchVal}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent pr-8 text-large text-primary-text-dark placeholder:text-tertiary focus:outline-none"
      />
      <SearchIcon className="absolute right-4 size-6 shrink-0 text-tertiary pointer-events-none" />
    </div>
  );
}



