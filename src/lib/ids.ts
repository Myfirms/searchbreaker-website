/** Stable, human-readable element id from a heading, e.g. "How the search works" -> "sb-how-the-search-works". */
export function makeId(prefix: string, text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `${prefix}-${slug || 'section'}`;
}
