'use client';

import { useState, useEffect } from 'react';
import { IFlowContent } from './flow';
import { match, P } from 'ts-pattern';
import useApi from '@/data/hooks/use-api';
import { getSimulationConfig } from '@/local/simulations';
import FlowExploreInternal from './flow.explore.internal';
import FlowExploreExternal from './flow.explore.external';
import { Loader2Icon } from 'lucide-react';
import { simStore } from '@/store/sim/store';

type IExploreFlow = {} & IFlowContent;

export default function ExploreFLow(props: IExploreFlow) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    simStore.getState().setDisableNext(false);
    simStore.getState().setDisableBack(false);
  }, []);

  const { data: slugData, isLoading: isSlugQueryLoading } = useApi.query(
    "sim:module:get:slug",
    {
      params: { id: props.id },
      query: { mode: props.mode },
    }
  );

  const isLoading = !mounted || isSlugQueryLoading;
  const config = slugData?.slug ? getSimulationConfig(slugData.slug) : undefined;

  return (
    <div className="relative flex-1 flex flex-col bg-surface-white size-full min-h-0 overflow-hidden">
      {match({ config, isLoading })
        .with({ isLoading: true }, () => <ExploreFLow.Loading />)
        .with({ config: P.select(P.nonNullable) }, (cfg) =>
          match(cfg)
            .with({ type: "internal" }, (c) => <FlowExploreInternal config={c} />)
            .with({ type: "external" }, (c) => <FlowExploreExternal embedLink={c.embedLink} />)
            .exhaustive()
        )
        .with({ config: P.nullish, isLoading: false }, () => <ExploreFLow.Error />)
        .exhaustive()}
    </div>
  );
}

ExploreFLow.Loading = function Loading() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center bg-surface-white size-full min-h-0 overflow-hidden">
      <Loader2Icon className="size-8 animate-spin text-primary-cta" />
    </div>
  );
};

ExploreFLow.Error = function Error() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-6 text-center bg-surface-white size-full min-h-0 overflow-hidden">
      <h3 className="text-h5 text-primary-text-dark font-medium mb-2">Simulation Not Found</h3>
      <p className="text-body text-tertiary max-w-md">
        Unable to load the simulation configuration for this module.
      </p>
    </div>
  );
};
