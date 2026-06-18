export type Subject = 'Chemistry' | 'Physics' | 'Biology'

export interface LibraryCollection {
    id: string
    subject: Subject
    grade: string          // e.g. "Form One", "Form Two"
    totalModules: number
    totalPlayedModules: number  // the current player's conquered/completed modules
}

export const MOCK_LIBRARY: LibraryCollection[] = [
    // ── Chemistry ───────────────────────────────────────────
    {
        id: 'chem-f1',
        subject: 'Chemistry',
        grade: 'Form One',
        totalModules: 8,
        totalPlayedModules: 3,
    },
    {
        id: 'chem-f2',
        subject: 'Chemistry',
        grade: 'Form Two',
        totalModules: 10,
        totalPlayedModules: 6,
    },
    {
        id: 'chem-f3',
        subject: 'Chemistry',
        grade: 'Form Three',
        totalModules: 12,
        totalPlayedModules: 0,
    },
    {
        id: 'chem-f4',
        subject: 'Chemistry',
        grade: 'Form Four',
        totalModules: 9,
        totalPlayedModules: 9,
    },

    // ── Physics ─────────────────────────────────────────────
    {
        id: 'phys-f1',
        subject: 'Physics',
        grade: 'Form One',
        totalModules: 7,
        totalPlayedModules: 7,
    },
    {
        id: 'phys-f2',
        subject: 'Physics',
        grade: 'Form Two',
        totalModules: 11,
        totalPlayedModules: 4,
    },
    {
        id: 'phys-f3',
        subject: 'Physics',
        grade: 'Form Three',
        totalModules: 13,
        totalPlayedModules: 2,
    },
    {
        id: 'phys-f4',
        subject: 'Physics',
        grade: 'Form Four',
        totalModules: 10,
        totalPlayedModules: 0,
    },

    // ── Biology ─────────────────────────────────────────────
    {
        id: 'biol-f1',
        subject: 'Biology',
        grade: 'Form One',
        totalModules: 9,
        totalPlayedModules: 5,
    },
    {
        id: 'biol-f2',
        subject: 'Biology',
        grade: 'Form Two',
        totalModules: 11,
        totalPlayedModules: 11,
    },
    {
        id: 'biol-f3',
        subject: 'Biology',
        grade: 'Form Three',
        totalModules: 14,
        totalPlayedModules: 7,
    },
    {
        id: 'biol-f4',
        subject: 'Biology',
        grade: 'Form Four',
        totalModules: 12,
        totalPlayedModules: 1,
    },
]

export interface Module {
  id: string
  collectionId: string
  title: string
  subject: Subject
  grade: string
  totalCheckpoints: number
  isCompleted: boolean
  isLocked: boolean
}

