import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

export const joinCode = {
  /**
   * Generates a 12-character lowercase alphanumeric join code separated into 3 groups of 4 characters by dashes.
   * Example: "x9k3-p27m-4q1v"
   */
  generate: (): string => {
    const raw = customAlphabet(alphabet, 12)();
    return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
  },

  /**
   * Validates whether a given string matches the join code structure (12 lowercase alphanumeric characters in 3 groups of 4 separated by dashes).
   */
  check: (code: string): boolean => {
    return /^[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}$/.test(code);
  },
};

/**
 * Backward compatibility export
 */
export const generateJoinCode = joinCode.generate;
