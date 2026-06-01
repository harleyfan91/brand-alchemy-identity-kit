/** Split imagery prose into an italic lead + bullet lines for folio 05. */
export function parseImageryEditorialBody(body: string): { lead: string; bullets: string[] } {
  const text = body.trim()
  if (!text) return { lead: '', bullets: [] }

  const sentences =
    text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [text]

  let lead = sentences[0] ?? ''
  const bullets: string[] = []

  const colonIdx = lead.indexOf(':')
  if (colonIdx > 0 && colonIdx < lead.length - 2) {
    const afterColon = lead.slice(colonIdx + 1).trim()
    lead = lead.slice(0, colonIdx + 1)
    if (afterColon) {
      const normalized = afterColon.replace(/\.$/, '')
      bullets.push(`${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}.`)
    }
  }

  for (const sentence of sentences.slice(1)) {
    const s = sentence.trim()
    if (s) bullets.push(s.endsWith('.') ? s : `${s}.`)
  }

  return { lead, bullets }
}

export function parseBulletLines(body: string): string[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('• '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)
}
