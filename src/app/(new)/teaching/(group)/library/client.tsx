'use client';

import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from '@mantine/hooks';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { Search, ChevronDown, Check } from 'lucide-react';
import { match, P } from 'ts-pattern';
import useApi from '@/data/hooks/use-api';
import { nuqs } from '@/lib/utils/nuqs';
import { Infer } from '@/data/types.base';
import { PATHS } from '@/lib/constants/paths';
import ModuleCard from '@/components/(new)/common/module-card';
import StateLoading from '@/components/(new)/common/state.loading';
import StateEmpty from '@/components/(new)/common/state.empty';

export default function ClientPage() {
  const [state] = nuqs.getStates('teaching:library');
  const { data, isLoading } = useApi.query('sim:module:get:all', state);

  return (
    <div className="py-8 px-6 sm:px-10 lg:px-12 flex flex-col gap-8 max-w-[1084px]">
      {/* Top Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar Input */}
        <SearchInput />

        {/* Dropdown Select Filters */}
        <div className="flex items-center gap-6">
          <SubjectFilter />
          <YearFilter />
        </div>
      </div>

      {/* Modules 3-Column Grid */}
      {match({ data, isLoading })
        .with({ isLoading: true }, () => <StateLoading />)
        .with(
          { data: P.nullish, isLoading: false },
          { data: [] },
          () => <StateEmpty message="No modules found" />
        )
        .with({ data: P.select(P.nonNullable) }, (list) => <Content data={list} />)
        .exhaustive()}
    </div>
  );
}

function SearchInput() {
  const [state, setState] = nuqs.getStates('teaching:library', { history: 'push' });
  const [searchVal, setSearchVal] = useState(state.search || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchVal(state.search || '');
  }, [state.search]);

  const handleSearch = useDebouncedCallback((val: string) => {
    setState({ search: val ? val : null });
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
    <div className="relative w-full md:w-[387px] h-[50px] bg-primary-subtle border-2 border-primary-light rounded-[10px] flex items-center px-4 transition-colors focus-within:border-primary-cta">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for topics"
        value={searchVal}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full bg-transparent pr-8 text-normal text-secondary-text placeholder:text-tertiary focus:outline-none"
      />
      <Search className="absolute right-4 size-5 text-tertiary shrink-0 pointer-events-none" />
    </div>
  );
}

const SUBJECT_OPTIONS = [
  { label: 'All Subjects', value: 'all' },
  { label: 'Chemistry', value: 'chemistry' },
  { label: 'Physics', value: 'physics' },
  { label: 'Engineering', value: 'engineering' },
];

function SubjectFilter() {
  const [state, setState] = nuqs.getStates('teaching:library', { history: 'push' });

  return (
    <div className="flex items-center gap-2">
      <span className="text-caption text-tertiary tracking-wider uppercase">SUBJECT:</span>
      <SelectPrimitive.Root
        value={state.subject || 'all'}
        onValueChange={(val) => {
          if (val) setState({ subject: val });
        }}
      >
        <SelectPrimitive.Trigger className="bg-dark-card text-[#e0e3e8] rounded-[8px] px-3 py-2 flex items-center justify-between gap-3 min-w-[138px] cursor-pointer outline-none hover:bg-dark-elevated-card transition-colors border border-transparent focus-visible:border-primary-cta">
          <SelectPrimitive.Value placeholder="All Subjects" className="text-small text-[#e0e3e8]" />
          <SelectPrimitive.Icon>
            <ChevronDown className="size-4 shrink-0 text-[#e0e3e8]" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner alignItemWithTrigger={false} sideOffset={6} className="z-50 select-none">
            <SelectPrimitive.Popup className="bg-dark-card border border-dark-border/60 text-[#e0e3e8] rounded-lg shadow-xl overflow-hidden min-w-(--anchor-width) p-1 outline-none">
              {SUBJECT_OPTIONS.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="px-3 py-2 text-small text-[#e0e3e8] rounded-md cursor-pointer transition-colors outline-none flex items-center justify-between gap-3 hover:bg-dark-elevated-card data-highlighted:bg-dark-elevated-card"
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-3.5 text-primary-cta" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}

const YEAR_OPTIONS = [
  { label: 'All Years', value: 'all' },
  { label: 'Year 1', value: 'year 1' },
  { label: 'Year 2', value: 'year 2' },
  { label: 'Year 3', value: 'year 3' },
];

function YearFilter() {
  const [state, setState] = nuqs.getStates('teaching:library', { history: 'push' });

  return (
    <div className="flex items-center gap-2">
      <span className="text-caption text-tertiary tracking-wider uppercase">YEAR:</span>
      <SelectPrimitive.Root
        value={state.grade || 'all'}
        onValueChange={(val) => {
          if (val) setState({ grade: val });
        }}
      >
        <SelectPrimitive.Trigger className="bg-dark-card text-[#e0e3e8] rounded-[8px] px-3 py-2 flex items-center justify-between gap-3 min-w-[110px] cursor-pointer outline-none hover:bg-dark-elevated-card transition-colors border border-transparent focus-visible:border-primary-cta">
          <SelectPrimitive.Value placeholder="All Years" className="text-small text-[#e0e3e8]" />
          <SelectPrimitive.Icon>
            <ChevronDown className="size-4 shrink-0 text-[#e0e3e8]" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner alignItemWithTrigger={false} sideOffset={6} className="z-50 select-none">
            <SelectPrimitive.Popup className="bg-dark-card border border-dark-border/60 text-[#e0e3e8] rounded-lg shadow-xl overflow-hidden min-w-(--anchor-width) p-1 outline-none">
              {YEAR_OPTIONS.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="px-3 py-2 text-small text-[#e0e3e8] rounded-md cursor-pointer transition-colors outline-none flex items-center justify-between gap-3 hover:bg-dark-elevated-card data-highlighted:bg-dark-elevated-card"
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-3.5 text-primary-cta" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}

type IContent = {
  data: Infer['SimModuleGetAll']['res'];
};

function Content({ data }: IContent) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <ModuleCard
          key={item.id}
          data={item}
          actionType="play"
          href={PATHS.PLAY('module', item.id)}
        />
      ))}
    </div>
  );
}
