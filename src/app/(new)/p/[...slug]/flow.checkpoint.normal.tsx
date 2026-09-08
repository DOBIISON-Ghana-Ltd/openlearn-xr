'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { IFlowContent } from './flow';
import useApi from '@/data/hooks/use-api';
import { Dialog } from '@base-ui/react/dialog';
import { IServerMode, usePlayServerMode } from '@/hooks/use-play-mode';
import { Infer } from '@/data/types.base';
import { match, P } from 'ts-pattern';
import { simStore } from '@/store/sim/store';
import { useStore } from 'zustand';
import { LightbulbIcon, ChevronRightIcon, CheckCircle2Icon, XCircleIcon, Loader2Icon } from 'lucide-react';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';
import CheckpointModal, { checkpointModalHandle } from '@/components/(new)/play/modal.checkpoint';

type ICheckpoint = Infer["SimCheckpointGetOne"]["res"];
type INormalCheckpointFlow = {} & IFlowContent;

export default function NormalContent(props: INormalCheckpointFlow) {
  const { serverMode, isLoading: isModeLoading } = usePlayServerMode(props.mode);
  const playerId = useStore(simStore, (s) => s.getSessionInfo(props.id)?.playerId) || '';

  const { data, isLoading, isFetching, refetch } = useApi.query("sim:checkpoint:get:one", {
    params: { playId: props.id },
    query: { mode: serverMode, playerId },
  }, !isModeLoading);

  return (
    <>
      {match({ data, isLoading: isLoading || isModeLoading })
        .with({ isLoading: true }, () => <StateLoading />)
        .with({ data: P.select(P.nonNullable) }, (checkpointData) => (
          <Content
            data={checkpointData}
            playId={props.id}
            playerId={playerId}
            serverMode={serverMode}
            isRefetching={isFetching}
            refetch={refetch}
          />
        ))
        .with({ data: P.nullish, isLoading: false }, () => <StateError />)
        .exhaustive()}
    </>
  );
}

