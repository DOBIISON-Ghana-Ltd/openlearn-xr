'use client';

import { useEffect } from 'react';
import useApi from '@/data/hooks/use-api';
import { Clock } from 'lucide-react';
import { IFlowContent } from './flow';
import { Infer } from '@/data/types.base';
import { match, P } from 'ts-pattern';
import { simStore } from '@/store/sim/store';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';

type IModuleDetail = Infer["SimModuleGetOne"]["res"];
type IModuleNotes = NonNullable<IModuleDetail["notes"]>;
type IOverviewFlow = {} & IFlowContent;

export default function OverviewFLow(props: IOverviewFlow) {
  useEffect(() => {
    simStore.getState().setDisableNext(false);
    simStore.getState().setDisableBack(false);
  }, []);

  const { data, isLoading } = useApi.query("sim:module:get:one", {
    params: { id: props.id },
    query: { mode: props.mode },
  });

  return (
    <div className="flex-1 bg-primary-subtle overflow-y-auto overscroll-contain w-full min-h-0">
      {match({ data, isLoading })
        .with({ isLoading: true }, () => <StateLoading />)
        .with({ data: P.select(P.nonNullable) }, (data) => <Content data={data} progress={props.progress ?? 0} />)
        .with({ data: P.nullish, isLoading: false }, () => <StateError />)
        .exhaustive()
      }
    </div>
  );
}

type IContent = {
  data: IModuleDetail;
  progress: number;
};

function Content(props: IContent) {
  const { data, progress } = props;

  return (
    <div className="w-full min-h-full pt-5 pb-12 px-6 md:px-12 xl:pl-60 xl:pr-8 flex flex-col">
      <div className="w-full max-w-5xl flex flex-col items-start gap-5">
        {/* Subject & Year Badge (Figma Node 10:28: w-[260px] h-[50px] left-[238px] top-[85px]) */}
        <div className="bg-primary-subtle/80 border border-primary-light rounded-[15px] h-12.5 px-5 flex-center justify-between gap-4">
          <span className="text-h6 text-primary-cta">
            {data.module.collection.name}
          </span>
          <span className="size-2.5 rounded-full bg-primary-cta" />
          <span className="text-h6 text-tertiary">
            {data.module.collection.grade}
          </span>
        </div>

        {/* Module Title (Figma Node 10:46: 48px bold #459d9f) */}
        <h1 className="text-h2 text-primary-cta leading-tight">
          {data.module.title}
        </h1>

        {/* Module Description (Figma Node 10:47: 16px text-[#111827]) */}
        <p className="text-normal text-primary-text-dark leading-normal w-full max-w-3xl">
          {data.module.description}
        </p>

        {/* Metadata Pills Row (Figma Nodes 10:32, 10:39, 10:43: h-[35px]) */}
        <div className="flex items-center gap-3">
          {/* Duration Pill */}
          <div className="bg-primary-subtle/70 border border-primary-light rounded-[10px] h-8.75 px-3 flex items-center justify-center gap-2">
            <Clock className="size-5 text-secondary-text" />
            <span className="text-normal text-secondary-text">
              {data.module.duration}
            </span>
          </div>

          {/* Difficulty Pill */}
          <div className="bg-primary-subtle/70 border border-primary-light rounded-[10px] h-8.75 px-3 flex items-center justify-center gap-2">
            <span className="size-2.5 rounded-full bg-warning" />
            <span className="text-normal text-secondary-text capitalize">
              {match(data.module.difficulty)
                .with("EAZY", () => "Easy")
                .with("MEDIUM", () => "Medium")
                .with("HARD", () => "Hard")
                .exhaustive()
              }
            </span>
          </div>

          {/* Progress Pill */}
          <div className="bg-primary-subtle/70 border border-primary-light rounded-[10px] h-8.75 px-3 flex items-center justify-center">
            <span className="text-normal text-secondary-text">
              {progress}% Progress
            </span>
          </div>
        </div>

        {/* Learning Objectives Box (Figma Node 10:48: w-[657px] min-h-[225px]) */}
        <div className="w-full max-w-3xl bg-surface-slate/80 border border-disable/30 rounded-[10px] p-8 flex flex-col gap-4 mt-2">
          <h2 className="text-large text-primary-text-dark">
            Learning objectives
          </h2>
          <p className="text-normal text-secondary-text">
            By the end of these activities, you should be able to:
          </p>

          <Objectives data={props.data.notes?.overview.objectives || []} />
        </div>
      </div>
    </div>
  );
}

type IObjectives = {
  data: IModuleNotes["overview"]["objectives"];
}
function Objectives(props: IObjectives) {
  return (
    <ul className="list-disc pl-6 flex flex-col gap-2.5 text-normal text-secondary-text">
      {props.data.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}