"use client";

import { cn } from "@/lib/utils/cn";
import { NumberControl } from "@/local/simulations/type";
import { MinusIcon, PlusIcon } from "lucide-react";
import ControlInfoTooltip from "./control-tooltip";

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
    const current = value ?? control.value;
    const next = Math.max(min, Math.round((current - step) * 1000) / 1000);
    onChange(next);
  };

  const handleIncrement = () => {
    const current = value ?? control.value;
    const next = Math.min(max, Math.round((current + step) * 1000) / 1000);
    onChange(next);
  };

  const isMinDisabled = (value ?? control.value) <= min;
  const isMaxDisabled = (value ?? control.value) >= max;

  return (
    <div className="flex items-center justify-between gap-3 w-full py-2 px-4 pr-3">
      {/* Label and Info */}
      <div className="flex items-center gap-1.5 text-left flex-1 min-w-0">
        <ControlInfoTooltip description={control.description} />
        <span className="text-normal text-primary-text-dark font-medium truncate">
          {control.label}
        </span>
      </div>

      {/* Stepper Control Button Group */}
      <div className="flex items-center gap-1 bg-primary-subtle border border-primary-cta/20 rounded-md p-0.5 shrink-0">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isMinDisabled}
          aria-label={`Decrease ${control.label}`}
          className={cn(
            "size-7 rounded flex-center hover:bg-primary-light/60 text-primary-cta transition-colors cursor-pointer",
            { "opacity-40 cursor-not-allowed hover:bg-transparent": isMinDisabled }
          )}
        >
          <MinusIcon className="size-3.5" />
        </button>

        <span className="min-w-10 px-1 text-center text-small font-semibold text-primary-text-dark select-none">
          {value ?? control.value}
          {control.unit ? ` ${control.unit}` : ""}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={isMaxDisabled}
          aria-label={`Increase ${control.label}`}
          className={cn(
            "size-7 rounded flex-center hover:bg-primary-light/60 text-primary-cta transition-colors cursor-pointer",
            { "opacity-40 cursor-not-allowed hover:bg-transparent": isMaxDisabled }
          )}
        >
          <PlusIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
