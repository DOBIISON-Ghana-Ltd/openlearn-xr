import { LocalSimulationConfig } from "../../type";
import Model from "./model.v1";

export type IValueMap = {
  reaction_type:
    | "Neutralization (HCl + NaOH)"
    | "Solution (NH4Cl - Endothermic)"
    | "Solution (CaCl2 - Exothermic)"
    | "Displacement (Zn + CuSO4)"
    | "Combustion (Ethanol Spirit Lamp)";
  reactant_amount: number;
  initiate_reaction: boolean;
  stir_speed?: number;
  show_heat_flow?: boolean;
};

export const config: LocalSimulationConfig = {
  type: "internal",
  slug: "determine-enthalpy-changes",
  name: "Determine Enthalpy Changes",
  Model,
  controls: [
    {
      id: "reaction_type",
      label: "Reaction Type",
      description: "Choose the calorimetry experiment from the NaCCA SHS Chemistry curriculum.",
      type: "select",
      options: [
        "Neutralization (HCl + NaOH)",
        "Solution (NH4Cl - Endothermic)",
        "Solution (CaCl2 - Exothermic)",
        "Displacement (Zn + CuSO4)",
        "Combustion (Ethanol Spirit Lamp)"
      ],
      value: "Neutralization (HCl + NaOH)",
      defaultValue: "Neutralization (HCl + NaOH)"
    },
    {
      id: "reactant_amount",
      label: "Reactant Amount (g/mL)",
      description: "Adjust the mass or volume of reactants added to the calorimeter.",
      type: "slider",
      value: 50,
      defaultValue: 50,
      min: 10,
      max: 100
    },
    {
      id: "initiate_reaction",
      label: "Start Reaction",
      description: "Mix reactants / ignite spirit burner to observe dynamic enthalpy kinetics.",
      type: "toggle",
      value: false,
      defaultValue: false
    },
    {
      id: "show_heat_flow",
      label: "Show Heat Flow",
      description: "Toggle thermal heat transfer vectors and system boundaries.",
      type: "toggle",
      value: false,
      defaultValue: false
    }
  ]
};
