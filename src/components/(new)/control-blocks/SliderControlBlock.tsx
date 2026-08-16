"use client";

import { SliderControl } from "@/local/simulations/type";
import React from "react";
import ControlInfoTooltip from "./ControlTooltip";

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
      : Math.min(100, Math.max(0, ((value - min) / range) * 100));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="flex flex-col gap-2 w-full py-2 px-4 pr-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-left">
          <ControlInfoTooltip description={control.description} />
          <span className="text-normal text-primary-text-dark font-medium">
            {control.label}
          </span>
        </div>
        <span className="text-small text-secondary-text font-medium bg-primary-subtle px-2.5 py-0.5 rounded-md border border-primary-cta/20">
          {value}
        </span>
      </div>

      <div className="relative w-full flex items-center h-5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 outline-none"
        />

        {/* Track background */}
        <div className="w-full h-2 rounded-full bg-surface-white border border-primary-cta/20 relative overflow-hidden">
          {/* Filled track */}
          <div
            className="h-full bg-primary-cta transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Custom thumb */}
        <div
          className="absolute size-4.5 rounded-full bg-primary-cta border-2 border-surface-white shadow-xs pointer-events-none transition-all duration-75 -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
