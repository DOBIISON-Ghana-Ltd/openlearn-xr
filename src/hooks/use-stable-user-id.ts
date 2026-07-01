'use client';

import { useEffect, useState } from 'react';

const ANON_ID_KEY = 'openlearn-anon-id';

/**
 * Returns a stable user ID for the current browser.
 * - If the user is authenticated, returns their real user ID.
 * - If anonymous, generates a UUID and persists it in localStorage
 *   so it survives page refreshes.
 */
export function useStableUserId(authenticatedId?: string | null): string | null {
  const [anonId, setAnonId] = useState<string | null>(null);

  useEffect(() => {
    if (authenticatedId) return; // real user — no need for anon id

    const stored = localStorage.getItem(ANON_ID_KEY);
    if (stored) {
      setAnonId(stored);
    } else {
      const id = `anon_${crypto.randomUUID()}`;
      localStorage.setItem(ANON_ID_KEY, id);
      setAnonId(id);
    }
  }, [authenticatedId]);

  return authenticatedId ?? anonId;
}
