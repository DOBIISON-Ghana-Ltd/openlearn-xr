import { ComponentType } from 'react';

export const SIM_LOADERS: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  PressureDepthSim: () => import('@/components/sim/demos/PressureDepthSim'),
  ElectroscopeSim: () => import('@/components/sim/demos/ElectroscopeSim'),
  DensitySim: () => import('@/components/sim/demos/DensitySim'),
};
