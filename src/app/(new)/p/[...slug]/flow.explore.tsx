'use client';

import { IFlowContent } from './flow';
import { match } from 'ts-pattern';
import FlowExploreInternal from './flow.explore.internal';
import FlowExploreExternal from './flow.explore.external';

type IExploreFlow = {} & IFlowContent;

export default function ExploreFLow(props: IExploreFlow) {
  const contentType: "internal" | "external" = "internal";

  return (
    <div className="relative flex-1 flex flex-col bg-surface-white size-full min-h-0 overflow-hidden">
      {match<"internal" | "external">(contentType)
        .with("internal", () => <FlowExploreInternal />)
        .with("external", () => <FlowExploreExternal />)
        .exhaustive()
      }
    </div>
  );
}
