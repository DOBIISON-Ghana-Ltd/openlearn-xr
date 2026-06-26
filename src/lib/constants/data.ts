export type Status = 'pending' | 'active';

export interface Book {
  id: string;
  subject: string;
  grade: string;
  total: number;
  status: Status;
}

export interface Module {
  id: string;
  title: string;
  bookId: string;
  checkpoints: number;
  orderPosition: number;
  status: Status;
}

export const books: Book[] = [
  {
    "id": "EbaAEa_sHj7pWbuX1X0X_",
    "subject": "Physics",
    "grade": "SHS 1",
    "total": 19,
    "status": "pending"
  },
  {
    "id": "5Py4ExgOzVVm6Kn3jFA-G",
    "subject": "Physics",
    "grade": "SHS 2",
    "total": 16,
    "status": "pending"
  },
  {
    "id": "9gkdG6eS6YRwD0-zHmEbX",
    "subject": "Physics",
    "grade": "SHS 3",
    "total": 9,
    "status": "pending"
  },
  {
    "id": "8hvtR_ozj_rRmjyogrfz_",
    "subject": "Chemistry",
    "grade": "SHS 1",
    "total": 11,
    "status": "pending"
  },
  {
    "id": "dOCv2FjUZlU6joISXO-ay",
    "subject": "Chemistry",
    "grade": "SHS 2",
    "total": 12,
    "status": "pending"
  },
  {
    "id": "tskWlZqQPVtMo8tkqtfno",
    "subject": "Chemistry",
    "grade": "SHS 3",
    "total": 14,
    "status": "pending"
  }
];

