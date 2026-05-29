/** Trim and collapse internal whitespace for prompt-boundary strings. */
export function normalizePromptText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

/** Truncate at a word boundary when prose exceeds the section cap. */
export function truncateAtWordBoundary(text: string, maxChars: number): string {
  const trimmed = text.trim()
  if (trimmed.length <= maxChars) return trimmed
  const slice = trimmed.slice(0, maxChars)
  const lastSpace = slice.lastIndexOf(' ')
  if (lastSpace > maxChars * 0.6) return `${slice.slice(0, lastSpace).trim()}…`
  return `${slice.trim()}…`
}
