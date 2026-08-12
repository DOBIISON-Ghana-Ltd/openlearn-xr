const ADJECTIVES = [
  "Quantum", "Stellar", "Curious", "Orbit", "Energetic", "Infinite", "Nexus", "Cosmic",
  "Atomic", "Kinetic", "Magnetic", "Prismatic", "Radiant", "Synthetic", "Vector", "Apex"
];

const NOUNS = [
  "Discovery Lab", "Physics Realm", "Atom Exploration", "Dynamics Hub", "Reaction Chamber",
  "Mechanics Studio", "Gravity Quest", "Photon Matrix", "Lab Workshop", "Science Portal"
];

/**
 * Generates a meaningful random session name phrase.
 * Example: "Quantum Discovery Lab", "Stellar Physics Realm"
 */
export function generateSessionName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
}