export const modules: Module[] = [
  {
    "id": "tIQrjuen8HztXbgEssFoW",
    "title": "Measurement of Physical Quantities",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 19,
    "orderPosition": 1,
    "status": "pending"
  },
  {
    "id": "ipCRJ0yy3Tf7UzP5hCm60",
    "title": "Paper Boats Motion Activity",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 14,
    "orderPosition": 2,
    "status": "pending"
  },
  {
    "id": "c-eP3vmhyfQzr52I-Ulya",
    "title": "Pressure Changes with Depth",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 13,
    "orderPosition": 3,
    "status": "active"
  },
  {
    "id": "DFu90zNjOLg2_r7K_y38c",
    "title": "Measuring Temperature with Thermometers",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 9,
    "orderPosition": 4,
    "status": "pending"
  },
  {
    "id": "-vffwGVKyms47MMBQxsoS",
    "title": "Locating Images in a Plane Mirror",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 14,
    "orderPosition": 5,
    "status": "pending"
  },
  {
    "id": "QUyvVjOpL4sudNCRLmJBB",
    "title": "Establishing the Laws of Reflection",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 12,
    "orderPosition": 6,
    "status": "pending"
  },
  {
    "id": "wPLtwirKdVLmQZFUu6XeQ",
    "title": "Images Formed by Inclined Mirrors",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 9,
    "orderPosition": 7,
    "status": "pending"
  },
  {
    "id": "8ILBtXy1uq0gjGptjW__Q",
    "title": "Refraction of Light in Water",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 19,
    "orderPosition": 8,
    "status": "pending"
  },
  {
    "id": "PU4qIDOBdbZJY-h2uuT7h",
    "title": "Determine the Refractive Index of a Rectangular Prism",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 10,
    "orderPosition": 9,
    "status": "pending"
  },
  {
    "id": "hIen1m3rd4SY44a2mGGsQ",
    "title": "Detecting Charge with a Gold Leaf Electroscope",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 18,
    "orderPosition": 10,
    "status": "active"
  },
  {
    "id": "fx0BvPQPBseI3GqLszrCF",
    "title": "Categorising Conductors, Semiconductors and Insulators",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 10,
    "orderPosition": 11,
    "status": "pending"
  },
  {
    "id": "jOT2fefc43LS2jUuOyebO",
    "title": "Categorising Magnetic and Non-magnetic Materials",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 12,
    "orderPosition": 12,
    "status": "pending"
  },
  {
    "id": "XCr1PnLA6SR4jAlJ-f4LW",
    "title": "Suspend a Bar Magnet",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 13,
    "orderPosition": 13,
    "status": "pending"
  },
  {
    "id": "vwCaOgPuhMibOOUO0-7Om",
    "title": "Magnetic Field Lines using Iron Filings",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 10,
    "orderPosition": 14,
    "status": "pending"
  },
  {
    "id": "J4LJ_DkFzA-Twk2wXG3cF",
    "title": "Making an Electromagnet",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 13,
    "orderPosition": 15,
    "status": "pending"
  },
  {
    "id": "C56XDpjOQpk3LOCB2MHor",
    "title": "Applications of BJTs",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 9,
    "orderPosition": 16,
    "status": "pending"
  },
  {
    "id": "xAhwkvQXuHwb5cTaX2Nq8",
    "title": "Construct Transistor Configuration Circuits",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 18,
    "orderPosition": 17,
    "status": "pending"
  },
  {
    "id": "rtfDBLwBH00AbJ_rmJGXn",
    "title": "Electron Transition Simulation",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 15,
    "orderPosition": 18,
    "status": "pending"
  },
  {
    "id": "8Tu6zH1_r1XH_SA7MZsLy",
    "title": "Radioactive Decay Simulation",
    "bookId": "EbaAEa_sHj7pWbuX1X0X_",
    "checkpoints": 9,
    "orderPosition": 19,
    "status": "pending"
  },
  {
    "id": "OUy-sUEKIZBWXB_1n8SDC",
    "title": "Determination of Density",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 16,
    "orderPosition": 1,
    "status": "active"
  },
  {
    "id": "Oi22kklFtldbMJFH-8E6i",
    "title": "Determine Upthrust and State Archimedes' Principle",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 9,
    "orderPosition": 2,
    "status": "pending"
  },
  {
    "id": "gnrpS4KwKyWylgL6yygVU",
    "title": "Principle of Flotation",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 9,
    "orderPosition": 3,
    "status": "pending"
  },
  {
    "id": "nUW-tHSFiKEDDuuUM8Pvc",
    "title": "Hooke's Law Experiment",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 14,
    "orderPosition": 4,
    "status": "pending"
  },
  {
    "id": "MCQ2slbIf6ov0buNWcSQi",
    "title": "Determine Coefficient of Friction",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 11,
    "orderPosition": 5,
    "status": "active"
  },
  {
    "id": "kAZxF66VQohcN4tbH3kOh",
    "title": "Determine Specific Heat Capacities Using Method of Mixtures",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 9,
    "orderPosition": 6,
    "status": "pending"
  },
  {
    "id": "bVDnaTN6r21_ZXe7bKYTf",
    "title": "Determine Specific Latent Heat of Fusion of Ice",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 13,
    "orderPosition": 7,
    "status": "pending"
  },
  {
    "id": "kbwr7lbCrDtS3MVyPhpxX",
    "title": "Determine Speed of Sound Using Resonance Tube/Sonometer",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 14,
    "orderPosition": 8,
    "status": "pending"
  },
  {
    "id": "9uR6ue1Wfpp-xF5O3fkJ7",
    "title": "Series and Parallel Connections of Capacitors",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 11,
    "orderPosition": 9,
    "status": "active"
  },
  {
    "id": "5Hlpw0tGQEG7WPzOe8vS5",
    "title": "Behaviour of a Capacitor in DC and AC Circuits",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 8,
    "orderPosition": 10,
    "status": "active"
  },
  {
    "id": "LbEWYTeMGcf83qRqgwkYW",
    "title": "Magnetic Field Around Current-Carrying Conductors",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 16,
    "orderPosition": 11,
    "status": "pending"
  },
  {
    "id": "zFIojb0fh5D8IKPqpiNDZ",
    "title": "Forces Between Parallel Current-Carrying Conductors",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 11,
    "orderPosition": 12,
    "status": "pending"
  },
  {
    "id": "RcpFpR4Hg3q3GKBg6jcN5",
    "title": "Construct a Basic Electric Motor",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 12,
    "orderPosition": 13,
    "status": "pending"
  },
  {
    "id": "vYLw4rm7-bSNGFAtSHdYs",
    "title": "7-segment Display Module",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 18,
    "orderPosition": 14,
    "status": "pending"
  },
  {
    "id": "7zKqqg6ZzirnU__Ocwf-1",
    "title": "Logic Gates and Truth Tables",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 18,
    "orderPosition": 15,
    "status": "pending"
  },
  {
    "id": "yFFS7dgnz6e4Jx_J5Wmjb",
    "title": "Design and Fabricate a Simple IC",
    "bookId": "5Py4ExgOzVVm6Kn3jFA-G",
    "checkpoints": 13,
    "orderPosition": 16,
    "status": "pending"
  },
  {
    "id": "ODIlroWwqB18qAmKz7Iv6",
    "title": "Establishing principle of moments",
    "bookId": "9gkdG6eS6YRwD0-zHmEbX",
    "checkpoints": 8,
    "orderPosition": 1,
    "status": "pending"
  },
  {
    "id": "A84Pd8EmiBuOdH-CrZkMC",
    "title": "Acceleration due to gravity",
    "bookId": "9gkdG6eS6YRwD0-zHmEbX",
    "checkpoints": 18,
    "orderPosition": 2,
    "status": "pending"
  },
  {
    "id": "Ew42HxwmHxcosJUgkgkmY",
    "title": "Verifying Newton's laws",
    "bookId": "9gkdG6eS6YRwD0-zHmEbX",
    "checkpoints": 10,
    "orderPosition": 3,
    "status": "pending"
  },
  {
    "id": "2OHRt1hfCjKxpG8L7eb9y",
    "title": "Relationship between voltage and current",
    "bookId": "9gkdG6eS6YRwD0-zHmEbX",
    "checkpoints": 10,
    "orderPosition": 4,
    "status": "pending"
  },
  {
    "id": "7li-UmMrwl5ghJAPPxW0I",
    "title": "Series/parallel resistors",
    "bookId": "9gkdG6eS6YRwD0-zHmEbX",
    "checkpoints": 16,
    "orderPosition": 5,
    "status": "active"
  },
  {
    "id": "easYCc8LMOriGIJiHIzVb",
    "title": "Adapting galvanometers",
    "bookId": "9gkdG6eS6YRwD0-zHmEbX",
    "checkpoints": 16,
    "orderPosition": 6,
    "status": "pending"
  },
  {
    "id": "e6sm_72HhntwPHx0xfX2s",
    "title": "Verifying laws of induction",
    "bookId": "9gkdG6eS6YRwD0-zHmEbX",
    "checkpoints": 10,
    "orderPosition": 7,
    "status": "pending"
  },
  {
    "id": "XyorLXngxxmBd7xwn_8At",
    "title": "Transformer operation",
    "bookId": "9gkdG6eS6YRwD0-zHmEbX",
    "checkpoints": 14,
    "orderPosition": 8,
    "status": "pending"
  },
  {
    "id": "6pbjswx7qInnmqM4sD2dy",
    "title": "Half wave rectifiers",
    "bookId": "9gkdG6eS6YRwD0-zHmEbX",
    "checkpoints": 18,
    "orderPosition": 9,
    "status": "pending"
  },
  {
    "id": "0TIaCfJ9W8u-VFDMV-xO0",
    "title": "Model Dalton's Atom and Orbitals",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 12,
    "orderPosition": 1,
    "status": "active"
  },
  {
    "id": "cAWO0Wk8MZi8P9kSHq84y",
    "title": "Prepare Standard Solutions",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 16,
    "orderPosition": 2,
    "status": "active"
  },
  {
    "id": "dozcjWaecmW8NblQxNT6V",
    "title": "Conservation of Mass Experiment",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 11,
    "orderPosition": 3,
    "status": "pending"
  },
  {
    "id": "xJy0sgVe_jZ0at3TFvMGL",
    "title": "Cathode Rays Simulation",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 10,
    "orderPosition": 4,
    "status": "active"
  },
  {
    "id": "BRFJPNQnEzOZIxciZxtCl",
    "title": "Determine Mass using a Beam Balance",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 19,
    "orderPosition": 5,
    "status": "active"
  },
  {
    "id": "AqFCOGka6sVABehitXZ0g",
    "title": "Determine Melting & Boiling Points",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 19,
    "orderPosition": 6,
    "status": "active"
  },
  {
    "id": "mw7_13U_7hXkFYxOGMAH6",
    "title": "Investigate Rate of Diffusion",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 12,
    "orderPosition": 7,
    "status": "pending"
  },
  {
    "id": "74c-4-8jomsLwgi3v3ODg",
    "title": "Laboratory Preparation of Gases",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 8,
    "orderPosition": 8,
    "status": "pending"
  },
  {
    "id": "NPCSqAi9q_MhGAyUEWB1K",
    "title": "Investigate Factors Affecting Solubility",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 11,
    "orderPosition": 9,
    "status": "pending"
  },
  {
    "id": "M12AnvuHhPayRIzEK_pNu",
    "title": "Test for Cations and Anions",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 12,
    "orderPosition": 10,
    "status": "pending"
  },
  {
    "id": "cCn-MQX_iVVx6BZdxLvqE",
    "title": "Model Ionic Bonds and Crystals",
    "bookId": "8hvtR_ozj_rRmjyogrfz_",
    "checkpoints": 15,
    "orderPosition": 11,
    "status": "pending"
  },
  {
    "id": "WmppXBeNoAKH165sgBkdO",
    "title": "Constructing Energy Cycles and Born-Haber Cycles",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 12,
    "orderPosition": 1,
    "status": "pending"
  },
  {
    "id": "T5Jr8o0fXLDoR0-Vx_rni",
    "title": "Determine Enthalpy Changes and Calorific Values of Foods and Fuels",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 13,
    "orderPosition": 2,
    "status": "pending"
  },
  {
    "id": "gjQJh1KJTdSaqHWDepp-q",
    "title": "Investigate Factors Affecting Rate of Reaction",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 19,
    "orderPosition": 3,
    "status": "pending"
  },
  {
    "id": "OT6bmswSuog5NgkZwmxgZ",
    "title": "Reversible Reaction of Anhydrous Copper (II) Tetraoxosulphate (VI)",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 12,
    "orderPosition": 4,
    "status": "pending"
  },
  {
    "id": "1_ATGroOwvvTZDO5_TJzk",
    "title": "Reactions of Acids and Bases (Neutralization)",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 15,
    "orderPosition": 5,
    "status": "pending"
  },
  {
    "id": "AXR2QKDM4HzvGAEEwsIG2",
    "title": "Preparation of Soluble and Insoluble Salts",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 17,
    "orderPosition": 6,
    "status": "pending"
  },
  {
    "id": "MbRzBWWjcMeHMm7KxfOsa",
    "title": "Determine Quantity of Analyte via Acid-Base Titrations",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 9,
    "orderPosition": 7,
    "status": "pending"
  },
  {
    "id": "PO_PErruaQ6dcz7M-1OpJ",
    "title": "Thermal Stability of Carbonates and Nitrates",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 18,
    "orderPosition": 8,
    "status": "pending"
  },
  {
    "id": "jAwQJ1NhAL9kufdb8PR5P",
    "title": "Distinguish Alkanes and Alkenes using Bromine Water",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 9,
    "orderPosition": 9,
    "status": "pending"
  },
  {
    "id": "DmEqiy9yIqiqUOFt6kj2n",
    "title": "Design an Alcohol Breath alyser",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 12,
    "orderPosition": 10,
    "status": "pending"
  },
  {
    "id": "CKrz2d-spZLBWGZNPjMag",
    "title": "Preparation of Alkanols (Ethanol via Fermentation)",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 15,
    "orderPosition": 11,
    "status": "pending"
  },
  {
    "id": "Odb1izurD6w0SJn8i8OgJ",
    "title": "Reactions of Alkanoic Acids and Preparation of Esters",
    "bookId": "dOCv2FjUZlU6joISXO-ay",
    "checkpoints": 17,
    "orderPosition": 12,
    "status": "pending"
  },
  {
    "id": "16sCiJArSTjRungpJO3jU",
    "title": "Preparation of Buffer Solutions",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 15,
    "orderPosition": 1,
    "status": "pending"
  },
  {
    "id": "YJZHEfCAvIlYEzhJidWJH",
    "title": "Selecting Suitable Acid-Base Indicators for Titration",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 18,
    "orderPosition": 2,
    "status": "pending"
  },
  {
    "id": "OsCHmFy13NsamNjU__8Zq",
    "title": "Illustrate Reactivity of Metals Experimentally",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 15,
    "orderPosition": 3,
    "status": "pending"
  },
  {
    "id": "2uVWdv0mpMUIfrZ0Xpn1V",
    "title": "Perform Oxidation and Reduction Titrations",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 15,
    "orderPosition": 4,
    "status": "pending"
  },
  {
    "id": "pH33QKjDV4M98IulJMtte",
    "title": "Determine EMF of a Voltaic Cell",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 13,
    "orderPosition": 5,
    "status": "pending"
  },
  {
    "id": "L7VakeWnLGAavF-prH4bv",
    "title": "Investigate Electrolysis of Aqueous Solutions",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 19,
    "orderPosition": 6,
    "status": "pending"
  },
  {
    "id": "K1JX7bJnAH3Em3yTGjwAi",
    "title": "Demonstrate Electroplating",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 8,
    "orderPosition": 7,
    "status": "pending"
  },
  {
    "id": "cv9rjnfWeg6XFT3xQRr1t",
    "title": "Investigate Conditions for Rusting and Rate of Rusting",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 15,
    "orderPosition": 8,
    "status": "pending"
  },
  {
    "id": "3sviIZuN0M9qwZ0A5-1PH",
    "title": "Catalytic Behaviour of Transition Elements",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 12,
    "orderPosition": 9,
    "status": "pending"
  },
  {
    "id": "UTFYL4BDk0yBkgrQEGpaC",
    "title": "Complex Formation and Solubility of Insoluble Species",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 14,
    "orderPosition": 10,
    "status": "pending"
  },
  {
    "id": "5H23xpCBDx2sMFzt_dKzF",
    "title": "Preparation of Alkyl Alkanoate (Ethyl Ethanoate)",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 14,
    "orderPosition": 11,
    "status": "pending"
  },
  {
    "id": "NOMwNAceAA3StEIxuHW22",
    "title": "Preparation of Soap (Saponification)",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 10,
    "orderPosition": 12,
    "status": "pending"
  },
  {
    "id": "wVhqkrdnVCtdAk11qpar9",
    "title": "Test for Reducing Sugars",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 18,
    "orderPosition": 13,
    "status": "pending"
  },
  {
    "id": "Fs3d_MuQvgwfeNkXIyjfg",
    "title": "Synthesis of a Nylon Rope",
    "bookId": "tskWlZqQPVtMo8tkqtfno",
    "checkpoints": 12,
    "orderPosition": 14,
    "status": "pending"
  }
];
