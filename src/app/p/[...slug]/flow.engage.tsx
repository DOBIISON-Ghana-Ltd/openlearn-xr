'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { IFlowContent } from './flow';
import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import { IServerMode, usePlayServerMode } from '@/hooks/use-play-mode';
import { match, P } from 'ts-pattern';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import { Loader2Icon } from 'lucide-react';
import StateLoading from '@/components/common/state.loading';
import StateError from '@/components/common/state.error';
import EngageResultModal from '@/components/play/modal.engage';

type IModuleDetail = Infer["SimModuleGetOne"]["res"];
type IModuleNotes = NonNullable<IModuleDetail["notes"]>;
type IEngageFlow = {} & IFlowContent;

export default function EngageFLow(props: IEngageFlow) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    simStore.getState().setDisableNext(false);
    simStore.getState().setDisableBack(false);
  }, []);

  const { serverMode, isLoading: isModeLoading } = usePlayServerMode(props.mode);
  const playerId = useStore(simStore, (s) => s.getSessionInfo(props.id)?.playerId) || '';

  const { data, isLoading } = useApi.query("sim:module:get:one", {
    params: { id: props.id },
    query: { mode: props.mode },
  });

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden w-full min-h-0 flex flex-col"
    >
      <div className="flex-1 bg-surface-white pt-5 pb-8 px-6 md:px-12 xl:pl-86.25 xl:pr-8 overflow-y-auto overscroll-contain w-full min-h-0">
        {match({ data, isLoading: isLoading || isModeLoading })
          .with({ isLoading: true }, () => <StateLoading />)
          .with({ data: P.nullish, isLoading: false }, () => <StateError />)
          .with({ data: P.select(P.nonNullable) }, (data) => (
            <Content
              data={data}
              playId={props.id}
              playerId={playerId}
              serverMode={serverMode}
              containerRef={containerRef}
            />
          ))
          .exhaustive()}
      </div>
    </div>
  );
};

