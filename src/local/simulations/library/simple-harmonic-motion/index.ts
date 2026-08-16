import { LocalSimulationConfig } from "../../type";
import Model from "./model.v0";

export type IValueMap = {
  pendulum_length: number;
  release_pendulum: boolean;
  reset_setup: boolean;
};

export const config: LocalSimulationConfig = {
  type: "internal",
  slug: "simple-harmonic-motion",
  name: "Simple Harmonic Motion",
  Model,
  controls: [
    {
      id: "pendulum_length",
      label: "Length (m)",
      description: "Adjust the length of the string from the pivot to the bob.",
      type: "slider",
      value: 0.5,
      defaultValue: 0.5,
      min: 0.1,
      max: 2.0,
      step: 0.05
    },
    {
      id: "release_pendulum",
      label: "Release Bob",
      description: "Toggle to release the pendulum and start the digital stopwatch.",
      type: "toggle",
      value: false,
      defaultValue: false
    },
    {
      id: "reset_setup",
      label: "Reset",
      description: "Stop the pendulum and reset the stopwatch to 0.00s.",
      type: "toggle",
      value: false,
      defaultValue: false
    }
  ]
};

