/** Shared structured blocks for landscape deck-family Pro PDFs (Memo §4, Audit §3). */
export type TensionPair = {
  tension: string
  resolution: string
}

export function parseTensionResolutionBody(body: string): TensionPair | null {
  const tensionMatch = body.match(/^Tension:\s*(.+?)(?:\nResolution:|$)/s)
  const resolutionMatch = body.match(/\nResolution:\s*(.+)$/s)
  if (!tensionMatch?.[1]?.trim()) return null
  return {
    tension: tensionMatch[1].trim(),
    resolution: resolutionMatch?.[1]?.trim() ?? '',
  }
}

export function firstSentence(text: string): string {
  const match = text.match(/^(.+?[.!?])(?:\s|$)/)
  return match?.[1]?.trim() ?? text.trim()
}
