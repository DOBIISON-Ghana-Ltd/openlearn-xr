import { customAlphabet } from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Generates a random, all-caps, 7-character alphanumeric join code.
 */
export const generateJoinCode = customAlphabet(alphabet, 7);
