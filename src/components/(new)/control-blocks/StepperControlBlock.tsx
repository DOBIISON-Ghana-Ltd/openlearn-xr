"use client";

import { cn } from "@/lib/utils/cn";
import { NumberControl } from "@/local/simulations/type";
import { MinusIcon, PlusIcon } from "lucide-react";
import ControlInfoTooltip from "./ControlTooltip";

interface IStepperControlBlock {
  control: NumberControl;
  value: number;
  onChange: (value: number) => void;
}

export default function StepperControlBlock(props: IStepperControlBlock) {
  const { control, value, onChange } = props;
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
    <div className="flex flex-col gap-2 w-full py-2 px-4 pr-3">
      <div className="flex items-center gap-1.5 text-left">
        <ControlInfoTooltip description={control.description} />
        <span className="text-normal text-primary-text-dark font-medium">
          {control.label}
        </span>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isMin}
          className={cn(
            "bg-primary-subtle border border-primary-cta/20 rounded-md size-9 flex items-center justify-center transition-colors outline-none",
            {
              "cursor-pointer hover:bg-primary-light/40 active:scale-95 text-primary-cta": !isMin,
              "cursor-not-allowed opacity-40 text-disable": isMin,
            }
          )}
        >
          <MinusIcon className="size-4" />
        </button>

        <span className="text-normal text-primary-text-dark font-semibold min-w-8 text-center">
          {value}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={isMax}
          className={cn(
            "bg-primary-subtle border border-primary-cta/20 rounded-md size-9 flex items-center justify-center transition-colors outline-none",
            {
              "cursor-pointer hover:bg-primary-light/40 active:scale-95 text-primary-cta": !isMax,
              "cursor-not-allowed opacity-40 text-disable": isMax,
            }
          )}
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
