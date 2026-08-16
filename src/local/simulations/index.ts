import { LocalSimulationConfig } from "./type";
import { config as daltonsAtomConfig } from "./library/model-daltons-atom-and-orbitals";
import { config as chemicalBondingConfig } from "./library/chemical-bonding";
import { config as enthalpyChangesConfig } from "./library/determine-enthalpy-changes";
import { config as capacitorsConfig } from "./library/series-and-parallel-connections-of-capacitors";
import { config as frictionConfig } from "./library/forces-and-motion-coefficient-of-friction";
import { config as shmConfig } from "./library/simple-harmonic-motion";
import { config as energyFormsConfig } from "./library/energy-forms-and-changes";
import { config as opticsConfig } from "./library/geometric-optics";

export const SIMULATION_REGISTRY: Record<string, LocalSimulationConfig> = {
  "model-daltons-atom-and-orbitals": daltonsAtomConfig,
  "chemical-bonding": chemicalBondingConfig,
  "determine-enthalpy-changes": enthalpyChangesConfig,
  "series-and-parallel-connections-of-capacitors": capacitorsConfig,
  "forces-and-motion-coefficient-of-friction": frictionConfig,
  "simple-harmonic-motion": shmConfig,
  "energy-forms-and-changes": energyFormsConfig,
  "geometric-optics": opticsConfig,
};

export function getSimulationConfig(slug: string): LocalSimulationConfig | undefined {
  return SIMULATION_REGISTRY[slug];
}

export { default as Renderer } from "./Renderer";

