'use client';

import useApi from '@/data/hooks/use-api';
import { Dialog } from '@base-ui/react/dialog';
import { Info, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type IQuestionPerformanceCard = {
  id?: string;
};

export type IQuestionItem = {
  id: string;
  questionNumber: number;
  question: string;
  correctAnswer: string;
  accuracy: number;
  isDifficultyPoint?: boolean;
  commonErrors?: Array<{
    count: number;
    option: string;
  }>;
};

const DEMO_QUESTIONS: IQuestionItem[] = [
  {
    id: "q-1",
    questionNumber: 1,
    question: "What do you think is at the center of an atom?",
    correctAnswer: "Proton",
    accuracy: 92,
    commonErrors: [
      { count: 4, option: "Electrons" },
      { count: 2, option: "Air" },
    ],
  },
  {
    id: "q-2",
    questionNumber: 2,
    question: "Which particle has a negative electric charge?",
    correctAnswer: "Electron",
    accuracy: 85,
    commonErrors: [
      { count: 5, option: "Neutron" },
      { count: 1, option: "Proton" },
    ],
  },
  {
    id: "q-3",
    questionNumber: 3,
    question: "What holds the protons and neutrons together in the nucleus?",
    correctAnswer: "Strong Nuclear Force",
    accuracy: 48,
    isDifficultyPoint: true,
    commonErrors: [
      { count: 12, option: "Gravity" },
      { count: 6, option: "Electromagnetic Force" },
    ],
  },
  {
    id: "q-4",
    questionNumber: 4,
    question: "What is the overall electrical charge of an atom with equal protons and electrons?",
    correctAnswer: "Neutral (Zero)",
    accuracy: 96,
    commonErrors: [
      { count: 1, option: "Positive" },
    ],
  },
  {
    id: "q-5",
    questionNumber: 5,
    question: "Where are electrons primarily located in an atom?",
    correctAnswer: "Electron Cloud / Orbitals",
    accuracy: 96,
    commonErrors: [
      { count: 1, option: "Inside the Nucleus" },
    ],
  },
];

export default function QuestionPerformanceCard(props: IQuestionPerformanceCard) {
  const { id } = props;
  const { data } = useApi.query("ses:analytics:get:checkpoints", { id: id! }, !id);

  return (
    <div className="col-span-12 lg:col-span-6 bg-primary-subtle backdrop-blur-[6px] border border-surface-white/80 p-6 sm:p-8 rounded-2xl flex flex-col justify-between gap-6 shadow-xs">
      <div>
        <h2 className="text-h6 sm:text-h5 font-bold text-secondary-text">
          Question Performance
        </h2>
        <p className="text-small text-tertiary mt-0.5">
          Identify which assessment items caused difficulty.
        </p>
      </div>

      {/* 2-Column Grid of Questions */}
      <div className="grid grid-cols-2 gap-3">
        {DEMO_QUESTIONS.map((question) => (
          <QuestionCard key={question.id} data={question} />
        ))}
      </div>

      <div className="pt-3 border-t border-primary-cta/10 flex items-center gap-2 text-caption italic text-tertiary">
        <Info className="size-4 shrink-0 text-tertiary" />
        <span>Details reveal correct answers, common errors, and attempts.</span>
      </div>
    </div>
  );
}

type IQuestionCard = {
  data: IQuestionItem;
};

function QuestionCard(props: IQuestionCard) {
  const { data } = props;

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={cn(
          "p-3 sm:p-3.5 rounded-xl flex items-center justify-between gap-2 text-left cursor-pointer transition-colors relative overflow-hidden",
          {
            "bg-warning/20 border border-warning hover:bg-warning/30": data.isDifficultyPoint,
            "bg-primary-light/50 border border-primary-cta/30 hover:bg-primary-light/80": !data.isDifficultyPoint,
          }
        )}
      >
        {data.isDifficultyPoint && (
          <span className="absolute top-0 right-0 bg-accent-flame text-surface-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl tracking-wider">
            CRITICAL
          </span>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-medium text-secondary-text leading-tight">
            Question {data.questionNumber}
          </span>
          <span
            className={cn("text-[9px] sm:text-micro uppercase tracking-wider whitespace-nowrap mt-0.5", {
              "font-bold text-warning": data.isDifficultyPoint,
              "font-normal text-tertiary": !data.isDifficultyPoint,
            })}
          >
            {data.isDifficultyPoint ? "DIFFICULTY POINT" : "CLICK FOR DETAILS"}
          </span>
        </div>
        <span
          className={cn("text-normal shrink-0", {
            "font-bold text-warning": data.isDifficultyPoint,
            "font-medium text-secondary-text": !data.isDifficultyPoint,
          })}
        >
          {data.accuracy}%
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 backdrop-blur-xs transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 z-50" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 flex w-130 max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 bg-surface-white p-6 sm:p-8 rounded-3xl border border-surface-slate shadow-2xl z-50 transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          {/* Header & Close Button */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Dialog.Title className="text-h4 font-bold text-secondary-text">
                Question {data.questionNumber}
              </Dialog.Title>
              <Dialog.Description className="text-small font-medium text-tertiary">
                <span className="text-success font-bold">{data.accuracy}%</span> of students had it right on the first try
              </Dialog.Description>
            </div>
            <Dialog.Close className="p-1 text-secondary-text hover:text-primary-text-dark transition-colors cursor-pointer rounded-md">
              <X className="size-5" />
            </Dialog.Close>
          </div>

          {/* Question & Answer Box */}
          <div className="bg-primary-subtle border border-primary-light/60 rounded-2xl p-4 sm:p-5 flex flex-col gap-1.5">
            <p className="text-normal font-medium text-secondary-text">
              {data.questionNumber}. {data.question}
            </p>
            <p className="text-small text-tertiary font-medium">
              Answer: <span className="text-secondary-text">{data.correctAnswer}</span>
            </p>
          </div>

          {/* Common Errors Box */}
          {data.commonErrors && data.commonErrors.length > 0 && (
            <div className="bg-primary-subtle border border-primary-light/60 rounded-2xl p-4 sm:p-5 flex flex-col gap-2">
              <h4 className="text-normal font-semibold text-secondary-text">
                Common Error made by students
              </h4>
              <div className="flex flex-col gap-1 text-small text-secondary-text">
                {data.commonErrors.map((err, idx) => (
                  <p key={idx}>
                    {err.count} Students chose <span className="font-bold">{err.option}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}