import { LocalSimulationConfig } from "../../type";
import Model from "./model";

export type IValueMap = {
  select_molecule: "BeCl2 (Linear)" | "BCl3 (Trigonal Planar)" | "CH4 (Tetrahedral)" | "PCl5 (Trigonal Bipyramidal)" | "SF6 (Octahedral)";
  show_hybrid_orbitals: boolean;
  display_bond_angles: boolean;
};

export const config: LocalSimulationConfig = {
  type: "internal",
  slug: "chemical-bonding",
  name: "Chemical Bonding",
  Model,
  controls: [
    {
      id: "select_molecule",
      label: "Select Molecule",
      description: "Choose a molecule to visualize its 3D geometry and hybridization.",
      type: "select",
      options: [
        "BeCl2 (Linear)",
        "BCl3 (Trigonal Planar)",
        "CH4 (Tetrahedral)",
        "PCl5 (Trigonal Bipyramidal)",
        "SF6 (Octahedral)"
      ],
      value: "CH4 (Tetrahedral)",
      defaultValue: "CH4 (Tetrahedral)"
    },
    {
      id: "show_hybrid_orbitals",
      label: "Show Hybrid Orbitals",
      description: "Toggle to display the hybrid orbital lobes around the central atom.",
      type: "toggle",
      value: false,
      defaultValue: false
    },
    {
      id: "display_bond_angles",
      label: "Display Bond Angles",
      description: "Toggle to show the exact bond angle measurements on the 3D model.",
      type: "toggle",
      value: true,
      defaultValue: true
    }
  ]
};

