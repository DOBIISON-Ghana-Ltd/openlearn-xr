import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

export const JOIN_CODE_REGEX = /^[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}$/;

export const joinCode = {
  regex: JOIN_CODE_REGEX,
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
    return JOIN_CODE_REGEX.test(code);
  },

  /**
   * Formats an input string into the 3-group dashed format (xxxx-xxxx-xxxx).
   */
  format: (input: string): string => {
    const cleaned = input.replace(/[^0-9a-zA-Z]/g, "").slice(0, 12).toLowerCase();
    if (!cleaned) return "";

    const chunks = cleaned.match(/.{1,4}/g);
    let formatted = chunks ? chunks.join("-") : "";

    if (input.endsWith("-") && (cleaned.length === 4 || cleaned.length === 8)) {
      formatted += "-";
    }

    return formatted;
  },
};
