import { customAlphabet } from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Generates a random, all-caps, 6-character alphanumeric join code.
 */
export const generateJoinCode = customAlphabet(alphabet, 6);
