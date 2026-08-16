'use client';

import { IFlowContent } from './flow';
import { match, P } from 'ts-pattern';
import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import Leaderboard from '@/components/(new)/play/leaderboard';

type IDetail = Infer["SimModuleGetOne"]["res"];
type IHostResultFlow = {} & IFlowContent;

export default function HostContent(props: IHostResultFlow) {
  const { data: players, isLoading: ILPlayers } = useApi.query(
    "sim:session:get:players",
    { id: props.id },
    props.mode === "session"
  );

  const { data: detail, isLoading: ILDetails } = useApi.query("sim:module:get:one", {
    params: { id: props.id },
    query: { mode: props.mode },
  });

  const isLoading = ILDetails || ILPlayers;

  return (
    <div className="w-full max-w-7xl mx-auto min-h-full flex items-center justify-between gap-12 lg:gap-16 flex-col lg:flex-row">
      <div className="flex-1 w-full">
        {match({ detail, isLoading })
          .with({ isLoading: true }, () => <HostResult.Loading />)
          .with({ detail: P.nonNullable }, ({ detail }) => (
            <HostResult detail={detail} totalPlayers={players?.length ?? 0} />
          ))
          .otherwise(() => <HostResult.Error />)}
      </div>

      <div className="flex-1 w-full flex justify-center">
        <Leaderboard playId={props.id} />
      </div>
    </div>
  );
}

function HostResult({ detail, totalPlayers }: { detail: IDetail; totalPlayers: number }) {
  return (
    <div className="flex-1 flex flex-col gap-10 py-4 items-center text-center lg:items-start lg:text-left">
      <div className="flex flex-col gap-3">
        <h1 className="text-h2 text-primary-cta leading-tight">
          Session Completed
        </h1>
        <p className="text-normal text-primary-text-dark">
          You have successfully hosted <span className="text-primary-cta font-semibold">{detail.module.title}</span>.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-1 mt-4 items-center lg:items-start">
        <span className="text-button text-primary-text-dark">
          Participants
        </span>
        <span className="text-display text-primary-cta leading-none mt-1">
          {totalPlayers}
        </span>
      </div>
    </div>
  );
}

HostResult.Loading = function Loading() {
  return (
    <div className="w-full h-full flex-center">
      <p className="text-small">Loading...</p>
    </div>
  );
};

HostResult.Error = function Error() {
  return (
    <div className="w-full h-full flex-center">
      <p className="text-small">An error occurred</p>
    </div>
  );
};
