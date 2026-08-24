import { LocalSimulationConfig } from "../../type";
import Model, { CapacitorsOverlay } from "./model.v1";

export type IValueMap = {
  circuit_config: "Series" | "Parallel";
  c1_value: number;
  c2_value: number;
  supply_voltage: number;
  probe_target: "Total Circuit (C_eq)" | "Across Capacitor 1 (C1)" | "Across Capacitor 2 (C2)";
  multimeter_mode:
    | "Effective Capacitance"
    | "Potential Difference (Voltage)"
    | "Stored Charge (Q)"
    | "Stored Energy (U)";
  circuit_switch: boolean;
};

export const config: LocalSimulationConfig = {
  type: "internal",
  slug: "series-and-parallel-connections-of-capacitors",
  name: "Series and Parallel Connections of Capacitors",
  Model,
  Overlay: CapacitorsOverlay,
  controls: [
    {
      id: "circuit_config",
      label: "Circuit Configuration",
      description: "Switch between in-line Series loop and dual-branch Parallel circuit.",
      type: "select",
      options: ["Series", "Parallel"],
      value: "Series",
      defaultValue: "Series",
    },
    {
      id: "c1_value",
      label: "Capacitor 1 - C₁ (μF)",
      description: "Adjust the capacitance rating of the first capacitor (1 to 10 μF).",
      type: "slider",
      value: 2,
      defaultValue: 2,
      min: 1,
      max: 10,
      step: 1,
    },
    {
      id: "c2_value",
      label: "Capacitor 2 - C₂ (μF)",
      description: "Adjust the capacitance rating of the second capacitor (1 to 10 μF).",
      type: "slider",
      value: 3,
      defaultValue: 3,
      min: 1,
      max: 10,
      step: 1,
    },
    {
      id: "supply_voltage",
      label: "DC Supply Voltage (V)",
      description: "Set the DC bench power supply output voltage (1 to 24 V).",
      type: "slider",
      value: 12,
      defaultValue: 12,
      min: 1,
      max: 24,
      step: 1,
    },
    {
      id: "probe_target",
      label: "Multimeter Probe Placement",
      description: "Attach the red & black DMM test probes to measure total circuit or individual capacitors.",
      type: "select",
      options: [
        "Total Circuit (C_eq)",
        "Across Capacitor 1 (C1)",
        "Across Capacitor 2 (C2)",
      ],
      value: "Total Circuit (C_eq)",
      defaultValue: "Total Circuit (C_eq)",
    },
    {
      id: "multimeter_mode",
      label: "Multimeter Function",
      description: "Select which physical quantity the digital meter displays.",
      type: "select",
      options: [
        "Effective Capacitance",
        "Potential Difference (Voltage)",
        "Stored Charge (Q)",
        "Stored Energy (U)",
      ],
      value: "Effective Capacitance",
      defaultValue: "Effective Capacitance",
    },
    {
      id: "circuit_switch",
      label: "DC Power Switch",
      description: "Energize the circuit to charge the capacitive network.",
      type: "toggle",
      value: true,
      defaultValue: true,
    },
  ],
};
