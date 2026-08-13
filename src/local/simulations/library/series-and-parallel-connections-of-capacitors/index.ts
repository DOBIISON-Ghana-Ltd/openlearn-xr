import { LocalSimulationConfig } from "../../type";
import Model from "./model.v0";

export type IValueMap = {
  circuit_config: "Series" | "Parallel";
  c1_value: number;
  c2_value: number;
  multimeter_mode: "Effective Capacitance" | "Potential Difference" | "Total Charge";
};

export const config: LocalSimulationConfig = {
  type: "internal",
  slug: "series-and-parallel-connections-of-capacitors",
  name: "Series and Parallel Connections of Capacitors",
  Model,
  controls: [
    {
      id: "circuit_config",
      label: "Circuit Configuration",
      description: "Select how the two capacitors are wired together.",
      type: "select",
      options: [
        "Series",
        "Parallel"
      ],
      value: "Series",
      defaultValue: "Series"
    },
    {
      id: "c1_value",
      label: "Capacitor 1 Value (μF)",
      description: "Adjust the capacitance rating of the first capacitor.",
      type: "slider",
      value: 2,
      defaultValue: 2,
      min: 1,
      max: 10
    },
    {
      id: "c2_value",
      label: "Capacitor 2 Value (μF)",
      description: "Adjust the capacitance rating of the second capacitor.",
      type: "slider",
      value: 3,
      defaultValue: 3,
      min: 1,
      max: 10
    },
    {
      id: "multimeter_mode",
      label: "Multimeter Readout Mode",
      description: "Choose which circuit property the digital meter should display.",
      type: "select",
      options: [
        "Effective Capacitance",
        "Potential Difference",
        "Total Charge"
      ],
      value: "Effective Capacitance",
      defaultValue: "Effective Capacitance"
    }
  ]
};