export const MOCK_MODULES: Module[] = [
  // Chemistry Form One (chem-f1)
  {
    id: 'chem-f1-m1',
    collectionId: 'chem-f1',
    title: 'Introduction to Chemistry',
    subject: 'Chemistry',
    grade: 'Form One',
    totalCheckpoints: 12,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'chem-f1-m2',
    collectionId: 'chem-f1',
    title: 'Laboratory Apparatus & Safety',
    subject: 'Chemistry',
    grade: 'Form One',
    totalCheckpoints: 18,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'chem-f1-m3',
    collectionId: 'chem-f1',
    title: 'States of Matter',
    subject: 'Chemistry',
    grade: 'Form One',
    totalCheckpoints: 24,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'chem-f1-m4',
    collectionId: 'chem-f1',
    title: 'Mixtures & Separating Techniques',
    subject: 'Chemistry',
    grade: 'Form One',
    totalCheckpoints: 15,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'chem-f1-m5',
    collectionId: 'chem-f1',
    title: 'Acids, Bases, and Indicators',
    subject: 'Chemistry',
    grade: 'Form One',
    totalCheckpoints: 20,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'chem-f1-m6',
    collectionId: 'chem-f1',
    title: 'Chemical Properties of Oxygen',
    subject: 'Chemistry',
    grade: 'Form One',
    totalCheckpoints: 16,
    isCompleted: true,
    isLocked: true,
  },
  {
    id: 'chem-f1-m7',
    collectionId: 'chem-f1',
    title: 'Air and Combustion',
    subject: 'Chemistry',
    grade: 'Form One',
    totalCheckpoints: 22,
    isCompleted: true,
    isLocked: true,
  },
  {
    id: 'chem-f1-m8',
    collectionId: 'chem-f1',
    title: 'Water and Hydrogen',
    subject: 'Chemistry',
    grade: 'Form One',
    totalCheckpoints: 25,
    isCompleted: true,
    isLocked: true,
  },
  
  // Physics Form One (phys-f1)
  {
    id: 'phys-f1-m1',
    collectionId: 'phys-f1',
    title: 'Introduction to Physics',
    subject: 'Physics',
    grade: 'Form One',
    totalCheckpoints: 10,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'phys-f1-m2',
    collectionId: 'phys-f1',
    title: 'Force and Motion',
    subject: 'Physics',
    grade: 'Form One',
    totalCheckpoints: 14,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'phys-f1-m3',
    collectionId: 'phys-f1',
    title: 'Pressure in Solids and Liquids',
    subject: 'Physics',
    grade: 'Form One',
    totalCheckpoints: 20,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'phys-f1-m4',
    collectionId: 'phys-f1',
    title: 'Thermal Expansion & Temperature',
    subject: 'Physics',
    grade: 'Form One',
    totalCheckpoints: 18,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'phys-f1-m5',
    collectionId: 'phys-f1',
    title: 'Heat Transfer Mechanisms',
    subject: 'Physics',
    grade: 'Form One',
    totalCheckpoints: 22,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'phys-f1-m6',
    collectionId: 'phys-f1',
    title: 'Electrostatics I',
    subject: 'Physics',
    grade: 'Form One',
    totalCheckpoints: 16,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'phys-f1-m7',
    collectionId: 'phys-f1',
    title: 'Simple Cells & Circuits',
    subject: 'Physics',
    grade: 'Form One',
    totalCheckpoints: 24,
    isCompleted: true,
    isLocked: false,
  },

  // Biology Form One (biol-f1)
  {
    id: 'biol-f1-m1',
    collectionId: 'biol-f1',
    title: 'Introduction to Biology',
    subject: 'Biology',
    grade: 'Form One',
    totalCheckpoints: 12,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'biol-f1-m2',
    collectionId: 'biol-f1',
    title: 'Classification of Living Organisms',
    subject: 'Biology',
    grade: 'Form One',
    totalCheckpoints: 24,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'biol-f1-m3',
    collectionId: 'biol-f1',
    title: 'The Microscope and Cells',
    subject: 'Biology',
    grade: 'Form One',
    totalCheckpoints: 18,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'biol-f1-m4',
    collectionId: 'biol-f1',
    title: 'Cell Structure and Function',
    subject: 'Biology',
    grade: 'Form One',
    totalCheckpoints: 20,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'biol-f1-m5',
    collectionId: 'biol-f1',
    title: 'Nutrition in Plants',
    subject: 'Biology',
    grade: 'Form One',
    totalCheckpoints: 16,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'biol-f1-m6',
    collectionId: 'biol-f1',
    title: 'Nutrition in Animals',
    subject: 'Biology',
    grade: 'Form One',
    totalCheckpoints: 22,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'biol-f1-m7',
    collectionId: 'biol-f1',
    title: 'Transport in Plants',
    subject: 'Biology',
    grade: 'Form One',
    totalCheckpoints: 15,
    isCompleted: true,
    isLocked: true,
  },
  {
    id: 'biol-f1-m8',
    collectionId: 'biol-f1',
    title: 'Transport in Animals',
    subject: 'Biology',
    grade: 'Form One',
    totalCheckpoints: 25,
    isCompleted: true,
    isLocked: true,
  },
  {
    id: 'biol-f1-m9',
    collectionId: 'biol-f1',
    title: 'Gaseous Exchange',
    subject: 'Biology',
    grade: 'Form One',
    totalCheckpoints: 18,
    isCompleted: true,
    isLocked: true,
  },
]
