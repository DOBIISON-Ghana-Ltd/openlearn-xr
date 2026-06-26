// ==========================================
// SIMULATION SUITE — TYPES & MOCK DATA
// ==========================================

export type ControlType = 'slider' | 'toggle' | 'switch' | 'select' | 'input';
export type CheckpointType = 'boolean' | 'multiple-choice';

export interface SimControlDef {
  id: string;
  label: string;
  type: ControlType;
  defaultValue: any;
  // Slider-specific
  min?: number;
  max?: number;
  step?: number;
  // Select-specific
  options?: { label: string; value: string | number }[];
  unit?: string;
}

export interface SimCheckpointDef {
  id: string;
  title: string;
  description: string;
  question: string;
  type: CheckpointType;
  /**
   * For 'boolean': options should be ["True", "False"]
   * For 'multiple-choice': options should be ["A. ...", "B. ...", "C. ...", "D. ..."]
   */
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface SimDef {
  id: string;
  title: string;
  /** Maps to a component in src/components/sim/ */
  componentKey: string;
  description: string;
  controls: SimControlDef[];
  checkpoints: SimCheckpointDef[];
}

// ==========================================
// MOCK SIMULATIONS REGISTRY
// Add new sims here as they're built.
// ==========================================

export const MOCK_SIMS: SimDef[] = [
  {
    id: 'c-eP3vmhyfQzr52I-Ulya', // matches the module id from data.ts
    title: 'Pressure Changes with Depth',
    componentKey: 'PressureDepthSim',
    description: 'Explore how hydrostatic pressure increases with depth in a fluid.',
    controls: [
      {
        id: 'depth',
        label: 'Depth',
        type: 'slider',
        defaultValue: 1,
        min: 0,
        max: 10,
        step: 0.1,
        unit: 'm',
      },
      {
        id: 'density',
        label: 'Fluid Density',
        type: 'select',
        defaultValue: 1000,
        options: [
          { label: 'Water (1000 kg/m³)', value: 1000 },
          { label: 'Seawater (1025 kg/m³)', value: 1025 },
          { label: 'Oil (850 kg/m³)', value: 850 },
          { label: 'Mercury (13534 kg/m³)', value: 13534 },
        ],
      },
    ],
    checkpoints: [
      {
        id: 'cp-pressure-1',
        title: 'Pressure Formula',
        description: 'Consider how the formula P = ρgh works.',
        question: 'If you double the depth, what happens to the hydrostatic pressure?',
        type: 'multiple-choice',
        options: ['A. It stays the same', 'B. It doubles', 'C. It halves', 'D. It quadruples'],
        correctAnswer: 'B. It doubles',
        points: 10,
      },
      {
        id: 'cp-pressure-2',
        title: 'Fluid Density',
        description: 'Try different fluid densities in the simulation.',
        question: 'Is pressure at a given depth higher in mercury than in water?',
        type: 'boolean',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 10,
      },
    ],
  },
];
