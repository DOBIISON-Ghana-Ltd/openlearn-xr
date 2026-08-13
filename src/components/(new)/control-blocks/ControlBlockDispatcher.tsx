"use client";

import { SimulationControl } from "@/local/simulations/type";
import { match } from "ts-pattern";
import StepperControlBlock from "./StepperControlBlock";
import SliderControlBlock from "./SliderControlBlock";
import ToggleControlBlock from "./ToggleControlBlock";
import SelectControlBlock from "./SelectControlBlock";

interface ControlBlockDispatcherProps {
  control: SimulationControl;
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

export default function ControlBlockDispatcher({
  control,
  value,
  onChange,
  className,
}: ControlBlockDispatcherProps) {
  return match(control)
    .with({ type: "number" }, (c) => (
      <StepperControlBlock
        control={c}
        value={(value ?? c.value) as number}
        onChange={onChange}
        className={className}
      />
    ))
    .with({ type: "slider" }, (c) => (
      <SliderControlBlock
        control={c}
        value={(value ?? c.value) as number}
        onChange={onChange}
        className={className}
      />
    ))
    .with({ type: "toggle" }, (c) => (
      <ToggleControlBlock
        control={c}
        value={(value ?? c.value) as boolean}
        onChange={onChange}
        className={className}
      />
    ))
    .with({ type: "select" }, (c) => (
      <SelectControlBlock
        control={c}
        value={(value ?? c.value) as string}
        onChange={onChange}
        className={className}
      />
    ))
    .exhaustive();
}
