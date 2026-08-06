export type PlayRouteParamsResult =
  | { isCorrect: false }
  | {
      isCorrect: true;
      data:
        | { mode: 'module'; id: string }
        | { mode: 'session'; id: string | null };
    };

export function verifyPlayRouteParams(slug?: string[]): PlayRouteParamsResult {
  if (!slug || !Array.isArray(slug) || slug.length === 0) {
    return { isCorrect: false };
  }

  const [mode, idParam] = slug;

  if (mode === 'session') {
    // For session: slug can have length 1 (id is null) or 2 (id is string)
    if (slug.length === 1) {
      return {
        isCorrect: true,
        data: { mode: 'session', id: null },
      };
    }

    if (slug.length === 2) {
      const id = idParam && idParam.trim() !== '' ? idParam.trim() : null;
      return {
        isCorrect: true,
        data: { mode: 'session', id },
      };
    }

    return { isCorrect: false };
  }

  if (mode === 'module') {
    // For module: id at index 1 is required (must be length 2 and non-empty)
    if (slug.length !== 2) {
      return { isCorrect: false };
    }

    if (!idParam || typeof idParam !== 'string' || idParam.trim() === '') {
      return { isCorrect: false };
    }

    return {
      isCorrect: true,
      data: { mode: 'module', id: idParam.trim() },
    };
  }

  return { isCorrect: false };
}
