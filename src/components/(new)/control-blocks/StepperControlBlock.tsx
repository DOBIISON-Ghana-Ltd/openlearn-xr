"use client";

import { cn } from "@/lib/utils/cn";
import { NumberControl } from "@/local/simulations/type";
import { MinusIcon, PlusIcon } from "lucide-react";

interface StepperControlBlockProps {
  control: NumberControl;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function StepperControlBlock({
  control,
  value,
  onChange,
  className,
}: StepperControlBlockProps) {
  const step = control.step ?? 1;
  const min = control.min ?? 0;
  const max = control.max ?? Number.MAX_SAFE_INTEGER;

  const handleDecrement = () => {
    const raw = value - step;
    const rounded = Number(raw.toFixed(4));
    const next = Math.max(min, rounded);
    onChange(next);
  };

  const handleIncrement = () => {
    const raw = value + step;
    const rounded = Number(raw.toFixed(4));
    const next = Math.min(max, rounded);
    onChange(next);
  };

  const isMin = value <= min;
  const isMax = value >= max;

  return (
    <div
      className={cn("flex flex-col items-center gap-1.5 w-full", className)}
    >
      <div className="flex flex-col items-center text-center">
        <span className="text-normal text-primary-text-dark font-medium">
          {control.label}
        </span>
        {control.description && (
          <span className="text-caption text-tertiary">
            {control.description}
          </span>
        )}
      </div>

      <div className="flex-center gap-4 mt-1">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isMin}
          className={cn(
            "bg-primary-subtle border-[1.8px] border-primary-cta rounded-[11.7px] size-8.75 flex-center transition-all cursor-pointer",
            {
              "hover:bg-primary-light/70 active:scale-95": !isMin,
              "opacity-50 cursor-not-allowed": isMin,
            }
          )}
        >
          <MinusIcon className="size-4 text-primary-text-dark" />
        </button>

        <span className="text-h6 text-primary-text-dark min-w-5 text-center font-semibold">
          {value}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={isMax}
          className={cn(
            "bg-primary-subtle border-[1.8px] border-primary-cta rounded-[11.7px] size-8.75 flex-center transition-all cursor-pointer",
            {
              "hover:bg-primary-light/70 active:scale-95": !isMax,
              "opacity-50 cursor-not-allowed": isMax,
            }
          )}
        >
          <PlusIcon className="size-4 text-primary-text-dark" />
        </button>
      </div>
    </div>
  );
}
