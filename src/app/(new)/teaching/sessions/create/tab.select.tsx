"use client";

import { cn } from "@/lib/utils/cn";
import { SearchIcon, Loader2Icon } from "lucide-react";
import useApi from "@/data/hooks/use-api";
import { nuqs } from "@/lib/utils/nuqs";
import { Infer } from "@/data/types.base";
import { match, P } from "ts-pattern";
import ModuleCard from "./module-card";

export default function SelectTab() {
  const [state] = nuqs.getStates("ses:create");
  const { data: modules, isLoading } = useApi.query("ses:module:get:all", state);

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-0">
      <SubjectSelector />

      <div className="flex-1 flex flex-col min-w-0">
        <GradeSelector />

        <div className="flex-1 bg-surface-white p-6 lg:p-10 flex flex-col gap-8 overflow-y-auto">
          <SearchInput />

          {match({ modules, isLoading })
            .with({ isLoading: true }, () => <Content.Loading />)
            .with({ modules: P.nullish, isLoading: false }, () => <Content.Empty />)
            .with({ modules: P.select(P.nonNullable) }, (list) => <Content data={list} />)
            .exhaustive()}
        </div>
      </div>
    </div>
  );
}

type ISubjectOption = {
  label: string;
  value: string;
  image: string;
};

function SubjectSelector() {
  const [state, setState] = nuqs.getStates("ses:create", { history: "push" });

  const options: ISubjectOption[] = [
    { label: "Chemistry", value: "chemistry", image: "/(new)/modules/chemistry.png" },
    { label: "Physics", value: "physics", image: "/(new)/modules/physics.png" },
    { label: "Engineering", value: "engineering", image: "/(new)/modules/engineering.png" },
  ];

  const handleChange = (value: string) => {
    setState({ subject: value });
  };

  return (
    <div className="w-full lg:w-[356px] bg-surface-slate pt-[67px] px-6 lg:px-8 pb-8 flex flex-col gap-4 shrink-0">
      {options.map((sub) => {
        const isActive = state.subject === sub.value;
        return (
          <button
            key={sub.value}
            type="button"
            onClick={() => handleChange(sub.value)}
            className={cn(
              "w-full h-[77px] px-8 rounded-[20px] flex items-center gap-3 text-h6 transition-all cursor-pointer text-left",
              {
                "bg-primary-cta text-primary-text-light shadow-sm": isActive,
                "bg-primary-subtle text-primary-text-dark hover:bg-primary-light/60": !isActive,
              }
            )}
          >
            <div className="relative size-8 shrink-0 overflow-hidden flex items-center justify-center">
              <img src={sub.image} alt={sub.label} className="size-full object-contain" />
            </div>
            <span>{sub.label}</span>
          </button>
        );
      })}
    </div>
  );
}

type IGradeOption = {
  label: string;
  value: string;
};

function GradeSelector() {
  const [state, setState] = nuqs.getStates("ses:create", { history: "push" });

  const options: IGradeOption[] = [
    { label: "YEAR 1", value: "year 1" },
    { label: "YEAR 2", value: "year 2" },
    { label: "YEAR 3", value: "year 3" },
  ];

  const handleChange = (value: string) => {
    setState({ grade: value });
  };

  return (
    <div className="bg-surface-slate px-6 lg:px-10 flex items-center gap-8 h-[63px] shrink-0">
      {options.map((y) => (
        <button
          key={y.value}
          type="button"
          onClick={() => handleChange(y.value)}
          className={cn(
            "h-full flex items-center text-large transition-all border-b-3 cursor-pointer",
            {
              "border-primary-cta text-primary-text-dark font-semibold": state.grade === y.value,
              "border-transparent text-tertiary hover:text-primary-text-dark": state.grade !== y.value,
            }
          )}
        >
          {y.label}
        </button>
      ))}
    </div>
  );
}

function SearchInput() {
  const [state, setState] = nuqs.getStates("ses:create", { history: "push" });

  return (
    <div className="relative w-full max-w-[333px]">
      <input
        type="text"
        placeholder="Search for topics"
        value={state.search}
        onChange={(e) => setState({ search: e.target.value })}
        className="w-full h-[50px] bg-primary-subtle border-2 border-primary-light rounded-[10px] pl-4 pr-12 text-normal text-secondary-text placeholder:text-tertiary focus:outline-none focus:border-primary-cta transition-all"
      />
      <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-tertiary" />
    </div>
  );
}

type IContentProps = {
  data: Infer["SesModuleGetAll"]["res"];
};

function Content({ data }: IContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1020px]">
      {data.map((item) => (
        <ModuleCard key={item.id} data={item} />
      ))}
    </div>
  );
}

Content.Loading = function Loading() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center bg-surface-white size-full min-h-[300px] overflow-hidden py-12">
      <Loader2Icon className="size-8 animate-spin text-primary-cta" />
    </div>
  );
};

Content.Empty = function Empty() {
  return (
    <div className="w-full py-12 flex items-center justify-center text-tertiary text-normal">
      No modules found
    </div>
  );
};