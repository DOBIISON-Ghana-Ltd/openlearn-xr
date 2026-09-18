"use client";

import { SliderControl } from "@/local/simulations/type";
import React from "react";
import ControlInfoTooltip from "./control-tooltip";

interface ISliderControlBlock {
  control: SliderControl;
  value: number;
  onChange: (value: number) => void;
}

export default function SliderControlBlock(props: ISliderControlBlock) {
  const { control, value, onChange } = props;
  const min = control.min ?? 0;
  const max = control.max ?? 100;
  const step = control.step ?? 1;
  const range = max - min;
  const percentage =
    range <= 0
      ? 0
      : Math.min(
        100,
        Math.max(0, (((value ?? control.value) - min) / range) * 100)
      );

  return (
    <div className="flex flex-col gap-2 w-full py-2 px-4 pr-3">
      <div className="flex items-center justify-between text-left">
        <div className="flex items-center gap-1.5 min-w-0">
          <ControlInfoTooltip description={control.description} />
          <span className="text-normal text-primary-text-dark font-medium truncate">
            {control.label}
          </span>
        </div>
        <span className="text-small font-semibold text-primary-cta ml-2 shrink-0">
          {value ?? control.value}
          {control.unit ? ` ${control.unit}` : ""}
        </span>
      </div>

      <div className="relative flex items-center w-full h-4">
        {/* Track */}
        <div className="w-full h-1.5 bg-primary-subtle rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-cta rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Native Range Input over track */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value ?? control.value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 size-3.5 bg-surface-white border-2 border-primary-cta rounded-full pointer-events-none shadow-xs transition-transform duration-75"
          style={{ left: `calc(${percentage}% - 7px)` }}
        />
      </div>
    </div>
  );
}
