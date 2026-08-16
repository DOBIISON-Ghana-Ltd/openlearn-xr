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

type ICheckpoint = Infer["SimCheckpointGetOne"]["res"];
type ICheckpointFlow = {} & IFlowContent;

export default function CheckpointFLow(props: ICheckpointFlow) {
  const isHost = useStore(simStore, (s) => s.getSessionInfo(props.id)?.isHost) ?? false;

  useEffect(() => {
    if (isHost) {
      simStore.getState().setDisableNext(false);
    } else {
      simStore.getState().setDisableNext(true);
    }
    simStore.getState().setDisableBack(false);
  }, [isHost]);

  return (
    <div className="flex-1 bg-surface-white pt-5 pb-8 px-6 lg:pl-86.25 lg:pr-8 overflow-y-auto w-full min-h-0">
      <div className="w-full max-w-3xl flex flex-col items-start gap-4">
        {/* Main Title (Figma Node 1:1728) */}
        <h1 className="text-h2 text-primary-cta leading-tight">
          Assessment
        </h1>

        {/* Subtext (Figma Node 1:1729) */}
        <p className="text-normal text-primary-text-dark leading-normal w-full max-w-2xl">
          {isHost
            ? "Guide students through the checkpoint questions"
            : "Answer the questions to show what you have learnt"}
        </p>

        {match(isHost)
          .with(true, () => <HostContent />)
          .with(false, () => <NormalContent {...props} />)
          .exhaustive()}
      </div>
    </div>
  );
}

function HostContent() {
  return null;
}

function NormalContent(props: ICheckpointFlow) {
  const { serverMode, isLoading: isModeLoading } = usePlayServerMode(props.mode);
  const playerId = useStore(simStore, (s) => s.getSessionPlayer(props.id)) || '';

  const { data, isLoading, isFetching, refetch } = useApi.query("sim:checkpoint:get:one", {
    params: { playId: props.id },
    query: { mode: serverMode, playerId },
  }, !isModeLoading);

  const isCompleted = !!data?.meta?.totalCheckpoints && (data.meta.currentCheckpointIndex ?? 0) >= data.meta.totalCheckpoints;

  useEffect(() => {
    if (isCompleted) {
      simStore.getState().setDisableNext(false);
    }
  }, [isCompleted]);

  return (
    <>
      {match({ data, isCompleted, isLoading: isLoading || isModeLoading })
        .with({ isLoading: true }, () => <NormalContent.Loading />)
        .with({ isCompleted: true }, () => <NormalContent.Completed />)
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
        .with({ data: P.nullish, isLoading: false }, () => <NormalContent.Error />)
        .exhaustive()}
    </>
  );
}

type IModalPayload = {
  type: 'hint' | 'explanation';
  text: string;
};

const checkpointModalHandle = Dialog.createHandle<IModalPayload>();

type IState = {
  choosenAnswer: number;
} & Omit<Infer["SimCheckpointPostAnswer"]["res"], "nextCheckpointId" | "moduleId">;

