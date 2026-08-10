'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import useApi from '@/data/hooks/use-api';
import { nuqs } from '@/lib/utils/nuqs';
import { Infer } from '@/data/types.base';
import { PATHS } from '@/lib/constants/paths';
import { match } from 'ts-pattern';

export default function ModulesClient() {
  const [state] = nuqs.getStates("sim:modules");
  const { data, isLoading } = useApi.query("sim:module:get:all", state);

  const uiState: { hasData: boolean, isLoading: boolean } = {
    hasData: data && data.length > 0,
    isLoading
  }

  return (
    <div className="w-full min-h-screen bg-surface-white relative flex">
      <SubjectSelector />
      <section className="flex-1">
        <GradeSelector />
        <div className="py-12 px-6 sm:px-10 lg:px-12">
          {match(uiState)
            .with({ isLoading: true }, () => <Content.Loading />)
            .with({ hasData: false, isLoading: false }, () => <Content.Empty />)
            .with({ hasData: true, isLoading: false }, () => <Content data={data} />)
            .exhaustive()
          }
        </div>
      </section>
    </div>
  );
}

type IGradeOption = {
  label: string,
  value: string
}
function GradeSelector() {
  const [state, setState] = nuqs.getStates("sim:modules", { history: "push" });

  const options: IGradeOption[] = [
    { label: "YEAR 1", value: "year 1" },
    { label: "YEAR 2", value: "year 2" },
    { label: "YEAR 3", value: "year 3" }
  ];

  const handleChange = (value: string) => {
    setState({
      grade: value
    })
  }

  return (
    <div className="w-full bg-surface-slate flex-center justify-start h-16 gap-9 pl-52">
      {options.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => handleChange(tab.value)}
          className={cn(
            'h-full px-4 text-large text-primary-text-dark transition-all border-b-3 flex items-center justify-center cursor-pointer',
            {
              'border-primary-cta font-semibold': state.grade === tab.value,
              'border-transparent text-tertiary hover:text-primary-text-dark': state.grade !== tab.value,
            }
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
};

type ISubjectOption = {
  label: string,
  value: string,
  image: string
}
function SubjectSelector() {
  const [state, setState] = nuqs.getStates("sim:modules", { history: "push" });

  const options: ISubjectOption[] = [
    { label: "Chemistry", value: "chemistry", image: "/(new)/modules/chemistry.png" },
    { label: "Physics", value: "physics", image: "/(new)/modules/physics.png" },
    { label: "Engineering", value: "engineerig", image: "/(new)/modules/engineering.png" }
  ];

  const handleChange = (value: string) => {
    setState({
      subject: value
    })
  }

  return (
    <aside className="w-full md:w-90 shrink-0 bg-surface-slate pt-28 px-8 flex flex-col items-end gap-5">
      {options.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => handleChange(tab.value)}
          className={cn(
            'w-full max-w-58 flex items-center gap-2 h-20 px-6 rounded-[20px] transition-all cursor-pointer text-left',
            {
              'bg-primary-cta text-primary-text-light shadow-md': state.subject === tab.value,
              'bg-primary-subtle text-primary-text-dark hover:bg-primary-light/60': state.subject !== tab.value,
            }
          )}
        >
          <div className="relative size-10 shrink-0 overflow-hidden flex items-center justify-center">
            <img src={tab.image} alt="Chemistry" className="size-full object-contain" />
          </div>
          <span className="text-h6">{tab.label}</span>
        </button>
      ))}
    </aside>
  )
}

type IContent = {
  data: Infer["SimModuleGetAll"]["res"]
}
function Content(props: IContent) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
      {props.data.map((item) => (
        <ModuleCard key={item.id} data={item} />
      ))}
    </div>
  )
}

Content.Loading = function Loading() {
  return (
    <div className="w-full py-10 flex-center">
      Loading Modules
    </div>
  )
}

Content.Empty = function Empty() {
  return (
    <div className="w-full py-10 flex-center">
      No Modules
    </div>
  )
}

type IModuleCard = {
  data: Infer["SimModuleGetAll"]["res"][number]
}
function ModuleCard({ data }: IModuleCard) {
  const { id, module: { title, slug } } = data;

  return (
    <Link
      href={PATHS.PLAY("module", id)}
      className="group relative not-[]:w-full h-65 bg-primary-subtle border-2 border-primary-light rounded-[20px] overflow-hidden transition-all hover:border-primary-cta"
    >
      {/* Background Image / Thumbnail */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/(new)/module-thumbnail.png"
          alt={title}
          fill
          sizes="300px"
          className="object-cover"
        />
      </div>

      {/* Bottom Glass Overlay Info Area */}
      <div className="absolute bottom-0 inset-x-0 h-25 z-10 backdrop-blur-[5px] bg-linear-to-t from-primary-light via-surface-white/80 to-surface-white/40 p-4 flex flex-col justify-between">
        <h4 className="text-normal text-primary-text-dark leading-snug line-clamp-2">
          {title}
        </h4>
      </div>
    </Link>
  )
}