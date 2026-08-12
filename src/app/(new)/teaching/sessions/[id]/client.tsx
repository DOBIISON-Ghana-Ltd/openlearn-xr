'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useClipboard } from '@mantine/hooks';
import Header from '@/components/(new)/common/header';
import useApi from '@/data/hooks/use-api';
import { Infer } from '@/data/types.base';
import { PATHS } from '@/lib/constants/paths';
import { AVATARS } from '@/lib/constants/avatars';
import { match, P } from 'ts-pattern';
import { useRealtime } from '@/adapters/realtime/client';
import { QUERY_KEYS } from '@/data/key-factory';

type ClientPageProps = {
  id: string;
};

export default function ClientPage({ id }: ClientPageProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const socket = useRealtime();
  const { data: session, isLoading } = useApi.query("ses:session:get:one", { code: id });
  const { mutate: startSession, isPending: isStarting } = useApi.mutate("ses:session:post:start");

  useEffect(() => {
    if (session?.status === "STAGING" && id) {
      const subscription = socket.subscribe(id, {
        'player:joined': () => QUERY_KEYS['ses:session:get:one'](id),
      });

      return () => {
        subscription.unbind();
        subscription.unsubscribe();
      };
    }
  }, [session?.status, id, socket]);

  useEffect(() => {
    if (session?.status === "ACTIVE") {
      router.push(PATHS.PLAY("session", id));
    }
  }, [session?.status, id, router]);

  const handleStartSession = () => {
    if (!session) return;
    startSession({ id: session.id }, {
      onSuccess: () => {
        router.push(PATHS.PLAY("session", id));
      },
    });
  };

  return (
    <>
      <Header />
      <div className="relative min-h-[calc(100dvh-var(--spacing)*20)] flex flex-col bg-surface-slate">
        {/* RED ROW 1: TOP HEADER BAR */}
        <div className="bg-surface-slate px-8 py-3.5 flex items-center justify-between shrink-0 h-11">
          <h1 className="text-h6 text-secondary-text">
            Waiting Room
          </h1>
        </div>

        {/* RED ROW 2: MAIN CONTENT AREA WITH TS-PATTERN MATCHING */}
        <div className="flex-1 flex flex-col min-h-0 bg-surface-white">
          {match({ session, isLoading })
            .with({ isLoading: true }, () => <Content.Loading />)
            .with({ session: P.nullish, isLoading: false }, () => <Content.Error message="Session not found" />)
            .with({ session: P.select(P.nonNullable) }, (data) =>
              match(data.status)
                .with("STAGING", () => (
                  <Content
                    id={id}
                    data={data}
                    onStart={handleStartSession}
                    isStarting={isStarting}
                  />
                ))
                .with("ACTIVE", () => <Content.Loading />)
                .with(P.union("COMPLETED", "CANCELLED"), () => <Content.Ended data={data} />)
                .otherwise(() => <Content.Ended data={data} />)
            )
            .exhaustive()
          }
        </div>
      </div>
    </>
  );
}

