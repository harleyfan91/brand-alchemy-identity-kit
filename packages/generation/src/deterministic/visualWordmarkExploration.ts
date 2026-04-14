/**
 * Deterministic “type-only” exploration layouts for Style Guide PDF
 * (Visual direction — logo note row). Text + sizing only; colors are applied in PDF.
 *
 * Stacked lockup: the **primary line sets a target set-width** (heuristic, pt). The second line
 * uses a **linear width model** in font size (no real shaping) so we can solve **one** font size
 * that approximates that target — no shrink/grow loops, no letter-spacing ramps. PDF never sets a
 * hard `width` on `<Text>` (avoids hyphenation).
 */

export type WordmarkExplorationSingle = {
  kind: 'single'
  caption: string
  text: string
  fontSize: number
  fontWeight?: 400 | 500 | 600 | 700
  letterSpacing?: number
}

export type WordmarkExplorationStacked = {
  kind: 'stacked'
  caption: string
  top: string
  bottom: string
  topSize: number
  /** Preferred secondary size (reference / UI cap pairing). */
  bottomSize: number
  /** Font size for the second line: solved so estimated width ≈ anchor (within min/max). */
  bottomDisplaySize: number
  bottomLetterSpacing?: number
  /**
   * Target set-width (pt) taken from the primary line — second line is scaled to match this
   * in the linear model only; do not use as `Text` `width` in PDF.
   */
  lockupWidthPt: number
}

export type WordmarkExplorationTile = WordmarkExplorationSingle | WordmarkExplorationStacked

const DEFAULT_DISPLAY_NAME = 'Your business name'

function significantWords(raw: string): string[] {
  return raw
    .trim()
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w))
}

function alphanumericCore(word: string): string {
  return word.replace(/[^A-Za-z0-9]/g, '')
}

function toTitleToken(word: string): string {
  const core = word.replace(/[^A-Za-z0-9]/g, '') || word
  if (!core) return word
  const lower = core.toLowerCase()
  return core.charAt(0).toUpperCase() + lower.slice(1)
}

function initialsFromWords(words: string[]): string {
  const parts = words
    .map((w) => alphanumericCore(w))
    .filter((c) => c.length > 0)
    .map((c) => c.charAt(0).toUpperCase())
  return parts.slice(0, 4).join('')
}

function letterCount(s: string): number {
  return s.replace(/\s/g, '').length
}

/** Estimated set-width (pt) at `fontSize` — linear in size; coefficients are a crude stand-in for shaping. */
function estimateLineWidth(text: string, fontSize: number, mode: 'title' | 'bold'): number {
  const spaces = (text.match(/ /g) ?? []).length
  const letters = text.replace(/\s/g, '').length
  const perLetter = mode === 'title' ? 0.47 : 0.55
  const perSpace = mode === 'title' ? 0.26 : 0.28
  return letters * fontSize * perLetter + spaces * fontSize * perSpace
}

/** ∂width/∂fontSize for bold line (same coefficients as `estimateLineWidth` for bold). */
function boldWidthPerPt(bottom: string): number {
  const spaces = (bottom.match(/ /g) ?? []).length
  const letters = bottom.replace(/\s/g, '').length
  return letters * 0.55 + spaces * 0.28
}

function trackingInkWidth(bottom: string, letterSpacing: number): number {
  return letterSpacing * letterCount(bottom) * 0.12
}

/**
 * Predetermined anchor: primary line estimated width, lightly padded.
 * Second line font size is solved so (bold estimate + fixed tracking) ≈ this value.
 */
function anchorTargetWidthPt(top: string, topSize: number): number {
  const w = estimateLineWidth(top, topSize, 'title')
  return Math.min(132, Math.max(26, w * 1.02))
}

/**
 * `estimateLineWidth(bottom, s, bold) + trackingInk ≈ anchorW` with linear model ⇒
 * `s ≈ (anchorW - trackingInk) / boldWidthPerPt`, then clamp.
 *
 * A very short second line cannot reach an extremely wide first line at any sane font size; we cap
 * at `topSize` for a single-token tail so it gets as close as the model allows without wrapping.
 */
