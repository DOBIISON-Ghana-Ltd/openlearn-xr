// ==========================================
// SIMULATION SUITE — TYPES & MOCK DATA
// ==========================================

export type ControlType = 'slider' | 'toggle' | 'switch';
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
  // Toggle-specific
  options?: { label: string; value: string | number }[];
  unit?: string;
}

export interface SimCheckpointDef {
  id: string;
  question: string;
  type: CheckpointType;
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
  camera?: any;
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
    camera: { position: [0, 10, 16], fov: 50 },
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
        type: 'toggle',
        defaultValue: 1000,
        unit: 'kg/m³',
        options: [
          { label: 'Water', value: 1000 },
          { label: 'Seawater', value: 1025 },
          { label: 'Oil', value: 850 },
          { label: 'Mercury', value: 13534 },
        ],
      },
    ],
    checkpoints: [
      {
        id: 'cp-pressure-1',
        question: 'If you double the depth, what happens to the hydrostatic pressure?',
        type: 'multiple-choice',
        options: ['It stays the same', 'It doubles', 'It halves', 'It quadruples'],
        correctAnswer: 'It doubles',
        points: 10,
      },
      {
        id: 'cp-pressure-2',
        question: 'Is pressure at a given depth higher in mercury than in water?',
        type: 'boolean',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 10,
      },
      {
        id: 'cp-pressure-3',
        question: 'Based on the simulation, which hole squirts fluid the farthest horizontally?',
        type: 'multiple-choice',
        options: ['The top hole', 'The middle hole', 'The bottom hole', 'They all squirt the same distance'],
        correctAnswer: 'The bottom hole',
        points: 10,
      },
      {
        id: 'cp-pressure-4',
        question: 'If you change the fluid from Water (1000 kg/m³) to Oil (850 kg/m³), what happens to the pressure at the bottom hole?',
        type: 'multiple-choice',
        options: ['It increases', 'It decreases', 'It remains the same', 'It becomes zero'],
        correctAnswer: 'It decreases',
        points: 10,
      },
      {
        id: 'cp-pressure-5',
        question: 'Which two factors determine the hydrostatic pressure at any given point in the barrel?',
        type: 'multiple-choice',
        options: ['Fluid density and depth', 'Volume and temperature', 'Hole size and fluid density', 'Barrel shape and depth'],
        correctAnswer: 'Fluid density and depth',
        points: 10,
      },
      {
        id: 'cp-pressure-6',
        question: 'Does the fluid pressure at a specific depth act only in a downward direction?',
        type: 'boolean',
        options: ['True', 'False'],
        correctAnswer: 'False',
        points: 10,
      },
    ],
  },
  {
    id: 'hIen1m3rd4SY44a2mGGsQ',
    title: 'Detecting Charge with a Gold Leaf Electroscope',
    componentKey: 'ElectroscopeSim',
    description: 'Explore electrostatic induction and conduction using a virtual gold leaf electroscope.',
    camera: { position: [0, 5, 10], fov: 50 },
    controls: [
      {
        id: 'rodType',
        label: 'Test Rod',
        type: 'toggle',
        defaultValue: 'glass',
        options: [
          { label: 'Glass (+)', value: 'glass' },
          { label: 'Plastic (-)', value: 'plastic' },
        ],
      },
      {
        id: 'rodCharge',
        label: 'Rod Charge Intensity',
        type: 'slider',
        defaultValue: 5,
        min: 0,
        max: 10,
        step: 1,
      },
      {
        id: 'rodDistance',
        label: 'Rod Distance (0 = Touch)',
        type: 'slider',
        defaultValue: 10,
        min: 0,
        max: 15,
        step: 0.1,
        unit: 'cm',
      },
      {
        id: 'isGrounded',
        label: 'Ground Electroscope',
        type: 'switch',
        defaultValue: false,
      },
      {
        id: 'showCharges',
        label: 'Show Charges',
        type: 'switch',
        defaultValue: true,
      },
    ],
    checkpoints: [
      {
        id: 'cp-electro-1',
        question: 'What happens to the gold leaf when a charged rod is brought near but not touching the cap?',
        type: 'multiple-choice',
        options: ['It collapses completely', 'It deflects (repels)', 'It spins in a circle', 'Nothing happens'],
        correctAnswer: 'It deflects (repels)',
        points: 10,
      },
      {
        id: 'cp-electro-2',
        question: 'What is the process of charging an object without physical contact called?',
        type: 'multiple-choice',
        options: ['Conduction', 'Friction', 'Induction', 'Earthing'],
        correctAnswer: 'Induction',
        points: 10,
      },
      {
        id: 'cp-electro-3',
        question: 'If a positively charged glass rod is brought near the cap, what charge is induced on the gold leaf?',
        type: 'multiple-choice',
        options: ['Positive', 'Negative', 'Neutral', 'It alternates'],
        correctAnswer: 'Positive',
        points: 10,
      },
      {
        id: 'cp-electro-4',
        question: 'What happens when you physically touch the charged rod to the brass cap?',
        type: 'multiple-choice',
        options: ['Electrons flow to/from earth', 'Charge transfers permanently (Conduction)', 'The rod shatters', 'The jar shatters'],
        correctAnswer: 'Charge transfers permanently (Conduction)',
        points: 10,
      },
      {
        id: 'cp-electro-5',
        question: 'After touching a negatively charged plastic rod to the cap and removing it, what charge remains on the electroscope?',
        type: 'multiple-choice',
        options: ['Positive', 'Negative', 'Neutral', 'Zero'],
        correctAnswer: 'Negative',
        points: 10,
      },
      {
        id: 'cp-electro-6',
        question: 'If you ground the electroscope (touching it with your finger), what happens to the gold leaf?',
        type: 'multiple-choice',
        options: ['It stays deflected', 'It turns green', 'It collapses (returns to neutral)', 'It sparks'],
        correctAnswer: 'It collapses (returns to neutral)',
        points: 10,
      },
      {
        id: 'cp-electro-7',
        question: 'What is the primary purpose of the gold leaf in this instrument?',
        type: 'multiple-choice',
        options: ['To generate electricity', 'To indicate the presence and magnitude of charge', 'To look shiny', 'To act as a resistor'],
        correctAnswer: 'To indicate the presence and magnitude of charge',
        points: 10,
      },
      {
        id: 'cp-electro-8',
        question: 'Why are the central rod and cap made of brass or copper?',
        type: 'multiple-choice',
        options: ['They are insulators', 'They are conductors, allowing electrons to flow freely', 'They are cheap', 'They are magnetic'],
        correctAnswer: 'They are conductors, allowing electrons to flow freely',
        points: 10,
      },
      {
        id: 'cp-electro-9',
        question: 'Why is the delicate gold leaf housed inside a glass jar?',
        type: 'multiple-choice',
        options: ['To trap the electrons', 'To protect it from air currents and dust', 'To magnify the view', 'To insulate it completely from light'],
        correctAnswer: 'To protect it from air currents and dust',
        points: 10,
      },
      {
        id: 'cp-electro-10',
        question: 'If the electroscope is already positively charged (leaf deflected), and you bring a negatively charged rod near the cap, what happens to the leaf initially?',
        type: 'multiple-choice',
        options: ['The deflection increases', 'The deflection decreases (collapses slightly)', 'It catches fire', 'Nothing happens'],
        correctAnswer: 'The deflection decreases (collapses slightly)',
        points: 10,
      },
    ],
  },
  {
    id: 'OUy-sUEKIZBWXB_1n8SDC',
    title: 'Determination of Density',
    componentKey: 'DensitySim',
    description: 'Determine the density of regular solids, irregular solids, and liquids.',
    camera: { position: [0, 4, 8], fov: 50 },
    controls: [
      {
        id: 'materialType',
        label: 'Material to Test',
        type: 'toggle',
        defaultValue: 'stone',
        options: [
          { label: 'Irregular Solid (Stone)', value: 'stone' },
          { label: 'Regular Solid (Wood)', value: 'wood' },
          { label: 'Liquid (Oil)', value: 'oil' },
        ],
      },
      {
        id: 'measurementType',
        label: 'Measurement Step',
        type: 'toggle',
        defaultValue: 'mass',
        options: [
          { label: 'Measure Mass', value: 'mass' },
          { label: 'Measure Volume', value: 'volume' },
        ],
      },
    ],
    checkpoints: [
      {
        id: 'cp-density-1',
        question: 'What is the formula for calculating density?',
        type: 'multiple-choice',
        options: ['Density = Mass × Volume', 'Density = Mass / Volume', 'Density = Volume / Mass', 'Density = Mass + Volume'],
        correctAnswer: 'Density = Mass / Volume',
        points: 10,
      },
      {
        id: 'cp-density-2',
        question: 'How do you determine the volume of an irregular solid like a stone?',
        type: 'multiple-choice',
        options: ['By using a ruler to measure its length, width, and height', 'By using the water displacement method in a measuring cylinder', 'By weighing it on a balance', 'By melting it'],
        correctAnswer: 'By using the water displacement method in a measuring cylinder',
        points: 10,
      },
      {
        id: 'cp-density-3',
        question: 'What is the mass of the stone in the simulation?',
        type: 'multiple-choice',
        options: ['14.4 g', '34.0 g', '54.0 g', '20.0 g'],
        correctAnswer: '54.0 g',
        points: 10,
      },
      {
        id: 'cp-density-4',
        question: 'When the stone is submerged in 50mL of water, the level rises to 70mL. What is the volume of the stone?',
        type: 'multiple-choice',
        options: ['50 cm³', '70 cm³', '20 cm³', '120 cm³'],
        correctAnswer: '20 cm³',
        points: 10,
      },
      {
        id: 'cp-density-5',
        question: 'Calculate the density of the stone (Mass = 54.0g, Volume = 20cm³).',
        type: 'multiple-choice',
        options: ['2.7 g/cm³', '0.37 g/cm³', '74 g/cm³', '1080 g/cm³'],
        correctAnswer: '2.7 g/cm³',
        points: 10,
      },
      {
        id: 'cp-density-6',
        question: 'How do you determine the volume of a regular solid like a wood block?',
        type: 'multiple-choice',
        options: ['Measure its dimensions with a ruler and multiply length × width × height', 'Use a measuring cylinder', 'Weigh it on an electronic balance', 'Count its sides'],
        correctAnswer: 'Measure its dimensions with a ruler and multiply length × width × height',
        points: 10,
      },
      {
        id: 'cp-density-7',
        question: 'Calculate the density of the wood block (Mass = 14.4g, Volume = 24cm³).',
        type: 'multiple-choice',
        options: ['0.6 g/cm³', '1.67 g/cm³', '38.4 g/cm³', '345.6 g/cm³'],
        correctAnswer: '0.6 g/cm³',
        points: 10,
      },
      {
        id: 'cp-density-8',
        question: 'Why does the wood block float on water while the stone sinks?',
        type: 'multiple-choice',
        options: ['Because wood is heavier than stone', 'Because the density of wood is less than the density of water (1.0 g/cm³)', 'Because the stone is round', 'Because the wood absorbs water'],
        correctAnswer: 'Because the density of wood is less than the density of water (1.0 g/cm³)',
        points: 10,
      },
      {
        id: 'cp-density-9',
        question: 'When measuring the mass of a liquid, why must you "tare" (zero) the electronic balance first with the empty beaker?',
        type: 'multiple-choice',
        options: ['To calibrate the balance', 'To subtract the mass of the beaker, so you only measure the liquid', 'To make the liquid heavier', 'To prevent spilling'],
        correctAnswer: 'To subtract the mass of the beaker, so you only measure the liquid',
        points: 10,
      },
      {
        id: 'cp-density-10',
        question: 'Calculate the density of the oil (Mass = 34.0g, Volume = 40mL).',
        type: 'multiple-choice',
        options: ['1.18 g/cm³', '0.85 g/cm³', '74 g/cm³', '1360 g/cm³'],
        correctAnswer: '0.85 g/cm³',
        points: 10,
      },
    ],
  },
];
