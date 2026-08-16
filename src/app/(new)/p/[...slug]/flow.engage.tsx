'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { IFlowContent } from './flow';
import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import { match, P } from 'ts-pattern';
import { Loader2Icon } from 'lucide-react';
import { simStore } from '@/store/sim/store';

type IModuleDetail = Infer["SimModuleGetOne"]["res"];
type IModuleNotes = NonNullable<IModuleDetail["notes"]>;
type IEngageFlow = {} & IFlowContent;

export default function EngageFLow(props: IEngageFlow) {
  useEffect(() => {
    simStore.getState().setDisableNext(false);
    simStore.getState().setDisableBack(false);
  }, []);

  const { data, isLoading } = useApi.query("sim:module:get:one", {
    params: { id: props.id },
    query: { mode: props.mode },
  });

  return (
    <div className="flex-1 bg-surface-white pt-5 pb-8 px-6 lg:pl-86.25 lg:pr-8 overflow-y-auto w-full min-h-0">
      {match({ data, isLoading })
        .with({ isLoading: true }, () => <Content.Loading />)
        .with({ data: P.nullish, isLoading: false }, () => <Content.Error />)
        .with({ data: P.select(P.nonNullable) }, (data) => <Content data={data} />)
        .exhaustive()}
    </div>
  );
};

type IContent = {
  data: IModuleDetail;
};

function Content(props: IContent) {
  const { data } = props;

  return (
    <div className="w-full max-w-3xl flex flex-col items-start gap-4">
      <h1 className="text-h2 text-primary-cta leading-tight">
        Let’s get curious!
      </h1>

      <p className="text-normal text-primary-text-dark leading-normal w-full max-w-2xl mb-2">
        {data.notes?.engage.curiosityQuestion}
      </p>

      <PreAssessment data={data.notes?.engage.preAssessment || []} />
    </div>
  )
};

Content.Loading = function Loading() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center bg-surface-white size-full min-h-0 overflow-hidden">
      <Loader2Icon className="size-8 animate-spin text-primary-cta" />
    </div>
  );
};

Content.Error = function Error() {
  return (
    <div className="w-full h-full flex-center">
      <p className="text-small">An error occurred</p>
    </div>
  );
};

type IPreAssessment = {
  data: IModuleNotes["engage"]["preAssessment"];
};

type IInternalQuestion = {
  hasAnswered: boolean;
  selectedIndex: number | null;
  isCorrect: boolean;
} & IPreAssessment["data"][number];

function PreAssessment(props: IPreAssessment) {
  const { data } = props;
  const [questions, setQuestions] = useState<IInternalQuestion[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (!data) return;
    setQuestions(
      data.map((item) => ({
        ...item,
        hasAnswered: false,
        selectedIndex: null,
        isCorrect: false,
      }))
    );
    setActiveIndex(0);
  }, [data]);

  const currentQ = questions[activeIndex];

  const checkAnswer = (selectedIndex: number) => {
    if (!currentQ || currentQ.hasAnswered) return;

    const isCorrect = selectedIndex === currentQ.answer;

    const updatedQuestions = [...questions];
    updatedQuestions[activeIndex] = {
      ...currentQ,
      hasAnswered: true,
      selectedIndex,
      isCorrect,
    };

    setQuestions(updatedQuestions);

    // Auto-advance to the next question after a 1600ms timer
    if (activeIndex < questions.length - 1) {
      setTimeout(() => {
        setActiveIndex((prev) => prev + 1);
      }, 1600);
    }
  };

  if (!questions.length || !currentQ) {
    return null;
  }

  return (
    <>
      {/* Section Heading & Step Counter */}
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-h6 text-primary-text-dark">
          Questions: What do you already know?
        </h2>
        <span className="text-normal text-tertiary">
          {`${activeIndex + 1} of ${questions.length}`}
        </span>
      </div>

      {/* Quiz Container Card */}
      <div className="relative w-full bg-surface-slate rounded-2xl p-6 flex flex-col gap-4">
        {/* Progress Timer Bar */}
        <div className="w-full h-1.5 rounded-full bg-primary-light/50 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-transform ease-linear w-full scale-x-0 duration-0 origin-left bg-primary-cta",
              { "scale-x-100 duration-1600": currentQ.hasAnswered }
            )}
          />
        </div>

        {/* Question Text */}
        <h3 className="text-h6 font-normal text-secondary-text mb-2">
          {`${activeIndex + 1}. ${currentQ.question}`}
        </h3>

        {/* Options Stack */}
        <div className="flex flex-col gap-3.5 w-full">
          {currentQ.options.map((opt, index) => {
            const isSelected = currentQ.selectedIndex === index;
            const isAnswered = currentQ.hasAnswered;
            const isCorrect = isSelected && currentQ.isCorrect;
            const isWrong = isSelected && !currentQ.isCorrect;

            return (
              <div
                key={opt}
                onClick={() => checkAnswer(index)}
                className={cn(
                  'w-full rounded-[5.7px] px-4 py-3 flex items-center transition-all border',
                  {
                    // Default un-answered option styling
                    'bg-primary-subtle border-transparent hover:bg-primary-light/40 cursor-pointer': !isAnswered,

                    // Correct answer styling (only if user chose correctly)
                    'border-success bg-success/10 ring-2 ring-success/20 font-medium': isAnswered && isCorrect,

                    // Wrong answer styling (only on the option the user chose)
                    'border-error bg-error/10 ring-2 ring-error/20 font-medium': isAnswered && isWrong,

                    // Non-selected options once answered (neutral, does not reveal the correct answer)
                    'bg-primary-subtle/40 border-transparent opacity-50 cursor-default': isAnswered && !isSelected,

                    'pointer-events-none': isAnswered,
                  }
                )}
              >
                <span
                  className={cn('text-h6 font-normal text-secondary-text', {
                    'text-success font-semibold': isAnswered && isCorrect,
                    'text-error font-semibold': isAnswered && isWrong,
                  })}
                >
                  {opt}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}