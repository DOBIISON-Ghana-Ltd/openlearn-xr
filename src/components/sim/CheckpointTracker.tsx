'use client';

import { cn } from '@/lib/utils/cn';
import type { SimCheckpointDef } from '@/lib/constants/sims';
import { useSimStore } from '@/store/play/store';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckpointTrackerProps {
  checkpoints: SimCheckpointDef[];
}

export function CheckpointTracker({ checkpoints }: CheckpointTrackerProps) {
  const activeSessionId = useSimStore((s) => s.activeSessionId);
  const activeCheckpointId = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.activeCheckpointId
  );
  const checkpointStates = useSimStore(
    (s) => s.sessions[s.activeSessionId ?? '']?.checkpoints ?? {}
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
    <div className="flex flex-col h-full">
      {/* Progress rail */}
      <div className="flex items-center gap-1 px-4 pt-2 pb-2 border-b">
        {checkpoints.map((cp, i) => {
          const state = checkpointStates[cp.id];
          const isActive = cp.id === activeCheckpointId;
          return (
            <button
              key={cp.id}
              onClick={() => setActiveCheckpoint(cp.id)}
              title={cp.title}
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full transition-all text-[10px] font-bold border',
                isActive && 'ring-2 ring-primary ring-offset-1',
                state?.status === 'completed' && state.isCorrect
                  ? 'bg-green-500/20 border-green-500 text-green-600'
                  : state?.status === 'completed' && !state.isCorrect
                    ? 'bg-red-500/20 border-red-500 text-red-600'
                    : 'bg-muted border-border text-muted-foreground'
              )}
            >
              {state?.status === 'completed' ? (
                state.isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />
              ) : (
                i + 1
              )}
            </button>
          );
        })}
        <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
          {Object.values(checkpointStates).filter((s) => s.status === 'completed').length}/{checkpoints.length}
        </span>
      </div>

      {/* Active checkpoint card */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            Checkpoint {activeIndex + 1} · {activeCP.points} pts
          </p>
          <p className="text-sm font-semibold leading-snug mt-0.5">{activeCP.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{activeCP.description}</p>
        </div>

        <p className="text-xs font-medium">{activeCP.question}</p>

        {/* Answer options */}
        {!isCompleted ? (
          <div className="space-y-1.5">
            {activeCP.options.map((opt) => (
              <button
                key={opt}
                onClick={() => submitCheckpoint(activeCP.id, opt, opt === activeCP.correctAnswer)}
                className="w-full text-left text-xs px-3 py-2 rounded-md border border-border bg-muted/50 hover:bg-muted hover:border-primary/40 transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div
            className={cn(
              'rounded-md px-3 py-2.5 text-xs font-medium border',
              cpState.isCorrect
                ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
            )}
          >
            {cpState.isCorrect ? '✓ Correct!' : `✗ Incorrect. The answer is: ${activeCP.correctAnswer}`}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2 px-4 py-2 border-t">
        {activeIndex > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => setActiveCheckpoint(checkpoints[activeIndex - 1].id)}
          >
            Previous
          </Button>
        )}
        {activeIndex < checkpoints.length - 1 && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 ml-auto"
            onClick={() => setActiveCheckpoint(checkpoints[activeIndex + 1].id)}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
