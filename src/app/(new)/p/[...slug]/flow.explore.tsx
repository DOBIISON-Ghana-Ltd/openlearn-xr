'use client';

import { useState, useEffect } from 'react';
import { IFlowContent } from './flow';
import { match, P } from 'ts-pattern';
import useApi from '@/data/hooks/use-api';
import { getSimulationConfig } from '@/local/simulations';
import FlowExploreInternal from './flow.explore.internal';
import FlowExploreExternal from './flow.explore.external';
import { simStore } from '@/store/sim/store';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';

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
        .with({ isLoading: true }, () => <StateLoading />)
        .with({ config: P.select(P.nonNullable) }, (cfg) =>
          match(cfg)
            .with({ type: "internal" }, (c) => <FlowExploreInternal config={c} />)
            .with({ type: "external" }, (c) => <FlowExploreExternal embedLink={c.embedLink} />)
            .exhaustive()
        )
        .with({ config: P.nullish, isLoading: false }, () => (
          <StateError message="Unable to load the simulation." />
        ))
        .exhaustive()}
    </div>
  );
}
