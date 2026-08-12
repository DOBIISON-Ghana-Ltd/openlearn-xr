export function parsePlaySlug(slug?: string[]) {
  if (!slug || !Array.isArray(slug)) {
    return { mode: "", playId: "", playerId: undefined };
  }
  return {
    mode: slug[0] || "",
    playId: slug[1] || "",
    playerId: slug[2] || undefined,
  };
}
