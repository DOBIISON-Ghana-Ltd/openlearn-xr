"use client";

import { SimulationControl } from "@/local/simulations/type";
import { match } from "ts-pattern";
import StepperControlBlock from "./StepperControlBlock";
import SliderControlBlock from "./SliderControlBlock";
import ToggleControlBlock from "./ToggleControlBlock";
import SelectControlBlock from "./SelectControlBlock";

interface IControlDispatcher {
  control: SimulationControl;
  value: any;
  onChange: (value: any) => void;
}

export default function ControlDispatcher(props: IControlDispatcher) {
  const { control, value, onChange } = props;

  return match(control)
    .with({ type: "number" }, (c) => (
      <StepperControlBlock
        control={c}
        value={(value ?? c.value) as number}
        onChange={onChange}
      />
    ))
    .with({ type: "slider" }, (c) => (
      <SliderControlBlock
        control={c}
        value={(value ?? c.value) as number}
        onChange={onChange}
      />
    ))
    .with({ type: "toggle" }, (c) => (
      <ToggleControlBlock
        control={c}
        value={(value ?? c.value) as boolean}
        onChange={onChange}
      />
    ))
    .with({ type: "select" }, (c) => (
      <SelectControlBlock
        control={c}
        value={(value ?? c.value) as string}
        onChange={onChange}
      />
    ))
    .exhaustive();
}
