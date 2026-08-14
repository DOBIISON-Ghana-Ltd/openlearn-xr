'use client';

import { cn } from '@/lib/utils/cn';
import { IFlowContent } from './flow';
import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import { match, P } from 'ts-pattern';
import { Loader2Icon } from 'lucide-react';

type IModuleDetail = Infer["SimModuleGetOne"]["res"];
type IModuleNotes = NonNullable<IModuleDetail["notes"]>;
type IExplainFlow = {} & IFlowContent;

export default function ExplainFLow(props: IExplainFlow) {
  const { data, isLoading } = useApi.query("sim:module:get:one", {
    params: { id: props.id },
    query: { mode: props.mode },
  });

  return (
    <div className="flex-1 bg-surface-white py-8 px-6 overflow-y-auto w-full min-h-0">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">

        <div className="flex flex-col gap-2 w-full max-w-5xl">
          <h1 className="text-h2 text-primary-cta leading-tight">
            Let’s understand what you discovered!
          </h1>
        </div>

        {match({ data, isLoading })
          .with({ isLoading: true }, () => <Content.Loading />)
          .with({ data: P.nullish, isLoading: false }, () => <Content.Error />)
          .with({ data: P.select(P.nonNullable) }, (data) => <Content data={data} />)
          .exhaustive()
        }
      </div>
    </div>
  );
};

type IContent = {
  data: IModuleDetail
}
function Content(props: IContent) {
  const { data } = props;

  return (
    <div className="flex flex-row items-start gap-8 w-full">

      <div className="flex-1 w-full flex flex-col gap-5">
        {data.notes?.explanation.items.map((concept) => (
          <ConceptCard key={concept.name} data={concept} />
        ))}
      </div>

      {/* GREEN BOX 2: Right Item - Key Takeaways Sidebar */}
      <div className="w-full xl:w-75 shrink-0">
        <div className="bg-primary-subtle border border-primary-light rounded-[20px] p-5 flex flex-col gap-3.5 w-full min-h-110">
          <h3 className="text-button text-primary-text-dark px-1">Key Takeaways</h3>
          <div className="flex flex-col gap-3.5 w-full">
            {data.notes?.explanation.keyTakeaways.map((takeaway) => (
              <TakeAwayCard key={takeaway.phrase} data={takeaway} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

Content.Loading = function Loading() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center bg-surface-white size-full min-h-0 overflow-hidden">
      <Loader2Icon className="size-8 animate-spin text-primary-cta" />
    </div>
  );
};

Content.Error = function Error() {
  return (
    <div className="w-full h-full flex-center">
      <p className="text-small">An error occurred</p>
    </div>
  );
};

type IConceptCard = {
  data: IModuleNotes["explanation"]["items"][number];
}
function ConceptCard(props: IConceptCard) {
  const { data } = props;

  return (
    <div className="bg-primary-subtle border border-primary-light rounded-[20px] p-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 overflow-hidden min-h-46 relative">
      <div className="flex-1 flex flex-col justify-center gap-3 max-w-xl">
        <h2 className="text-h5 text-primary-text-dark">{data.name}</h2>
        <p className="text-normal text-primary-text-dark leading-normal">{data.description}</p>
      </div>
      <div className="w-44 aspect-square shrink-0 flex-center relative">
        <img
          src={"/(new)/explain-proton.png"}
          alt={data.name}
          className={cn('size-full pointer-events-none object-contain')}
        />
      </div>
    </div>
  )
};

type ITakeAwayCard = {
  data: IModuleNotes["explanation"]["keyTakeaways"][number];
}
function TakeAwayCard(props: ITakeAwayCard) {
  const { data } = props;

  return (
    <div className="bg-surface-slate border border-primary-light rounded-[20px] p-3.5 flex flex-col gap-1 min-h-20">
      <h4 className="text-caption font-semibold text-primary-text-dark leading-snug">{data.phrase}</h4>
      <p className="text-caption text-primary-text-dark leading-snug">{data.description}</p>
    </div>
  )
}