type IContent = {
  playId: INormalCheckpointFlow["id"];
  playerId?: string;
  data: ICheckpoint;
  serverMode: IServerMode;
  isRefetching: boolean;
  refetch: () => void;
};
function Content(props: IContent) {
  const { isRefetching, playId, serverMode, playerId, data: { checkpoint, meta }, refetch } = props;
  const currentIdx = meta?.currentCheckpointIndex ?? 0;
  const totalCount = meta?.totalCheckpoints ?? 1;

  const feedback = useStore(simStore, (s) => s.getCheckpointFeedback(serverMode, playId, currentIdx));
  const setFeedback = useStore(simStore, (s) => s.setCheckpointFeedback);
  const [localChosenAnswer, setLocalChosenAnswer] = useState<number | null>(null);
  const [awardedPoints, setAwardedPoints] = useState<number>(0);

  const { mutate, isPending } = useApi.mutate("sim:checkpoint:post:answer");

  const isLastQuestion = currentIdx + 1 >= totalCount;
  const hasAnswered = Boolean(feedback);
  const chosenAnswer = feedback?.chosenAnswer ?? localChosenAnswer;
  const displayScore = (meta?.accumulatedPoints ?? 0) + awardedPoints;

  useEffect(() => {
    simStore.getState().setDisableNext(!isLastQuestion || !hasAnswered);
  }, [isLastQuestion, hasAnswered]);

  const handleSelect = (value: number) => {
    if (chosenAnswer !== null || isPending) return;
    setLocalChosenAnswer(value);

    mutate({
      params: { playId },
      body: {
        mode: serverMode,
        selectedIndex: value,
        sessionPlayerId: playerId,
      },
    }, {
      onSuccess: (res) => {
        setFeedback(serverMode, playId, currentIdx, {
          questionIndex: currentIdx,
          chosenAnswer: value,
          isCorrect: res.isCorrect,
          correctAnswer: res.correctAnswer,
          explanation: res.explanation,
          pointsAwarded: res.pointsAwarded,
        });
        setAwardedPoints(res.pointsAwarded);
        setLocalChosenAnswer(null);
      },
      onError: () => {
        setLocalChosenAnswer(null);
      },
    });
  };

  const handleNext = () => {
    setLocalChosenAnswer(null);
    setAwardedPoints(0);
    refetch();
  };

  return (
    <>
      <div className="w-full mt-2 flex items-center justify-between">
        <span className="text-h6 text-primary-text-dark">
          {`${currentIdx + 1} of ${totalCount}`}
        </span>

        <div className="flex-center gap-2">
          {/* Button 1 - Next (Hidden on final checkpoint) */}
          {!isLastQuestion && hasAnswered && (
            <button
              type="button"
              onClick={handleNext}
              disabled={isPending || isRefetching}
              className="px-4 py-2 bg-primary-cta hover:bg-primary-hover text-surface-white text-button rounded-lg transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRightIcon className="size-4" />
            </button>
          )}

          {/* Button 2 - Hint Trigger */}
          <Dialog.Trigger
            handle={checkpointModalHandle}
            payload={{ type: 'hint', text: checkpoint.hint }}
            disabled={!checkpoint.hint}
            title={checkpoint.hint ? "View Hint" : "No Hint Available"}
            className="p-2.5 bg-primary-subtle hover:bg-primary-light/60 text-primary-cta rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <LightbulbIcon className="size-5" />
          </Dialog.Trigger>
        </div>
      </div>

      {match(isRefetching)
        .with(true, () => <StateLoading />)
        .otherwise(() => (
          <div className="w-full bg-surface-slate border border-surface-slate rounded-[15.5px] p-6 lg:p-8 flex flex-col gap-4 min-h-60 justify-center">
            <h2 className="text-h6 font-normal text-secondary-text mb-2">
              {`${currentIdx + 1}. ${checkpoint.question}`}
            </h2>

            {/* Options Stack */}
            <div className="flex flex-col gap-3.5 w-full">
              {checkpoint.options.map((opt, index) => (
                <ChoiceCard
                  key={`${opt}_${index}`}
                  index={index}
                  label={opt}
                  isChosen={chosenAnswer === index}
                  isAnswered={hasAnswered}
                  isPending={localChosenAnswer === index && isPending}
                  isCorrect={feedback?.isCorrect}
                  onClick={() => handleSelect(index)}
                />
              ))}
            </div>

            {/* My Score */}
            <div className="w-full bg-surface-white rounded-[5.7px] px-4 py-3 flex items-center">
              <span className="text-normal text-secondary-text">
                {`My score: ${displayScore} points`}
              </span>
            </div>
          </div>
        ))
      }

      <CheckpointModal />
    </>
  );
}

type IChoiceCard = {
  index: number;
  label: string;
  isChosen: boolean;
  isAnswered: boolean;
  isPending: boolean;
  isCorrect?: boolean;
  onClick: () => void;
};
function ChoiceCard(props: IChoiceCard) {
  const { index, label, isChosen, isAnswered, isPending, isCorrect, onClick } = props;
  const letter = String.fromCharCode(65 + index);

  return (
    <div
      onClick={onClick}
      className={cn(
        'w-full bg-primary-subtle rounded-[5.7px] px-4 py-3 flex items-center justify-between transition-colors duration-200 border',
        {
          'border-transparent hover:bg-primary-light/40 cursor-pointer': !isAnswered && !isPending,
          'border-primary-cta ring-2 ring-primary-cta/20 bg-primary-light/60': isPending,
          'border-success bg-success/10 ring-2 ring-success/20 font-medium': isAnswered && isChosen && isCorrect,
          'border-error bg-error/10 ring-2 ring-error/20 font-medium': isAnswered && isChosen && !isCorrect,
          'border-transparent opacity-50 cursor-default': isAnswered && !isChosen,
          'pointer-events-none': isPending || isAnswered,
        }
      )}
    >
      <span
        className={cn('text-normal font-normal text-secondary-text', {
          'text-success font-semibold': isAnswered && isChosen && isCorrect,
          'text-error font-semibold': isAnswered && isChosen && !isCorrect,
        })}
      >
        {`${letter}. ${label}`}
      </span>

      {isPending && (
        <Loader2Icon className="shrink-0 size-5 animate-spin text-primary-cta" />
      )}
      {isAnswered && isChosen && isCorrect && (
        <CheckCircle2Icon className="shrink-0 size-5 text-success" />
      )}
      {isAnswered && isChosen && !isCorrect && (
        <XCircleIcon className="shrink-0 size-5 text-error" />
      )}
    </div>
  );
}
