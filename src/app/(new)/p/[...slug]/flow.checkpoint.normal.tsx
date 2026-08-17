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
import { LightbulbIcon, InfoIcon, ChevronRightIcon, CheckCircle2Icon, XCircleIcon, Loader2Icon } from 'lucide-react';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';
import CheckpointModal, { checkpointModalHandle } from '@/components/(new)/play/modal.checkpoint';

type ICheckpoint = Infer["SimCheckpointGetOne"]["res"];
type INormalCheckpointFlow = {} & IFlowContent;

export default function NormalContent(props: INormalCheckpointFlow) {
  const { serverMode, isLoading: isModeLoading } = usePlayServerMode(props.mode);
  const playerId = useStore(simStore, (s) => s.getSessionPlayer(props.id)) || '';

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
  const feedback = useStore(simStore, (s) => s.checkpoints[playId]?.activeFeedback);
  const setFeedback = useStore(simStore, (s) => s.setCheckpointFeedback);
  const clearFeedback = useStore(simStore, (s) => s.clearCheckpointActiveFeedback);
  const [localChosenAnswer, setLocalChosenAnswer] = useState<number | null>(null);

  const { mutate, isPending } = useApi.mutate("sim:checkpoint:post:answer");

  const totalCount = meta?.totalCheckpoints ?? 1;
  const rawIdx = meta?.currentCheckpointIndex ?? 0;
  const currentIdx = Math.min(rawIdx, Math.max(0, totalCount - 1));
  const isLastQuestion = rawIdx >= totalCount - 1;
  const hasAnswered = feedback?.isCorrect !== undefined;
  const chosenAnswer = feedback?.chosenAnswer ?? localChosenAnswer;

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
        setFeedback(playId, currentIdx, {
          chosenAnswer: value,
          isCorrect: res.isCorrect,
          correctAnswer: res.correctAnswer,
          explanation: res.explanation,
          pointsAwarded: res.pointsAwarded,
        });
        setLocalChosenAnswer(null);
      },
      onError: () => {
        setLocalChosenAnswer(null);
      },
    });
  };

  const handleNext = () => {
    setLocalChosenAnswer(null);
    clearFeedback(playId);
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
          {currentIdx + 1 < totalCount && hasAnswered && (
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

          {/* Button 3 - Explanation Trigger */}
          {/* <Dialog.Trigger
            handle={checkpointModalHandle}
            payload={{ type: 'explanation', text: state.explanation ?? '' }}
            disabled={!state.explanation}
            title={state.explanation ? "View Explanation" : "Answer to view explanation"}
            className="p-2.5 bg-primary-subtle hover:bg-primary-light/60 text-primary-cta rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <InfoIcon className="size-5" />
          </Dialog.Trigger> */}
        </div>
      </div>
      {match(isRefetching)
        .with(true, () => <StateLoading />)
        .otherwise(() => (
          <div className="w-full bg-surface-slate border border-surface-slate rounded-[15.5px] p-6 lg:p-8 flex flex-col gap-4 mt-1 shadow-sm min-h-60 justify-center">
            <h2 className="text-h6 font-normal text-secondary-text mb-2">
              {`${currentIdx + 1}. ${checkpoint.question}`}
            </h2>

            {/* Options Stack */}
            <div className="flex flex-col gap-3.5 w-full">
              {checkpoint.options.map((opt, index) => (
                <ChoiceCard
                  key={`${opt}_${index}`}
                  label={opt}
                  isChosen={chosenAnswer === index}
                  isCorrectOption={feedback?.correctAnswer === index}
                  isAnswerEvaluated={hasAnswered}
                  isPendingChoice={localChosenAnswer === index && isPending}
                  isPending={isPending}
                  isCorrect={feedback?.isCorrect}
                  onClick={() => handleSelect(index)}
                />
              ))}
            </div>
          </div>
        ))
      }

      <CheckpointModal />
    </>
  );
}

type IChoiceCard = {
  label: string;
  isChosen: boolean;
  isCorrectOption: boolean;
  isAnswerEvaluated: boolean;
  isPendingChoice: boolean;
  isPending: boolean;
  isCorrect?: boolean;
  onClick: () => void;
};
function ChoiceCard(props: IChoiceCard) {
  const { label, isChosen, isCorrectOption, isAnswerEvaluated, isPendingChoice, isPending, isCorrect, onClick } = props;

  return (
    <div
      onClick={onClick}
      className={cn(
        'w-full bg-primary-subtle rounded-[5.7px] px-4 py-3 flex items-center justify-between transition-all cursor-pointer border',
        {
          'border-transparent hover:bg-primary-light/40': !isAnswerEvaluated && !isPendingChoice,
          'border-primary-cta ring-2 ring-primary-cta/20 bg-primary-light/60': isPendingChoice,
          'border-success bg-success/15 text-success font-medium': isAnswerEvaluated && isChosen && isCorrect,
          'border-error bg-error/15 text-error font-medium': isAnswerEvaluated && isChosen && !isCorrect,
          'border-transparent opacity-60 cursor-default': isAnswerEvaluated && !isChosen,
          'pointer-events-none': isPending || isAnswerEvaluated,
        }
      )}
    >
      <span className="text-h6 font-normal text-secondary-text">
        {label}
      </span>

      {isPendingChoice && (
        <Loader2Icon className="shrink-0 size-5 animate-spin text-primary-cta" />
      )}
      {isAnswerEvaluated && isChosen && isCorrect && (
        <CheckCircle2Icon className="shrink-0 size-5 text-success" />
      )}
      {isAnswerEvaluated && isChosen && !isCorrect && (
        <XCircleIcon className="shrink-0 size-5 text-error" />
      )}
    </div>
  );
}