function solveBottomFontSizeForAnchor(
  bottom: string,
  top: string,
  anchorW: number,
  letterSpacing: number,
  bottomSizePreferred: number,
  topSize: number,
): number {
  const coeff = boldWidthPerPt(bottom)
  const tw = trackingInkWidth(bottom, letterSpacing)
  const body = Math.max(1, anchorW - tw)
  const raw = coeff > 0.01 ? body / coeff : bottomSizePreferred
  const minS = 5.15
  const singleTokenTail = bottom.trim().split(/\s+/).length === 1
  const shortVsTop = letterCount(bottom) < letterCount(top) * 0.85
  /** Single short word under a long first line: may use full headline size to approach the anchor. */
  const maxS =
    singleTokenTail && shortVsTop
      ? topSize
      : Math.min(topSize * 0.94, Math.max(bottomSizePreferred + 3.5, topSize * 0.72))
  const clamped = Math.min(maxS, Math.max(minS, raw))
  return Math.round(clamped * 20) / 20
}

function stackedTile(
  top: string,
  bottom: string,
  topSize: number,
  bottomSize: number,
  baseTracking: number,
): WordmarkExplorationStacked {
  const lockupWidthPt = anchorTargetWidthPt(top, topSize)
  const bottomDisplaySize = solveBottomFontSizeForAnchor(
    bottom,
    top,
    lockupWidthPt,
    baseTracking,
    bottomSize,
    topSize,
  )
  return {
    kind: 'stacked',
    caption: 'Stacked',
    top,
    bottom,
    topSize,
    bottomSize,
    bottomDisplaySize,
    bottomLetterSpacing: Math.round(baseTracking * 100) / 100,
    lockupWidthPt,
  }
}

/**
 * Three small tiles: hero letterform, compact mark, stacked hierarchy.
 * Safe for empty names; avoids duplicate hero vs initials when possible.
 */
export function computeWordmarkExplorationTiles(rawName: string): WordmarkExplorationTile[] {
  const trimmed = rawName.trim()
  const displayName = trimmed.length > 0 ? trimmed : DEFAULT_DISPLAY_NAME
  const words = significantWords(displayName)

  if (words.length === 0) {
    return [
      { kind: 'single', caption: 'Letterform', text: '?', fontSize: 28, fontWeight: 400 },
      { kind: 'single', caption: 'Wordmark', text: displayName, fontSize: 9, fontWeight: 600, letterSpacing: 1.2 },
      stackedTile(displayName, displayName, 11, 7, 0.22),
    ]
  }

  const cores = words.map((w) => alphanumericCore(w)).filter((c) => c.length > 0)
  const firstLetter = (cores[0]?.charAt(0) ?? '?').toUpperCase()
  const initials = initialsFromWords(words)

  if (words.length >= 2) {
    const topLine = toTitleToken(words[0])
    const bottomLine = words.slice(1).map(toTitleToken).join(' ')
    return [
      { kind: 'single', caption: 'Letterform', text: firstLetter, fontSize: 26, fontWeight: 400 },
      {
        kind: 'single',
        caption: 'Monogram',
        text: initials || firstLetter,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 1.85,
      },
      stackedTile(topLine, bottomLine, 12, 7.5, 0.12),
    ]
  }

  // Single word
  const w = words[0]
  const core = cores[0] ?? alphanumericCore(w)
  const title = toTitleToken(w)
  const upperWord = core.toUpperCase()
  const hero = firstLetter
  const initialsOne = initialsFromWords(words)

  let compact: WordmarkExplorationSingle
  if (initialsOne.length <= 1 && core.length >= 2) {
    compact = {
      kind: 'single',
      caption: 'Tight caps',
      text: upperWord,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.55,
    }
  } else {
    compact = {
      kind: 'single',
      caption: 'Monogram',
      text: initialsOne,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: 1.75,
    }
  }

  return [
    { kind: 'single', caption: 'Letterform', text: hero, fontSize: 26, fontWeight: 400 },
    compact,
    stackedTile(title, upperWord, 12, 7, 0.14),
  ]
}