type IContent = {
  playId: ICheckpointFlow["id"];
  playerId?: string;
  data: ICheckpoint;
  serverMode: IServerMode;
  isRefetching: boolean;
  refetch: () => void;
};
function Content(props: IContent) {
  const { isRefetching, playId, serverMode, playerId, data: { checkpoint, meta }, refetch } = props;
  const [state, setState] = useState<Partial<IState>>({});
  const { mutate, isPending } = useApi.mutate("sim:checkpoint:post:answer");

  const currentIdx = meta?.currentCheckpointIndex ?? 0;
  const totalCount = meta?.totalCheckpoints ?? 1;
  const isLastQuestion = currentIdx + 1 >= totalCount;
  const hasAnswered = state.isCorrect !== undefined;

  useEffect(() => {
    if (isLastQuestion && hasAnswered) {
      simStore.getState().setDisableNext(false);
    } else {
      simStore.getState().setDisableNext(true);
    }
  }, [isLastQuestion, hasAnswered]);

  const handleSelect = (value: number) => {
    if (state.choosenAnswer !== undefined || isPending) return;
    setState({ choosenAnswer: value });

    mutate({
      params: { playId },
      body: {
        mode: serverMode,
        selectedIndex: value,
        sessionPlayerId: playerId,
      },
    }, {
      onSuccess: (res) => {
        setState((prev) => ({
          ...prev,
          isCorrect: res.isCorrect,
          correctAnswer: res.correctAnswer,
          explanation: res.explanation,
          pointsAwarded: res.pointsAwarded,
        }));
      },
      onError: () => setState({}),
    });
  };

  const handleNext = () => {
    setState({});
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
          {currentIdx + 1 < totalCount && state.isCorrect !== undefined && (
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

      <div className="w-full bg-surface-slate border border-surface-slate rounded-[15.5px] p-6 lg:p-8 flex flex-col gap-4 mt-1 shadow-sm">
        <h2 className="text-h6 font-normal text-secondary-text mb-2">
          {`${currentIdx + 1}. ${checkpoint.question}`}
        </h2>

        {/* Options Stack */}
        <div className="flex flex-col gap-3.5 w-full">
          {checkpoint.options.map((opt, index) => (
            <ChoiceCard
              key={`${opt}_${index}`}
              label={opt}
              isChosen={state.choosenAnswer === index}
              isCorrectOption={state.correctAnswer === index}
              isAnswerEvaluated={state.isCorrect !== undefined}
              isPendingChoice={state.choosenAnswer === index && isPending}
              isPending={isPending}
              isCorrect={state.isCorrect}
              onClick={() => handleSelect(index)}
            />
          ))}
        </div>
      </div>

      <CheckpointModal />
    </>
  );
}

NormalContent.Loading = function Loading() {
  return (
    <div className="relative flex-1 flex-center bg-surface-white size-full min-h-0 py-12">
      <Loader2Icon className="size-8 animate-spin text-primary-cta" />
    </div>
  );
};

NormalContent.Completed = function Completed() {
  return (
    <div className="w-full bg-surface-slate border border-surface-slate rounded-[15.5px] p-8 flex flex-col items-center justify-center text-center gap-4 mt-2 shadow-sm">
      <div className="size-16 rounded-full bg-success/15 flex items-center justify-center text-success">
        <CheckCircle2Icon className="size-9" />
      </div>
      <div className="flex flex-col gap-1.5 max-w-md">
        <h2 className="text-h4 font-medium text-primary-text-dark">
          Assessment Completed
        </h2>
        <p className="text-normal text-secondary-text leading-relaxed">
          You have successfully answered all checkpoint questions for this lesson. Click continue below to view your results.
        </p>
      </div>
    </div>
  );
};

NormalContent.Error = function Error() {
  return (
    <div className="w-full h-full flex-center">
      <p className="text-small">An error occurred</p>
    </div>
  );
};

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

function CheckpointModal() {
  return (
    <Dialog.Root handle={checkpointModalHandle}>
      {({ payload }) => {
        const isHint = payload?.type === 'hint';
        const title = isHint ? 'Hint' : 'Explanation';
        const Icon = isHint ? LightbulbIcon : InfoIcon;

        return (
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 backdrop-blur-xs transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 z-50" />
            <Dialog.Popup className="fixed top-1/2 left-1/2 flex w-120 max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 bg-surface-white p-6 rounded-2xl border border-surface-slate shadow-xl z-50 transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary-cta">
                  <Icon className="size-5" />
                  <Dialog.Title className="text-h6 font-semibold">{title}</Dialog.Title>
                </div>
                {payload?.text && (
                  <Dialog.Description className="text-normal text-primary-text-dark leading-relaxed">
                    {payload.text}
                  </Dialog.Description>
                )}
              </div>
              <div className="flex justify-end pt-2">
                <Dialog.Close className="px-4 py-2 bg-primary-cta hover:bg-primary-hover text-surface-white text-small font-medium rounded-lg transition-all cursor-pointer">
                  {isHint ? 'Got it' : 'Close'}
                </Dialog.Close>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        );
      }}
    </Dialog.Root>
  );
}