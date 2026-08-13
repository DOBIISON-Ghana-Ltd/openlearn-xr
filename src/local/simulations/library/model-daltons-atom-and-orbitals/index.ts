import { LocalSimulationConfig } from "../../type";
import Model from "./model";

export type IValueMap = {
  atom_model: "Dalton's Sphere" | "Thompson's Model" | "Rutherford's Model";
  orbital_view: "1s Orbital" | "2s Orbital" | "2px Orbital" | "2py Orbital" | "2pz Orbital";
  show_labels: boolean;
};

export const config: LocalSimulationConfig = {
  type: "internal",
  slug: "model-daltons-atom-and-orbitals",
  name: "Model Dalton's Atom and Orbitals",
  Model,
  controls: [
    {
      id: "atom_model",
      label: "Select Atomic Model",
      description: "Choose a historical atomic model to display on the workbench.",
      type: "select",
      options: [
        "Dalton's Sphere",
        "Thompson's Model",
        "Rutherford's Model"
      ],
      value: "Dalton's Sphere",
      defaultValue: "Dalton's Sphere"
    },
    {
      id: "orbital_view",
      label: "Select Orbital View",
      description: "Visualize the 3D shape of a specific atomic orbital.",
      type: "select",
      options: [
        "1s Orbital",
        "2s Orbital",
        "2px Orbital",
        "2py Orbital",
        "2pz Orbital"
      ],
      value: "1s Orbital",
      defaultValue: "1s Orbital"
    },
    {
      id: "show_labels",
      label: "Toggle Quantum Labels",
      description: "Show or hide the principal and azimuthal quantum numbers for the selected orbital.",
      type: "toggle",
      value: false,
      defaultValue: false
    }
  ]
};

