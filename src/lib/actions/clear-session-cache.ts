import { cookies } from "next/headers";

/**
 * Resets/clears Better Auth session cache cookies so that subsequent calls
 * to auth.api.getSession read fresh records from the database.
 */
export async function clearSessionCache() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("better-auth.session_data");
  } catch (err) {
    console.error("Failed to clear session cache cookies:", err);
  }
}
