'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { IFlowContent } from './flow';
import { Infer } from '@/data/types.base';
import useApi from '@/data/hooks/use-api';
import { match, P } from 'ts-pattern';

type IModuleDetail = Infer["SimModuleGetOne"]["res"];
type IModuleNotes = NonNullable<IModuleDetail["notes"]>;
type IEngageFlow = {} & IFlowContent;

export default function EngageFLow(props: IEngageFlow) {
  const { data, isLoading } = useApi.query("sim:module:get:one", {
    params: { id: props.id },
    query: { mode: props.mode },
  });

  return (
    <div className="flex-1 bg-primary-subtle pt-5 pb-8 px-8 lg:pl-86 lg:pr-8 overflow-y-auto w-full min-h-0">
      {match({ data, isLoading })
        .with({ isLoading: true }, () => <Content.Loading />)
        .with({ data: P.select(P.nonNullable) }, (data) => <Content data={data} />)
        .with({ data: P.nullish, isLoading: false }, () => <Content.Error />)
        .exhaustive()
      }
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
      {/* Main Title (Figma Node 78:17: 48px bold #459d9f) */}
      <h1 className="text-h2 text-primary-cta leading-tight">
        Let’s get curious!
      </h1>

      {/* Subtext (Figma Node 78:18: 16px text-[#111827] max-w-[656px]) */}
      <p className="text-normal text-primary-text-dark leading-normal w-full max-w-2xl mb-2">
        {data.notes?.engage.curiosityQuestion}
      </p>

      <PreAssessment data={data.notes?.engage.preAssessment || []} />
    </div>
  )
};

Content.Loading = function Loading() {
  return (
    <div className="w-full h-full flex-center">
      <p className="text-small">Loading....</p>
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
  markedCorrect: number | null;
  markedWrong: number | null;
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
        markedCorrect: null,
        markedWrong: null,
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
      markedCorrect: currentQ.answer,
      markedWrong: isCorrect ? null : selectedIndex,
    };

    setQuestions(updatedQuestions);

    // Auto-advance to the next question after a 800ms delay (stops at the last question)
    if (activeIndex < questions.length - 1) {
      setTimeout(() => {
        setActiveIndex((prev) => prev + 1);
      }, 800);
    }
  };

  if (!questions.length || !currentQ) {
    return null;
  }

  return (
    <>
      {/* Section Heading & Step Counter (Figma Nodes 78:30 & 78:31) */}
      <div className="flex flex-col gap-1 w-full">
        <h2 className="text-h6 text-primary-text-dark">
          Questions: What do you already know?
        </h2>
        <span className="text-normal text-tertiary">
          {`${activeIndex + 1} of ${questions.length}`}
        </span>
      </div>

      {/* Quiz Container Card (Figma Node 78:19: w-[748px] min-h-[307px] bg-[#f8fafc] rounded-[15.5px]) */}
      <div className="w-full bg-surface-slate border border-surface-slate rounded-[15.5px] p-6 lg:p-8 flex flex-col gap-4 mt-2">
        {/* Question Text */}
        <h3 className="text-h6 font-normal text-secondary-text mb-2">
          {`${activeIndex + 1}. ${currentQ.question}`}
        </h3>

        {/* Options Stack */}
        <div className="flex flex-col gap-3.5 w-full">
          {currentQ.options.map((opt, index) => {
            const isCorrect = currentQ.markedCorrect === index;
            const isWrong = currentQ.markedWrong === index;
            const isAnswered = currentQ.hasAnswered;

            return (
              <div
                key={opt}
                onClick={() => checkAnswer(index)}
                className={cn(
                  'w-full rounded-[5.7px] px-4 py-3 flex items-center transition-all border',
                  {
                    // Default un-answered option styling
                    'bg-primary-subtle border-transparent hover:bg-primary-light/40 cursor-pointer': !isAnswered,

                    // Correct answer styling (Project --success token)
                    'border-success bg-success/10 ring-2 ring-success/20 font-medium': isAnswered && isCorrect,

                    // Wrong answer styling (Project --error token)
                    'border-error bg-error/10 ring-2 ring-error/20 font-medium': isAnswered && isWrong,

                    // Non-selected option once answered
                    'bg-primary-subtle/50 border-transparent opacity-60 cursor-default': isAnswered && !isCorrect && !isWrong,

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