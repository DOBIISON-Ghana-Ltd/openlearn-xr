'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { IFlowContent } from './flow';
import useApi from '@/data/hooks/use-api';
import { Dialog } from '@base-ui/react/dialog';
import { Infer } from '@/data/types.base';
import { match, P } from 'ts-pattern';
import { LightbulbIcon, InfoIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircle2Icon } from 'lucide-react';
import StateLoading from '@/components/(new)/common/state.loading';
import StateError from '@/components/(new)/common/state.error';
import CheckpointModal, { checkpointModalHandle } from '@/components/(new)/play/modal.checkpoint';

type ICheckpoints = Infer["SimSessionGetCheckpoints"]["res"];
type IHostCheckpointFlow = {} & IFlowContent;

export default function HostContent(props: IHostCheckpointFlow) {
  const { data, isLoading } = useApi.query("sim:session:get:checkpoints", {
    id: props.id,
  });

  return (
    <>
      {match({ data, isLoading })
        .with({ isLoading: true }, () => <StateLoading />)
        .with({ data: P.select(P.nonNullable) }, (res) => <Content data={res} />)
        .with({ data: P.nullish, isLoading: false }, () => <StateError />)
        .exhaustive()}
    </>
  );
}

function Content({ data }: { data: ICheckpoints }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const totalCount = data.length;
  const checkpoint = data[currentIdx]?.checkpoint;

  if (!checkpoint) {
    return (
      <div className="w-full py-12 text-center text-secondary-text">
        No checkpoints configured for this session.
      </div>
    );
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIdx < totalCount - 1) setCurrentIdx((prev) => prev + 1);
  };

  return (
    <>
      <div className="w-full mt-2 flex items-center justify-between">
        <span className="text-h6 text-primary-text-dark">
          {`${currentIdx + 1} of ${totalCount}`}
        </span>

        <div className="flex-center gap-2">
          {/* Previous Question Button */}
          {currentIdx > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 py-2 bg-primary-subtle hover:bg-primary-light/60 text-primary-cta text-button rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeftIcon className="size-4" />
              <span>Prev</span>
            </button>
          )}

          {/* Next Question Button */}
          {currentIdx + 1 < totalCount && (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-primary-cta hover:bg-primary-hover text-surface-white text-button rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRightIcon className="size-4" />
            </button>
          )}

          {/* Hint Trigger */}
          <Dialog.Trigger
            handle={checkpointModalHandle}
            payload={{ type: 'hint', text: checkpoint.hint }}
            disabled={!checkpoint.hint}
            title={checkpoint.hint ? "View Hint" : "No Hint Available"}
            className="p-2.5 bg-primary-subtle hover:bg-primary-light/60 text-primary-cta rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <LightbulbIcon className="size-5" />
          </Dialog.Trigger>

          {/* Explanation Trigger */}
          <Dialog.Trigger
            handle={checkpointModalHandle}
            payload={{ type: 'explanation', text: checkpoint.explanation }}
            disabled={!checkpoint.explanation}
            title={checkpoint.explanation ? "View Explanation" : "No Explanation Available"}
            className="p-2.5 bg-primary-subtle hover:bg-primary-light/60 text-primary-cta rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <InfoIcon className="size-5" />
          </Dialog.Trigger>
        </div>
      </div>

      <div className="w-full bg-surface-slate border border-surface-slate rounded-[15.5px] p-6 lg:p-8 flex flex-col gap-4 mt-1 shadow-sm min-h-60 justify-center">
        <h2 className="text-h6 font-normal text-secondary-text mb-2">
          {`${currentIdx + 1}. ${checkpoint.question}`}
        </h2>

        {/* Options Stack */}
        <div className="flex flex-col gap-3.5 w-full">
          {checkpoint.options.map((opt, index) => (
            <HostChoiceCard
              key={`${opt}_${index}`}
              label={opt}
              isCorrect={index === checkpoint.correctAnswer}
            />
          ))}
        </div>
      </div>

      <CheckpointModal />
    </>
  );
}

function HostChoiceCard({ label, isCorrect }: { label: string; isCorrect: boolean }) {
  return (
    <div
      className={cn('w-full rounded-[5.7px] px-4 py-3 flex items-center justify-between border transition-all', {
        'border-success bg-success/15': isCorrect,
        'border-transparent bg-primary-subtle opacity-70': !isCorrect,
      })}
    >
      <span
        className={cn('text-h6 font-normal', {
          'text-success font-medium': isCorrect,
          'text-secondary-text': !isCorrect,
        })}
      >
        {label}
      </span>

      {isCorrect && (
        <CheckCircle2Icon className="shrink-0 size-5 text-success" />
      )}
    </div>
  );
}