type ContentProps = {
  id: string;
  data: Infer["SesSessionGetOne"]["res"];
  onStart: () => void;
  isStarting: boolean;
};
function Content({ id, data, onStart, isStarting }: ContentProps) {
  const clipboard = useClipboard({ timeout: 2000 });
  const maxAdmissions = data.config.maxAdmissions;

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-0 bg-surface-white">
      {/* Main Card Container */}
      <div className="w-full max-w-4xl bg-primary-subtle rounded-2xl p-8 lg:p-10 flex flex-col gap-2 shadow-xs my-auto">
        {/* Header Stats Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          {/* Title & Code Badge with Copy button */}
          <div className="flex items-center gap-3">
            <h2 className="text-h5 text-primary-text-dark">
              {data.name}
            </h2>
            <div className="flex items-center gap-1.5 bg-primary-light border border-primary-cta/20 text-secondary-text text-caption px-3 py-1.5 rounded-[8px]">
              <span className="font-mono">{id}</span>
              <button
                type="button"
                onClick={() => clipboard.copy(id)}
                className="p-0.5 hover:text-primary-cta text-secondary-text transition-colors cursor-pointer"
                title="Copy join code"
              >
                {clipboard.copied ? (
                  <CheckIcon className="size-3.5 text-success" />
                ) : (
                  <CopyIcon className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Joined & Max Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-primary-light border border-primary-cta/20 rounded-[5px] px-3 py-1.5 flex flex-col items-center justify-center w-[97px] h-[65px]">
              <span className="text-h6 text-success leading-none mb-1">
                {data.players.length}
              </span>
              <span className="text-small font-semibold text-secondary-text leading-none">
                Joined
              </span>
            </div>
            <div className="bg-primary-light border border-primary-cta/20 rounded-[5px] px-3 py-1.5 flex flex-col items-center justify-center w-[97px] h-[65px]">
              <span className="text-h6 text-secondary-text leading-none mb-1">
                {maxAdmissions}
              </span>
              <span className="text-small font-semibold text-secondary-text leading-none">
                Max
              </span>
            </div>
          </div>
        </div>

        {/* Student List Container */}
        <div className="flex flex-col w-full gap-2">
          {/* Sub-Header Row */}
          <div className="border-b border-primary-cta/20 pb-2 flex-center justify-between px-3">
            <span className="text-small text-tertiary">
              Students ({data.players.length})
            </span>
          </div>

          {/* Student Rows Stack */}
          <div className="flex flex-col gap-2 overflow-y-auto">
            {data.players.length === 0 ? (
              <div className="py-8 text-center text-caption text-tertiary">
                Waiting for students to join...
              </div>
            ) : (
              data.players.map((st) => (
                <PlayerCard key={st.id} data={st} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* RED ROW 3: STICKY BOTTOM CONTROL BAR */}
      <div className="sticky bottom-0 w-full bg-surface-slate py-3 px-8 flex justify-end items-center z-10 shrink-0 h-[64px] rounded-t-xl">
        <button
          type="button"
          onClick={onStart}
          disabled={isStarting}
          className="bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button min-w-[140px] h-[46px] px-8 rounded-[16px] transition-all cursor-pointer active:scale-98 flex items-center justify-center font-semibold disabled:opacity-50"
        >
          {isStarting ? "Starting..." : "Start Session"}
        </button>
      </div>
    </div>
  );
}

Content.Loading = function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 text-tertiary text-normal">
      Loading session details...
    </div>
  );
};

Content.Error = function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center py-20 text-tertiary text-normal">
      {message}
    </div>
  );
};

Content.Ended = function Ended({ data }: { data: Infer["SesSessionGetOne"]["res"] }) {
  const router = useRouter();
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] bg-primary-subtle rounded-[20px] p-8 flex flex-col items-center justify-center gap-6 text-center shadow-xs">
        <div className="flex flex-col gap-2">
          <h3 className="text-h5 text-primary-text-dark font-semibold">
            Session Ended
          </h3>
          <p className="text-normal text-tertiary">
            This session (&quot;{data.name}&quot;) has been {data.status.toLowerCase()} and is no longer active.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(PATHS.TEACHING.ANALYTICS.DETAIL(data.id))}
          className="bg-primary-cta hover:bg-primary-hover text-primary-text-light text-button px-6 py-2.5 rounded-[14px] shadow-xs transition-all cursor-pointer active:scale-98 font-semibold"
        >
          View Session Analytics
        </button>
      </div>
    </div>
  );
};

type PlayerCardProps = {
  data: Infer["SesSessionGetOne"]["res"]["players"][number];
};

function PlayerCard({ data }: PlayerCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-sm hover:bg-primary-light/40 transition-colors">
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-3">
        <img
          src={AVATARS[data.avatar]}
          alt={data.name}
          className="size-8 rounded-full object-cover shrink-0"
        />
        <span className="text-small text-tertiary">
          {data.name}
        </span>
      </div>

      {/* Right: Status Dot + Label */}
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-status-online" />
        <span className="text-micro text-status-online">
          Ready
        </span>
      </div>
    </div>
  );
}
