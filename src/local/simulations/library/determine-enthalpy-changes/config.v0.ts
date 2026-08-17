import { LocalSimulationConfig } from "../../type";
import Model from "./model.v0";

export type IValueMap = {
  reaction_type:
    | "Neutralization (HCl + NaOH)"
    | "Solution (NH4Cl - Endothermic)"
    | "Solution (CaCl2 - Exothermic)";
  reactant_amount: number;
  initiate_reaction: boolean;
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
        "Solution (CaCl2 - Exothermic)"
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
    }
  ]
};
