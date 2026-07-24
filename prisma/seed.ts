import "dotenv/config";
import { auth } from "../src/adapters/auth/server";
import prisma from "../src/adapters/db/client";
import { getUniqueSlug } from "../src/lib/utils/get-unique-slug";

interface SeedCheckpoint {
  orderIndex: number;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

interface SeedModule {
  title: string;
  description?: string;
  checkpoints: SeedCheckpoint[];
}

interface SeedCollection {
  name: string;
  level: string;
  description: string;
  modules: SeedModule[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKPOINT DATA — 12 Target Practical Modules
// ─────────────────────────────────────────────────────────────────────────────

const checkpoints: Record<string, SeedCheckpoint[]> = {
  // ── FOCUS AREA 1: Atomic Structure ─────────────────────────────────────────

  "Model Dalton's Atom and Orbitals": [
    { orderIndex: 1, question: "Dalton proposed that atoms of the same element have identical mass.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 2, question: "According to Dalton, what happens to atoms during a chemical reaction?", options: ["Created", "Destroyed", "Split", "Rearranged"], correctAnswer: 3, points: 10 },
    { orderIndex: 3, question: "An s-orbital has a dumbbell shape.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 4, question: "What is the maximum electron capacity of the 2p subshell?", options: ["2", "6", "10", "14"], correctAnswer: 1, points: 10 },
    { orderIndex: 5, question: "Which quantum number specifies orbital energy level and size?", options: ["Magnetic (m)", "Spin (s)", "Principal (n)", "Azimuthal (l)"], correctAnswer: 2, points: 10 },
    { orderIndex: 6, question: "Aufbau principle states electrons fill lower energy orbitals first.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 7, question: "How many orbitals make up the 3d subshell?", options: ["5", "3", "1", "7"], correctAnswer: 0, points: 10 },
    { orderIndex: 8, question: "Hund's rule requires electrons to pair up before occupying empty orbitals.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 9, question: "What is the maximum number of electrons in a single orbital?", options: ["1", "2", "6", "8"], correctAnswer: 1, points: 10 },
    { orderIndex: 10, question: "Pauli's Exclusion Principle states two electrons in one orbital must have:", options: ["Same spin", "Opposite spin", "Zero spin", "Variable spin"], correctAnswer: 1, points: 10 },
    { orderIndex: 11, question: "The 3s orbital has a higher energy level than the 2s orbital.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 12, question: "Which shape best describes a p-orbital?", options: ["Spherical", "Cloverleaf", "Toroidal", "Dumbbell"], correctAnswer: 3, points: 10 },
  ],

  "Cathode Rays Simulation": [
    { orderIndex: 1, question: "Which subatomic particle was identified via cathode ray experiments?", options: ["Proton", "Neutron", "Alpha particle", "Electron"], correctAnswer: 3, points: 10 },
    { orderIndex: 2, question: "Cathode rays travel from the cathode (negative) to the anode (positive).", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 3, question: "Cathode rays bend toward a positive electric plate because they are:", options: ["Positively charged", "Negatively charged", "Neutral", "Electromagnetic waves"], correctAnswer: 1, points: 10 },
    { orderIndex: 4, question: "Cathode rays are deflected by magnetic fields but not electric fields.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 5, question: "Thomson's cathode ray experiment proved that atoms:", options: ["Contain negative particles", "Are solid indivisible spheres", "Have a dense nucleus", "Are mostly empty space"], correctAnswer: 0, points: 10 },
    { orderIndex: 6, question: "The e/m ratio of cathode rays depends on the gas inside the tube.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 7, question: "Thomson's plum pudding model described the atom as:", options: ["Electrons orbiting a nucleus", "Neutral particles in a shell", "Negative electrons in positive charge", "A hard billiard ball"], correctAnswer: 2, points: 10 },
    { orderIndex: 8, question: "What energy conversion occurs as cathode rays accelerate?", options: ["Thermal to nuclear", "Electrical potential to kinetic", "Chemical to radiant", "Kinetic to potential"], correctAnswer: 1, points: 10 },
    { orderIndex: 9, question: "Increasing electrode voltage increases cathode ray speed.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 10, question: "What property shows cathode rays carry mechanical momentum?", options: ["Passing through glass", "Turning a paddle wheel", "Emitting light", "Changing color"], correctAnswer: 1, points: 10 },
    { orderIndex: 11, question: "The e/m ratio is identical for cathode rays from any cathode metal.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 12, question: "What is the mass of an electron relative to a proton?", options: ["~1/1836", "~1/100", "~1/2", "Equal"], correctAnswer: 0, points: 10 },
  ],

  // ── FOCUS AREA 2: Chemical Bonding ──────────────────────────────────────────

  "Model Ionic Bonds and Crystals": [
    { orderIndex: 1, question: "An ionic bond is an electrostatic attraction between:", options: ["Shared electrons", "Cations and anions", "Neutral atoms", "Two metals"], correctAnswer: 1, points: 10 },
    { orderIndex: 2, question: "Solid NaCl conducts electricity at room temperature.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 3, question: "When sodium reacts with chlorine, sodium:", options: ["Gains 1 electron", "Shares 2 electrons", "Loses 1 electron", "Gains 2 electrons"], correctAnswer: 2, points: 10 },
    { orderIndex: 4, question: "Ionic crystals have high melting points due to strong ionic bonds.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 5, question: "In a NaCl lattice, how many Cl⁻ ions surround each Na⁺ ion?", options: ["4", "2", "8", "6"], correctAnswer: 3, points: 10 },
    { orderIndex: 6, question: "Why do ionic compounds dissolve easily in water?", options: ["Ion-dipole attraction", "Non-polar interaction", "Covalent sharing", "Hydrogen gas release"], correctAnswer: 0, points: 10 },
    { orderIndex: 7, question: "Ionic bonding usually occurs between metals and non-metals.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 8, question: "Lattice energy is the energy released when:", options: ["Solid melts to liquid", "Gaseous ions form solid lattice", "Bonds break in gas", "Liquid boils to gas"], correctAnswer: 1, points: 10 },
    { orderIndex: 9, question: "Ionic solids are malleable and easily hammered into sheets.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 10, question: "Which compound is covalent rather than ionic?", options: ["NaCl", "MgO", "CaF₂", "CO₂"], correctAnswer: 3, points: 10 },
    { orderIndex: 11, question: "Magnesium (Mg) forms a stable ion by:", options: ["Losing 2 electrons", "Gaining 2 electrons", "Sharing 1 electron", "Losing 1 electron"], correctAnswer: 0, points: 10 },
    { orderIndex: 12, question: "Molten ionic compounds conduct electricity because ions are free to move.", options: ["True", "False"], correctAnswer: 0, points: 10 },
  ],

  // ── FOCUS AREA 3: Thermochemistry ──────────────────────────────────────────

  "Determine Enthalpy Changes and Calorific Values of Foods and Fuels": [
    { orderIndex: 1, question: "Exothermic reactions release heat and have ΔH < 0.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 2, question: "Which formula calculates heat absorbed by water in calorimetry?", options: ["q = mcΔT", "q = m/ΔT", "q = c/mΔT", "q = m + c + ΔT"], correctAnswer: 0, points: 10 },
    { orderIndex: 3, question: "Which food group provides the highest calorific value per gram?", options: ["Carbohydrates", "Proteins", "Fats", "Water"], correctAnswer: 2, points: 10 },
    { orderIndex: 4, question: "Calorific value measures heat released by burning 1 g of fuel.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 5, question: "If water temperature rises in a calorimeter, the reaction is:", options: ["Endothermic", "Isothermal", "Reversible", "Exothermic"], correctAnswer: 3, points: 10 },
    { orderIndex: 6, question: "What is the specific heat capacity of water in J/g°C?", options: ["1.00", "4.18", "2.10", "8.31"], correctAnswer: 1, points: 10 },
    { orderIndex: 7, question: "Uninsulated calorimeters cause heat loss, overestimating reaction enthalpy.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 8, question: "What is the standard unit for calorific value of fuel?", options: ["J/mol", "W/m", "kJ/kg", "N/m²"], correctAnswer: 2, points: 10 },
    { orderIndex: 9, question: "Complete combustion of a hydrocarbon produces CO₂ and H₂O.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 10, question: "How can heat loss be minimized during simple calorimetry?", options: ["Remove the lid", "Stir rapidly", "Add more fuel", "Use polystyrene insulation"], correctAnswer: 3, points: 10 },
    { orderIndex: 11, question: "If 200 g water heats up by 10°C, heat absorbed is (c = 4.18 J/g°C):", options: ["8,360 J", "836 J", "4,180 J", "83,600 J"], correctAnswer: 0, points: 10 },
    { orderIndex: 12, question: "Endothermic reactions absorb heat, causing surrounding temperature to drop.", options: ["True", "False"], correctAnswer: 0, points: 10 },
  ],

  "Constructing Energy Cycles and Born-Haber Cycles": [
    { orderIndex: 1, question: "Hess's Law states enthalpy change depends only on initial and final states.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 2, question: "In Born-Haber cycle for NaCl, Na(g) → Na⁺(g) + e⁻ is:", options: ["Atomization energy", "Electron affinity", "First ionization energy", "Lattice energy"], correctAnswer: 2, points: 10 },
    { orderIndex: 3, question: "Lattice energy for NaCl is the energy change for:", options: ["Na(s) → Na(g)", "Na⁺(g) + Cl⁻(g) → NaCl(s)", "½Cl₂(g) → Cl(g)", "NaCl(s) → NaCl(aq)"], correctAnswer: 1, points: 10 },
    { orderIndex: 4, question: "Lattice formation from gaseous ions is an endothermic process.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 5, question: "The energy required to turn ½Cl₂(g) into Cl(g) is:", options: ["Electron affinity", "Ionization energy", "Lattice energy", "Atomization energy"], correctAnswer: 3, points: 10 },
    { orderIndex: 6, question: "Hess's Law allows calculation of indirect reaction enthalpies.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 7, question: "Standard enthalpy of formation (ΔH°f) applies to forming:", options: ["1 mole compound from elements", "1 gram of compound", "1 mole gas from liquid", "2 moles of product"], correctAnswer: 0, points: 10 },
    { orderIndex: 8, question: "Electron affinity is the energy change when an atom:", options: ["Loses a proton", "Gains an electron", "Forms a covalent bond", "Melts"], correctAnswer: 1, points: 10 },
    { orderIndex: 9, question: "Bond dissociation energy is always positive (endothermic).", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 10, question: "On an enthalpy level diagram, a downward arrow indicates:", options: ["Endothermic step", "Constant energy", "Exothermic step", "Catalyst addition"], correctAnswer: 2, points: 10 },
    { orderIndex: 11, question: "Which combination gives the highest lattice energy?", options: ["Small ions, high charge", "Large ions, low charge", "Large ions, high charge", "Small ions, low charge"], correctAnswer: 0, points: 10 },
    { orderIndex: 12, question: "A closed loop in a Born-Haber cycle has a total enthalpy change of zero.", options: ["True", "False"], correctAnswer: 0, points: 10 },
  ],

  "Reactions of Acids and Bases (Neutralization)": [
    { orderIndex: 1, question: "Strong acid + strong base neutralization produces:", options: ["Salt + hydrogen", "Acid + oxygen", "Salt + water", "Base + CO₂"], correctAnswer: 2, points: 10 },
    { orderIndex: 2, question: "Standard molar neutralization enthalpy for strong acid/base is ~ −57.1 kJ/mol.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 3, question: "What is the net ionic equation for strong acid-strong base neutralization?", options: ["Na⁺ + Cl⁻ → NaCl", "H⁺ + OH⁻ → H₂O", "H₂O → H⁺ + OH⁻", "HCl + NaOH → NaCl + H₂O"], correctAnswer: 1, points: 10 },
    { orderIndex: 4, question: "Weak acid neutralization releases more heat than strong acid neutralization.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 5, question: "Why is neutralization enthalpy less negative for weak acids?", options: ["Heat lost to air", "Acid is too diluted", "Water boils off", "Energy used to ionize weak acid"], correctAnswer: 3, points: 10 },
    { orderIndex: 6, question: "What is the pH at equivalence point for strong acid vs strong base?", options: ["7.0", "1.0", "14.0", "4.5"], correctAnswer: 0, points: 10 },
    { orderIndex: 7, question: "Phenolphthalein turns pink in basic solutions.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 8, question: "Which ions act as spectator ions when HCl reacts with NaOH?", options: ["H⁺ and OH⁻", "H⁺ and Cl⁻", "Na⁺ and Cl⁻", "Na⁺ and OH⁻"], correctAnswer: 2, points: 10 },
    { orderIndex: 9, question: "All neutralization reactions are exothermic.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 10, question: "To find heat released during neutralization, measure:", options: ["Solution density", "Temperature change", "Color intensity", "Mass of beaker"], correctAnswer: 1, points: 10 },
    { orderIndex: 11, question: "What type of salt forms from weak acid + strong base?", options: ["Neutral salt", "Acidic salt", "Basic salt", "Double salt"], correctAnswer: 2, points: 10 },
    { orderIndex: 12, question: "Titration equivalence point occurs when moles of H⁺ equal moles of OH⁻.", options: ["True", "False"], correctAnswer: 0, points: 10 },
  ],

  // ── FOCUS AREA 4: Forces and Motion ────────────────────────────────────────

  "Paper Boats Motion Activity": [
    { orderIndex: 1, question: "Paddling water backwards to move a boat forward illustrates Newton's:", options: ["First Law", "Second Law", "Third Law", "Law of Gravity"], correctAnswer: 2, points: 10 },
    { orderIndex: 2, question: "A boat moving at constant velocity has zero net horizontal force.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 3, question: "Water resistance opposing boat motion is called:", options: ["Thrust", "Drag", "Tension", "Gravity"], correctAnswer: 1, points: 10 },
    { orderIndex: 4, question: "Using a larger paddle increases propulsive reaction force.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 5, question: "A paper boat floats because upthrust equals:", options: ["Surface tension", "Weight of boat", "Air pressure", "Paddle force"], correctAnswer: 1, points: 10 },
    { orderIndex: 6, question: "If thrust = 0.4 N and drag = 0.4 N, acceleration is:", options: ["0.8 m/s²", "0.4 m/s²", "0 m/s²", "-0.4 m/s²"], correctAnswer: 2, points: 10 },
    { orderIndex: 7, question: "Mass is a measure of an object's inertia.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 8, question: "According to Newton's 1st Law, a boat continues moving until acted on by:", options: ["Gravity only", "An unbalanced force", "Internal energy", "Water pressure"], correctAnswer: 1, points: 10 },
    { orderIndex: 9, question: "Drag force decreases as boat velocity increases.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 10, question: "If net force on a boat doubles while mass stays constant, acceleration:", options: ["Halves", "Quadruples", "Stays constant", "Doubles"], correctAnswer: 3, points: 10 },
    { orderIndex: 11, question: "A 0.05 kg boat experiencing 0.1 N net force accelerates at:", options: ["2 m/s²", "0.5 m/s²", "0.005 m/s²", "5 m/s²"], correctAnswer: 0, points: 10 },
  ],

  "Verifying Newton's laws": [
    { orderIndex: 1, question: "Newton's 1st Law is also known as the Law of Inertia.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 2, question: "In F = ma, F represents:", options: ["Net resultant force", "Friction only", "Applied force", "Weight"], correctAnswer: 0, points: 10 },
    { orderIndex: 3, question: "A 5 kg trolley accelerates at 3 m/s². What net force acts on it?", options: ["1.67 N", "8 N", "0.6 N", "15 N"], correctAnswer: 3, points: 10 },
    { orderIndex: 4, question: "Action and reaction forces act on the same object.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 5, question: "Why don't action-reaction force pairs cancel out?", options: ["Different magnitudes", "Act on different bodies", "Same direction", "Time delay"], correctAnswer: 1, points: 10 },
    { orderIndex: 6, question: "Acceleration is directly proportional to net force.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 7, question: "Keeping net force constant while adding mass to a trolley will:", options: ["Increase speed", "Stop motion", "Decrease acceleration", "Quadruple force"], correctAnswer: 2, points: 10 },
    { orderIndex: 8, question: "The slope of a velocity-time graph represents:", options: ["Displacement", "Acceleration", "Energy", "Momentum"], correctAnswer: 1, points: 10 },
    { orderIndex: 9, question: "If net force on an object is zero, its velocity must be zero.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 10, question: "Which example best illustrates Newton's 3rd Law?", options: ["Falling leaf", "Car turning", "Recoil of a gun", "Friction slowing a puck"], correctAnswer: 2, points: 10 },
    { orderIndex: 11, question: "If net force is doubled and mass is doubled, acceleration:", options: ["Doubles", "Halves", "Quadruples", "Remains unchanged"], correctAnswer: 3, points: 10 },
    { orderIndex: 12, question: "The SI unit of force is kg·m/s² (Newton).", options: ["True", "False"], correctAnswer: 0, points: 10 },
  ],

  // ── FOCUS AREA 5: Simple Harmonic Motion ───────────────────────────────────

  "Acceleration due to gravity": [
    { orderIndex: 1, question: "The period of a simple pendulum is independent of mass.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 2, question: "Formula for simple pendulum period T is:", options: ["2π√(g/L)", "2π√(L/g)", "2π√(m/k)", "2π(L/g)"], correctAnswer: 1, points: 10 },
    { orderIndex: 3, question: "Quadrupling a pendulum's length changes its period by a factor of:", options: ["4", "½", "2", "¼"], correctAnswer: 2, points: 10 },
    { orderIndex: 4, question: "Velocity of a pendulum bob is maximum at extreme positions.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 5, question: "From a T² vs L graph, acceleration due to gravity g equals:", options: ["4π² / slope", "slope / 4π²", "2π / slope", "slope²"], correctAnswer: 0, points: 10 },
    { orderIndex: 6, question: "A longer pendulum has a longer period.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 7, question: "Restoring force on a pendulum bob of mass m at angle θ is:", options: ["mg", "mg cosθ", "mg tanθ", "mg sinθ"], correctAnswer: 3, points: 10 },
    { orderIndex: 8, question: "A 1.0 m pendulum on Earth (g = 9.8 m/s²) has a period of approximately:", options: ["2.0 s", "1.0 s", "3.1 s", "0.5 s"], correctAnswer: 0, points: 10 },
    { orderIndex: 9, question: "At maximum displacement, kinetic energy of a pendulum is zero.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 10, question: "Why must pendulum displacement angle be small (< 10°)?", options: ["Prevent snapping", "Ensure sinθ ≈ θ for SHM", "Increase speed", "Eliminate gravity"], correctAnswer: 1, points: 10 },
    { orderIndex: 11, question: "To reduce timing error in a pendulum lab, a student should:", options: ["Time 1 swing", "Time 20 swings and divide", "Use larger bob", "Release from 45°"], correctAnswer: 1, points: 10 },
    { orderIndex: 12, question: "Helical spring period T = 2π√(m/k) depends on attached mass m.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 13, question: "Using a stiffer spring (larger k) in a spring-mass system makes the period:", options: ["Longer", "Zero", "Shorter", "Unchanged"], correctAnswer: 2, points: 10 },
  ],

  "Hooke's Law Experiment": [
    { orderIndex: 1, question: "Hooke's Law states extension is proportional to load up to elastic limit.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 2, question: "Gradient of a Force vs Extension graph represents:", options: ["Elastic limit", "Spring constant (k)", "Work done", "Mass"], correctAnswer: 1, points: 10 },
    { orderIndex: 3, question: "A spring with k = 40 N/m extended by 0.1 m has a restoring force of:", options: ["400 N", "0.25 N", "4 N", "40 N"], correctAnswer: 2, points: 10 },
    { orderIndex: 4, question: "Beyond elastic limit, permanent deformation occurs.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 5, question: "Elastic potential energy in a stretched spring is:", options: ["½kx²", "kx", "F/x", "½F/x"], correctAnswer: 0, points: 10 },
    { orderIndex: 6, question: "Restoring force acts in the same direction as extension.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 7, question: "Readings are taken during loading and unloading to:", options: ["Measure speed", "Find room temp", "Check for permanent set", "Increase spring stiffness"], correctAnswer: 2, points: 10 },
    { orderIndex: 8, question: "A 5 N load extends a spring by 0.1 m. Its spring constant k is:", options: ["0.5 N/m", "5 N/m", "25 N/m", "50 N/m"], correctAnswer: 3, points: 10 },
    { orderIndex: 9, question: "Two identical springs in parallel are stiffer than a single spring.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 10, question: "What happens to the Force-Extension slope past the elastic limit?", options: ["Stays linear", "Flattens/curves", "Becomes vertical", "Reverses"], correctAnswer: 1, points: 10 },
    { orderIndex: 11, question: "Area under a Force vs Extension graph represents:", options: ["Spring constant", "Strain", "Energy stored", "Stress"], correctAnswer: 2, points: 10 },
    { orderIndex: 12, question: "Elastic limit is the maximum force without permanent stretch.", options: ["True", "False"], correctAnswer: 0, points: 10 },
  ],

  // ── FOCUS AREA 6: Capacitors ───────────────────────────────────────────────

  "Series and Parallel Connections of Capacitors": [
    { orderIndex: 1, question: "Two 10 μF capacitors connected in series have total capacitance:", options: ["20 μF", "5 μF", "10 μF", "1 μF"], correctAnswer: 1, points: 10 },
    { orderIndex: 2, question: "Capacitors in parallel share the same voltage.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 3, question: "Total capacitance for parallel capacitors C₁ and C₂ is:", options: ["C₁ + C₂", "1/(C₁ + C₂)", "C₁C₂", "C₁/C₂"], correctAnswer: 0, points: 10 },
    { orderIndex: 4, question: "Capacitors in series store the same charge Q.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 5, question: "Connecting capacitors in parallel instead of series:", options: ["Decreases charge", "Decreases capacitance", "Increases capacitance", "Has no effect"], correctAnswer: 2, points: 10 },
    { orderIndex: 6, question: "A 6 μF and 3 μF capacitor in series have equivalent capacitance of:", options: ["9 μF", "18 μF", "4.5 μF", "2 μF"], correctAnswer: 3, points: 10 },
    { orderIndex: 7, question: "In series, voltage across each capacitor is always equal regardless of capacitance.", options: ["True", "False"], correctAnswer: 1, points: 10 },
    { orderIndex: 8, question: "Adding a second identical capacitor in parallel across a battery:", options: ["Halves energy", "Doubles total charge", "Halves voltage", "Zeroes current"], correctAnswer: 1, points: 10 },
    { orderIndex: 9, question: "Energy stored in a capacitor is E = ½CV².", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 10, question: "Formula for energy stored in a capacitor given charge Q and voltage V:", options: ["Q/V", "½QV", "QV²", "½Q²V"], correctAnswer: 1, points: 10 },
    { orderIndex: 11, question: "What happens to capacitance C when plate area A is doubled?", options: ["Halves", "Quadruples", "Unchanged", "Doubles"], correctAnswer: 3, points: 10 },
    { orderIndex: 12, question: "Increasing plate separation d increases capacitance.", options: ["True", "False"], correctAnswer: 1, points: 10 },
  ],

  "Behaviour of a Capacitor in DC and AC Circuits": [
    { orderIndex: 1, question: "In a DC circuit, a fully charged capacitor:", options: ["Conducts continuously", "Blocks current flow", "Short-circuits", "Generates voltage"], correctAnswer: 1, points: 10 },
    { orderIndex: 2, question: "A capacitor acts as an open circuit to steady DC.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 3, question: "Capacitive reactance Xc is defined as:", options: ["2πfC", "1/(2πfC)", "f/2πC", "2π/fC"], correctAnswer: 1, points: 10 },
    { orderIndex: 4, question: "As AC frequency increases, capacitive reactance Xc:", options: ["Increases", "Remains constant", "Becomes infinite", "Decreases"], correctAnswer: 3, points: 10 },
    { orderIndex: 5, question: "A capacitor passes AC because it repeatedly charges and discharges.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 6, question: "In a purely capacitive AC circuit, current leads voltage by:", options: ["90°", "0°", "180°", "45°"], correctAnswer: 0, points: 10 },
    { orderIndex: 7, question: "Capacitors can be used to block DC while passing AC signals.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 8, question: "During DC charging of an RC circuit, current:", options: ["Grows linearly", "Drops exponentially", "Remains constant", "Oscillates"], correctAnswer: 1, points: 10 },
    { orderIndex: 9, question: "Unit of capacitive reactance Xc is:", options: ["Farad (F)", "Henry (H)", "Ohm (Ω)", "Hertz (Hz)"], correctAnswer: 2, points: 10 },
    { orderIndex: 10, question: "Discharging a capacitor through a resistor causes voltage to decay exponentially.", options: ["True", "False"], correctAnswer: 0, points: 10 },
    { orderIndex: 11, question: "If AC frequency is doubled, capacitive reactance Xc becomes:", options: ["Double", "Four times", "Half", "Zero"], correctAnswer: 2, points: 10 },
    { orderIndex: 12, question: "In a capacitive AC circuit, power factor is zero.", options: ["True", "False"], correctAnswer: 0, points: 10 },
  ],
};

const seedData: SeedCollection[] = [
  {
    name: "Physics",
    level: "Year One",
    description: "Senior High School 1 Physics curriculum covering mechanics, physical quantities, thermometry, optics, electrostatics, and introductory atomic physics.",
    modules: [
      { title: "Measurement of Physical Quantities", checkpoints: [] },
      { title: "Paper Boats Motion Activity", description: "Explore propulsion, fluid resistance (drag), and Newton's laws of motion through interactive paper boat activities on water.", checkpoints: checkpoints["Paper Boats Motion Activity"] },
      { title: "Pressure Changes with Depth", checkpoints: [] },
      { title: "Measuring Temperature with Thermometers", checkpoints: [] },
      { title: "Locating Images in a Plane Mirror", checkpoints: [] },
      { title: "Establishing the Laws of Reflection", checkpoints: [] },
      { title: "Images Formed by Inclined Mirrors", checkpoints: [] },
      { title: "Refraction of Light in Water", checkpoints: [] },
      { title: "Determine the Refractive Index of a Rectangular Prism", checkpoints: [] },
      { title: "Detecting Charge with a Gold Leaf Electroscope", checkpoints: [] },
      { title: "Categorising Conductors, Semiconductors and Insulators", checkpoints: [] },
      { title: "Categorising Magnetic and Non-magnetic Materials", checkpoints: [] },
      { title: "Suspend a Bar Magnet", checkpoints: [] },
      { title: "Magnetic Field Lines using Iron Filings", checkpoints: [] },
      { title: "Making an Electromagnet", checkpoints: [] },
      { title: "Applications of BJTs", checkpoints: [] },
      { title: "Construct Transistor Configuration Circuits", checkpoints: [] },
      { title: "Electron Transition Simulation", checkpoints: [] },
      { title: "Radioactive Decay Simulation", checkpoints: [] },
    ],
  },
  {
    name: "Physics",
    level: "Year Two",
    description: "Senior High School 2 Physics curriculum covering density, flotation, elasticity, thermal physics, sound waves, capacitors, electromagnetism, and digital electronics.",
    modules: [
      { title: "Determination of Density", checkpoints: [] },
      { title: "Determine Upthrust and State Archimedes' Principle", checkpoints: [] },
      { title: "Principle of Flotation", checkpoints: [] },
      { title: "Hooke's Law Experiment", description: "Verify Hooke's law by measuring spring extension under load, determining spring constants, and finding elastic limits.", checkpoints: checkpoints["Hooke's Law Experiment"] },
      { title: "Determine Coefficient of Friction", checkpoints: [] },
      { title: "Determine Specific Heat Capacities Using Method of Mixtures", checkpoints: [] },
      { title: "Determine Specific Latent Heat of Fusion of Ice", checkpoints: [] },
      { title: "Determine Speed of Sound Using Resonance Tube/Sonometer", checkpoints: [] },
      { title: "Series and Parallel Connections of Capacitors", description: "Investigate total capacitance, charge distribution, and potential difference across capacitors in series and parallel.", checkpoints: checkpoints["Series and Parallel Connections of Capacitors"] },
      { title: "Behaviour of a Capacitor in DC and AC Circuits", description: "Analyze capacitor charging/discharging curves in DC circuits and capacitive reactance (Xc) in AC circuits.", checkpoints: checkpoints["Behaviour of a Capacitor in DC and AC Circuits"] },
      { title: "Magnetic Field Around Current-Carrying Conductors", checkpoints: [] },
      { title: "Forces Between Parallel Current-Carrying Conductors", checkpoints: [] },
      { title: "Construct a Basic Electric Motor", checkpoints: [] },
      { title: "7-segment Display Module", checkpoints: [] },
      { title: "Logic Gates and Truth Tables", checkpoints: [] },
      { title: "Design and Fabricate a Simple IC", checkpoints: [] },
    ],
  },
  {
    name: "Physics",
    level: "SHS 3",
    description: "Senior High School 3 Physics curriculum covering rotational mechanics, gravitation, simple harmonic motion, circuit analysis, electromagnetic induction, and AC electronics.",
    modules: [
      { title: "Establishing principle of moments", checkpoints: [] },
      { title: "Acceleration due to gravity", description: "Determine acceleration due to gravity (g) by recording simple pendulum oscillation periods across varying lengths.", checkpoints: checkpoints["Acceleration due to gravity"] },
      { title: "Verifying Newton's laws", description: "Verify Newton's laws of motion using dynamic carts, ticker timers, and hanging masses to confirm F = ma.", checkpoints: checkpoints["Verifying Newton's laws"] },
      { title: "Relationship between voltage and current", checkpoints: [] },
      { title: "Series/parallel resistors", checkpoints: [] },
      { title: "Adapting galvanometers", checkpoints: [] },
      { title: "Verifying laws of induction", checkpoints: [] },
      { title: "Transformer operation", checkpoints: [] },
      { title: "Half wave rectifiers", checkpoints: [] },
    ],
  },
  {
    name: "Chemistry",
    level: "SHS 1",
    description: "Senior High School 1 Chemistry curriculum covering atomic theory, stoichiometry, gas laws, solubility, periodic trends, and ionic bonding.",
    modules: [
      { title: "Model Dalton's Atom and Orbitals", description: "Construct 3D visual models of s, p, and d electron orbitals and explore Dalton's atomic postulates.", checkpoints: checkpoints["Model Dalton's Atom and Orbitals"] },
      { title: "Prepare Standard Solutions", checkpoints: [] },
      { title: "Conservation of Mass Experiment", checkpoints: [] },
      { title: "Cathode Rays Simulation", description: "Simulate J.J. Thomson's cathode ray tube experiments to determine electron charge-to-mass ratio and atomic structure.", checkpoints: checkpoints["Cathode Rays Simulation"] },
      { title: "Determine Mass using a Beam Balance", checkpoints: [] },
      { title: "Determine Melting & Boiling Points", checkpoints: [] },
      { title: "Investigate Rate of Diffusion", checkpoints: [] },
      { title: "Laboratory Preparation of Gases", checkpoints: [] },
      { title: "Investigate Factors Affecting Solubility", checkpoints: [] },
      { title: "Test for Cations and Anions", checkpoints: [] },
      { title: "Model Ionic Bonds and Crystals", description: "Build 3D crystal lattice models of sodium chloride to demonstrate ionic bonding forces and crystal stoichiometry.", checkpoints: checkpoints["Model Ionic Bonds and Crystals"] },
    ],
  },
  {
    name: "Chemistry",
    level: "SHS 2",
    description: "Senior High School 2 Chemistry curriculum covering thermochemistry, chemical kinetics, chemical equilibria, acid-base chemistry, and organic hydrocarbons.",
    modules: [
      { title: "Constructing Energy Cycles and Born-Haber Cycles", description: "Construct Born-Haber thermodynamic energy cycles to calculate lattice energy, ionization energy, and electron affinity.", checkpoints: checkpoints["Constructing Energy Cycles and Born-Haber Cycles"] },
      { title: "Determine Enthalpy Changes and Calorific Values of Foods and Fuels", description: "Measure combustion heats and calorific values of food samples and liquid fuels using calorimetry.", checkpoints: checkpoints["Determine Enthalpy Changes and Calorific Values of Foods and Fuels"] },
      { title: "Investigate Factors Affecting Rate of Reaction", checkpoints: [] },
      { title: "Reversible Reaction of Anhydrous Copper (II) Tetraoxosulphate (VI)", checkpoints: [] },
      { title: "Reactions of Acids and Bases (Neutralization)", description: "Measure molar heat of neutralization during acid-base neutralization reactions using calorimetry.", checkpoints: checkpoints["Reactions of Acids and Bases (Neutralization)"] },
      { title: "Preparation of Soluble and Insoluble Salts", checkpoints: [] },
      { title: "Determine Quantity of Analyte via Acid-Base Titrations", checkpoints: [] },
      { title: "Thermal Stability of Carbonates and Nitrates", checkpoints: [] },
      { title: "Distinguish Alkanes and Alkenes using Bromine Water", checkpoints: [] },
      { title: "Design an Alcohol Breath alyser", checkpoints: [] },
      { title: "Preparation of Alkanols (Ethanol via Fermentation)", checkpoints: [] },
      { title: "Reactions of Alkanoic Acids and Preparation of Esters", checkpoints: [] },
    ],
  },
  {
    name: "Chemistry",
    level: "SHS 3",
    description: "Senior High School 3 Chemistry curriculum covering buffers, electrochemistry, redox titrations, transition metal chemistry, and functional organic compounds.",
    modules: [
      { title: "Preparation of Buffer Solutions", checkpoints: [] },
      { title: "Selecting Suitable Acid-Base Indicators for Titration", checkpoints: [] },
      { title: "Illustrate Reactivity of Metals Experimentally", checkpoints: [] },
      { title: "Perform Oxidation and Reduction Titrations", checkpoints: [] },
      { title: "Determine EMF of a Voltaic Cell", checkpoints: [] },
      { title: "Investigate Electrolysis of Aqueous Solutions", checkpoints: [] },
      { title: "Demonstrate Electroplating", checkpoints: [] },
      { title: "Investigate Conditions for Rusting and Rate of Rusting", checkpoints: [] },
      { title: "Catalytic Behaviour of Transition Elements", checkpoints: [] },
      { title: "Complex Formation and Solubility of Insoluble Species", checkpoints: [] },
      { title: "Preparation of Alkyl Alkanoate (Ethyl Ethanoate)", checkpoints: [] },
      { title: "Preparation of Soap (Saponification)", checkpoints: [] },
      { title: "Test for Reducing Sugars", checkpoints: [] },
      { title: "Synthesis of a Nylon Rope", checkpoints: [] },
    ],
  },
];

async function main() {
  console.log("🌱 Starting Open Learn XR database seed...");

  const adminEmail = "admin@openlearn.org";
  const adminPassword = "1234567890";
  const adminName = "Admin User";
  const orgSlug = "open-learn-academy";

  // 1. Quick Guard Check
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (adminUser) {
    console.log(`ℹ️ Seed skipped: Admin user already exists (${adminUser.id}).`);
    return;
  }

  // 2. Create User + Credentials
  console.log(`👤 Creating admin user (${adminEmail})...`);
  const signUpResult = await auth.api.signUpEmail({
    body: {
      email: adminEmail,
      password: adminPassword,
      name: adminName,
    },
  });

  adminUser = await prisma.user.update({
    where: { id: signUpResult.user.id },
    data: {
      role: "user,admin",
      image: "avatar-01",
      onboarded: true,
      emailVerified: true,
    },
  });
  console.log(`✅ Admin user created (ID: ${adminUser.id})`);

  // 3. Create Organization, Member (Owner), & Unlimited Subscription via Nested Write
  console.log("🏢 Creating Organization with Owner Membership & Unlimited Subscription...");
  const organization = await prisma.organization.create({
    data: {
      name: "Open Learn Academy",
      slug: orgSlug,
      logo: "org-01",
      members: {
        create: {
          userId: adminUser.id,
          role: "owner",
        },
      },
      subscriptions: {
        create: {
          tier: "UNLIMITED",
          status: "ACTIVE",
          isUnlimited: true,
          seats: 0,
        },
      },
    },
  });
  console.log(`✅ Organization, Member, and Subscription created (Org ID: ${organization.id})`);

  // 4. Create Collections, Modules, ModuleVersions, and Checkpoints
  console.log("📚 Seeding 6 Collections and 81 Modules with ModuleVersions & Checkpoints...");
  for (const item of seedData) {
    const collectionSlug = getUniqueSlug(`${item.name}-${item.level}`, false);
    const totalCheckpoints = item.modules.reduce((sum, m) => sum + m.checkpoints.length, 0);

    console.log(`  ├─ Creating Collection: ${item.name} [${item.level}] (${item.modules.length} modules, ${totalCheckpoints} checkpoints)...`);

    await prisma.collection.create({
      data: {
        name: item.name,
        slug: collectionSlug,
        description: item.description,
        level: item.level,
        modules: {
          create: item.modules.map((m, index) => {
            const hasCheckpoints = m.checkpoints.length > 0;
            return {
              title: m.title,
              slug: getUniqueSlug(`${m.title}-${item.name}-${item.level}`, false),
              description: m.description ?? `${m.title} module for ${item.name} (${item.level}).`,
              orderIndex: index + 1,
              versions: {
                create: [
                  {
                    versionNumber: 1,
                    status: hasCheckpoints ? "PUBLISHED" : "DRAFT",
                    publishedAt: hasCheckpoints ? new Date() : null,
                    createdById: adminUser.id,
                    interactiveConfig: {},
                    notes: {},
                    changeNote: hasCheckpoints
                      ? "Initial published version with checkpoints."
                      : "Initial draft version.",
                    checkpoints: {
                      create: m.checkpoints,
                    },
                  },
                ],
              },
            };
          }),
        },
      },
    });
  }

  // 5. Link publishedVersionId back to Module for all PUBLISHED versions
  console.log("🔗 Linking publishedVersionId for published modules...");
  const publishedVersions = await prisma.moduleVersion.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, moduleId: true },
  });

  for (const ver of publishedVersions) {
    await prisma.module.update({
      where: { id: ver.moduleId },
      data: { publishedVersionId: ver.id },
    });
  }
  console.log(`✅ Linked ${publishedVersions.length} published module versions to their parent modules.`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
