'use client';

import { cn } from '@/lib/utils/cn';
import type { SimCheckpointDef } from '@/lib/constants/sims';
import { useSimStore, type CheckpointState } from '@/store/play/store';
import { CheckCircle2, ChevronLeftIcon, ChevronRightIcon, Circle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────
// Sub-component: Progress bar strip
// ─────────────────────────────────────────────

interface CheckpointProgressBarsProps {
  checkpoints: SimCheckpointDef[];
  checkpointStates: Record<string, CheckpointState>;
}

function CheckpointProgressBars({
  checkpoints,
  checkpointStates,
}: CheckpointProgressBarsProps) {
  return (
    <div className="flex gap-px h-5">
      {checkpoints.map((cp) => {
        const state = checkpointStates[cp.id];
        const isCompleted = state?.status === 'completed';
        const isCorrect = state?.isCorrect;

        const colorClass = isCompleted
          ? isCorrect
            ? 'bg-green-500'
            : 'bg-red-500'
          : 'bg-muted';

        return (
          <div key={cp.id} className={cn('w-1 h-4 rounded-full transition-colors', colorClass)} />
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-component: Single option button
// ─────────────────────────────────────────────

interface CheckpointOptionProps {
  option: string;
  isCompleted: boolean;
  selectedAnswer: string | null;
  correctAnswer: string;
  onSelect: () => void;
}

function CheckpointOption({
  option,
  isCompleted,
  selectedAnswer,
  correctAnswer,
  onSelect,
}: CheckpointOptionProps) {
  const isSelected = isCompleted && selectedAnswer === option;
  const isCorrectOption = option === correctAnswer;

  // Visual state resolution
  let containerClass: string;
  let iconEl: React.ReactNode;

  if (isSelected && isCorrectOption) {
    // Answered: correct
    containerClass =
      'border-green-500 bg-green-500/10 cursor-default';
    iconEl = <CheckCircle2 className="size-3.5 shrink-0 text-green-500" />;
  } else if (isSelected && !isCorrectOption) {
    // Answered: wrong
    containerClass =
      'border-red-500 bg-red-500/10 cursor-default';
    iconEl = <XCircle className="size-3.5 shrink-0 text-red-500" />;
  } else if (isCompleted) {
    // Completed but not this option — neutral/disabled
    containerClass =
      'border-border bg-muted/30 opacity-60 cursor-default';
    iconEl = <Circle className="size-3.5 shrink-0 text-muted-foreground" />;
  } else {
    // Default: unanswered, interactive
    containerClass =
      'border-border bg-muted/50 hover:bg-muted hover:border-primary/40 transition-colors cursor-pointer';
    iconEl = <Circle className="size-3.5 shrink-0 text-muted-foreground" />;
  }

  return (
    <button
      onClick={isCompleted ? undefined : onSelect}
      disabled={isCompleted}
      className={cn(
        'w-full flex items-center gap-2 text-left text-xs-m px-3 py-2 rounded-none border',
        containerClass
      )}
    >
      {iconEl}
      <span>{option}</span>
    </button>
  );
}

// ─────────────────────────────────────────────
// Main export: CheckpointTracker
// ─────────────────────────────────────────────

interface CheckpointTrackerProps {
  checkpoints: SimCheckpointDef[];
}

const EMPTY_CHECKPOINTS: Record<string, CheckpointState> = {};

export function CheckpointTracker({ checkpoints }: CheckpointTrackerProps) {
  const activeSessionId = useSimStore((s) => s.activeSessionId);
  const activeCheckpointId = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.activeCheckpointId
  );
  const checkpointStates = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.checkpoints ?? EMPTY_CHECKPOINTS
  );
  const setActiveCheckpoint = useSimStore((s) => s.setActiveCheckpoint);
  const submitCheckpoint = useSimStore((s) => s.submitCheckpoint);

  const activeIndex = checkpoints.findIndex((cp) => cp.id === activeCheckpointId);
  const activeCP = checkpoints[activeIndex];

  if (!activeCP || !activeSessionId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-muted-foreground">No checkpoints loaded.</p>
      </div>
    );
  }

  const cpState = checkpointStates[activeCP.id];
  const isCompleted = cpState?.status === 'completed';

  return (
    <div className="h-full flex flex-col">
      {/* Header: label + progress bars + nav */}
      <div className="h-9 w-full flex items-center justify-between px-4">
        <div className="flex-center gap-2">
          <h4 className="text-xs-m text-muted-foreground font-medium uppercase">Checkpoints</h4>
          <CheckpointProgressBars
            checkpoints={checkpoints}
            checkpointStates={checkpointStates}
          />
        </div>
        <div className="flex-center gap-2">
          <Button
            variant="outline"
            size="icon-xs"
            className="rounded-full"
            disabled={activeIndex <= 0}
            onClick={() => setActiveCheckpoint(checkpoints[activeIndex - 1].id)}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-xs"
            className="rounded-full"
            disabled={activeIndex >= checkpoints.length - 1}
            onClick={() => setActiveCheckpoint(checkpoints[activeIndex + 1].id)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {/* Body: question + options */}
      <div className="flex-1 flex flex-col px-4 py-2 space-y-2">
        <div className="flex-1 pt-4">
          <p className="text-xl text-muted-foreground font-light">{activeCP.question}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {activeCP.options.map((opt) => (
            <CheckpointOption
              key={opt}
              option={opt}
              isCompleted={isCompleted}
              selectedAnswer={cpState?.selectedAnswer ?? null}
              correctAnswer={activeCP.correctAnswer}
              onSelect={() => submitCheckpoint(activeCP.id, opt, opt === activeCP.correctAnswer)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
