import { LocalSimulationConfig } from "../../type";
import Model from "./model";

export type IValueMap = {
  reaction_type: "Neutralization (HCl + NaOH)" | "Solution (NH4Cl in Water)" | "Solution (CaCl2 in Water)";
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
      label: "Select Reaction Type",
      description: "Choose the type of enthalpy reaction to investigate in the calorimeter.",
      type: "select",
      options: [
        "Neutralization (HCl + NaOH)",
        "Solution (NH4Cl in Water)",
        "Solution (CaCl2 in Water)"
      ],
      value: "Neutralization (HCl + NaOH)",
      defaultValue: "Neutralization (HCl + NaOH)"
    },
    {
      id: "reactant_amount",
      label: "Reactant Mass / Volume",
      description: "Adjust the mass or volume of the reactants added to the calorimeter.",
      type: "slider",
      value: 50,
      defaultValue: 50,
      min: 10,
      max: 100
    },
    {
      id: "initiate_reaction",
      label: "Initiate Reaction",
      description: "Toggle to mix the reactants and monitor the temperature change.",
      type: "toggle",
      value: false,
      defaultValue: false
    }
  ]
};