type IContent = {
  data: IModuleDetail;
  playId: string;
  playerId: string;
  serverMode: IServerMode;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

function Content(props: IContent) {
  const { data, playId, playerId, serverMode, containerRef } = props;

  return (
    <div className="w-full max-w-3xl flex flex-col items-start gap-4">
      <h1 className="text-h2 text-primary-cta leading-tight">
        Let’s get curious!
      </h1>

      <p className="text-normal text-primary-text-dark leading-normal w-full max-w-2xl mb-2">
        {data.notes?.engage.curiosityQuestion}
      </p>

      <PreAssessment
        data={data.notes?.engage.preAssessment || []}
        playId={playId}
        playerId={playerId}
        serverMode={serverMode}
        containerRef={containerRef}
      />
    </div>
  );
};

type IPreAssessment = {
  data: IModuleNotes["engage"]["preAssessment"];
  playId: string;
  playerId: string;
  serverMode: IServerMode;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

function PreAssessment(props: IPreAssessment) {
  const { data, playId, playerId, serverMode, containerRef } = props;
  const playState = useStore(simStore, (s) => s.getTestState(serverMode, playId));
  const setAnswer = useStore(simStore, (s) => s.setTestAnswer);

  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const { mutate, isPending } = useApi.mutate("sim:general:post:test-score");

  const questionsCount = data?.length ?? 0;
  const storeActiveIndex = playState?.activeIndex ?? 0;
  const [displayIndex, setDisplayIndex] = useState(() =>
    Math.min(storeActiveIndex, Math.max(0, questionsCount - 1))
  );

  const currentQ = data?.[displayIndex];
  const currentFeedback = playState?.answers?.[displayIndex];

  const checkAnswer = (selectedIndex: number) => {
    if (!currentQ || currentFeedback?.hasAnswered || isPending) return;

    const isCorrect = selectedIndex === currentQ.answer;
    const points = currentQ.points ?? 25;
    const isLastQuestion = displayIndex === questionsCount - 1;
    const nextIndex = Math.min(displayIndex + 1, questionsCount - 1);

    if (isLastQuestion) {
      setPendingIndex(selectedIndex);

      const finalEarned = (playState?.earnedPoints ?? 0) + (isCorrect ? points : 0);
      const finalTotal = (playState?.totalPoints ?? 0) + points;

      mutate({
        params: { mode: serverMode, playId, playerId },
        body: {
          preAssessmentEarnedPoints: finalEarned,
          preAssessmentTotalPoints: finalTotal,
        },
      }, {
        onSuccess: () => {
          setPendingIndex(null);
          setAnswer(
            serverMode,
            playId,
            displayIndex,
            {
              questionIndex: displayIndex,
              selectedIndex,
              hasAnswered: true,
              isCorrect,
            },
            points,
            nextIndex
          );
        },
        onError: () => {
          setPendingIndex(null);
        },
      });
      return;
    }

    // 1. Intermediate question: immediately advance store pointer and record answer in persistent store
    setAnswer(
      serverMode,
      playId,
      displayIndex,
      {
        questionIndex: displayIndex,
        selectedIndex,
        hasAnswered: true,
        isCorrect,
      },
      points,
      nextIndex
    );

    // 2. Animate progress bar locally and advance visual displayIndex after 1600ms
    setTimeout(() => {
      setDisplayIndex(nextIndex);
    }, 1600);
  };

  if (!data || !data.length || !currentQ) {
    return null;
  }

  const isAnswered = Boolean(currentFeedback?.hasAnswered);
  const selectedIdx = currentFeedback?.selectedIndex ?? null;
  const isAnswerCorrect = Boolean(currentFeedback?.isCorrect);

  const isCompleted = Boolean(
    questionsCount > 0 &&
    playState?.answers &&
    playState.answers[questionsCount - 1]?.hasAnswered
  );

  return (
    <>
      {/* Result Dialog Modal */}
      <EngageResultModal
        open={isCompleted}
        score={playState?.earnedPoints ?? 0}
        container={containerRef}
      />

      {/* Section Heading & Step Counter */}
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-h6 text-primary-text-dark">
          Questions: What do you already know?
        </h2>
        <span className="text-normal text-tertiary">
          {`${displayIndex + 1} of ${questionsCount}`}
        </span>
      </div>

      {/* Quiz Container Card */}
      <div className="relative w-full bg-surface-slate rounded-2xl p-8 flex flex-col gap-4">
        {/* Progress Timer Bar */}
        <div className="w-full h-1.5 rounded-full bg-primary-light/50 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-transform ease-linear w-full scale-x-0 duration-0 origin-left bg-primary-cta",
              { "scale-x-100 duration-1600": isAnswered }
            )}
          />
        </div>

        {/* Question Text */}
        <h3 className="text-h6 font-normal text-secondary-text mb-2">
          {`${displayIndex + 1}. ${currentQ.question}`}
        </h3>

        {/* Options Stack */}
        <div className="flex flex-col gap-3.5 w-full">
          {currentQ.options.map((opt, index) => {
            const isSelected = selectedIdx === index;
            const isCorrect = isSelected && isAnswerCorrect;
            const isWrong = isSelected && !isAnswerCorrect;
            const isPendingOption = pendingIndex === index && isPending;

            const letter = String.fromCharCode(65 + index);

            return (
              <div
                key={opt}
                onClick={() => checkAnswer(index)}
                className={cn(
                  'w-full rounded-[5.7px] px-4 py-3 flex items-center justify-between transition-colors duration-200 border',
                  {
                    // Default un-answered option styling
                    'bg-primary-subtle border-transparent hover:bg-primary-light/40 cursor-pointer': !isAnswered && !isPendingOption,

                    // Pending submission indicator styling
                    'border-primary-cta ring-2 ring-primary-cta/20 bg-primary-light/60': isPendingOption,

                    // Correct answer styling (only if user chose correctly)
                    'border-success bg-success/10 ring-2 ring-success/20 font-medium': isAnswered && isCorrect,

                    // Wrong answer styling (only on the option the user chose)
                    'border-error bg-error/10 ring-2 ring-error/20 font-medium': isAnswered && isWrong,

                    // Non-selected options once answered (neutral, does not reveal the correct answer)
                    'bg-primary-subtle/40 border-transparent opacity-50 cursor-default': isAnswered && !isSelected,

                    'pointer-events-none': isAnswered || isPending,
                  }
                )}
              >
                <span
                  className={cn('text-normal font-normal text-secondary-text', {
                    'text-success font-semibold': isAnswered && isCorrect,
                    'text-error font-semibold': isAnswered && isWrong,
                  })}
                >
                  {`${letter}. ${opt}`}
                </span>

                {isPendingOption && (
                  <Loader2Icon className="shrink-0 size-5 animate-spin text-primary-cta" />
                )}
              </div>
            );
          })}
        </div>

        {/* My Score */}
        <div className="w-full bg-surface-white rounded-[5.7px] px-4 py-3 flex items-center">
          <span className="text-normal text-secondary-text">
            {`My score: ${playState?.earnedPoints ?? 0} points`}
          </span>
        </div>
      </div>
    </>
  );
}