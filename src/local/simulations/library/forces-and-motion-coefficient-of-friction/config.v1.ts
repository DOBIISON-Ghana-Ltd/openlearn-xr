import { LocalSimulationConfig } from "../../type";
import Model, { ForcesFrictionOverlay } from "./model.v1";

export type IValueMap = {
  block_mass: number;
  surface_condition: "Dry Wood" | "Powdered" | "Oiled";
  initiate_pull: boolean;
};

export const config: LocalSimulationConfig = {
  type: "internal",
  slug: "forces-and-motion-coefficient-of-friction",
  name: "Forces and Motion - Coefficient of Friction",
  Model,
  Overlay: ForcesFrictionOverlay,
  controls: [
    {
      id: "block_mass",
      label: "Block Mass (kg)",
      description: "Adjust the mass of the sliding wooden block.",
      type: "slider",
      value: 1,
      defaultValue: 1,
      min: 1,
      max: 10
    },
    {
      id: "surface_condition",
      label: "Surface Material",
      description: "Select the treatment applied to the sliding surface.",
      type: "select",
      options: [
        "Dry Wood",
        "Powdered",
        "Oiled"
      ],
      value: "Dry Wood",
      defaultValue: "Dry Wood"
    },
    {
      id: "initiate_pull",
      label: "Pull Block",
      description: "Start pulling the block to measure the frictional force.",
      type: "toggle",
      value: false,
      defaultValue: false
    }
  ]
};
