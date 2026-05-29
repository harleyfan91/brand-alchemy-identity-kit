/**
 * Deterministic composer for folio 02a (Look — Color) narrow-column summary.
 *
 * Produces the folio 02a narrow-column summary:
 *
 *   - `paletteName` — buyer's wizard palette name (header on folio 02a; no period).
 *   - `systemCharacter` — descriptor + templated tonal-arc closer (descriptor from
 *     `PALETTE_CATALOG`; closing sentence ranks swatches by L* and reads them through
 *     a style-driven adjective).
 *   - `usageDiscipline` — how to apply it. One entry from a hand-authored
 *     `(tonePreset × selectedStyle)` dictionary (3 × 4 = 12 entries) that
 *     mirrors the redo Para 2. Descriptive language only ("the deepest
 *     tones", "the boldest tone", "the brightest swatch", "the punctuation
 *     color", "the loudest hue") — never the role nouns Primary / Supporting
 *     / Accent / Canvas, and never the lowercase "accent" leftover from the
 *     retired role taxonomy. Em-dashes are capped at one per paragraph
 *     across all reader-facing copy (see core-pdfs.test.ts).
 *
 * Inputs are `paletteId`, `tonePreset`, `selectedStyle`, and the same swatch
 * list that renders on the page. No audience text is stitched in here — that
 * mid-sentence substitution was the source of the v1 run-on grammar and is
 * deferred to a future axis (see BRAND_IDENTITY_GUIDE_REFACTOR_STATUS.md).
 *
 * See OUTPUT_TRANSLATION_SPEC §10A.12 for the full contract.
 */

import { canonicalPaletteId, paletteDescriptions, resolvePaletteDisplayName } from '@identity-kit/shared'

import { hexToRgb, relativeLuminance } from './colorContrast.js'

export interface ColorSummarySwatch {
  hex: string
  name: string
}

export interface ColorSummaryInput {
  paletteId: string
  tonePreset: string
  selectedStyle: string
  swatches: ColorSummarySwatch[]
}

export interface ColorSummary {
  paletteName: string
  systemCharacter: string
  usageDiscipline: string
}

/**
 * Style-driven adjective used in the `systemCharacter` tonal-arc closer.
 * Kept short so the templated sentence reads cleanly.
 */
export const COLOR_SUMMARY_STYLE_ADJECTIVES: Record<string, string> = {
  clean_minimal: 'clear',
  bold_graphic: 'graphic',
  organic_natural: 'warm',
  luxe_refined: 'restrained',
}

const STYLE_ADJECTIVE_FALLBACK = 'considered'

/**
 * The Para 2 source — one short paragraph per (tone, style) pair describing
 * how the system should be applied. Authored to be distinct per cell so two
 * adjacent brands with different signals don't read identically. Concrete
 * descriptive language only ("the deepest tones", "the boldest tone",
 * "the brightest swatch", "the punctuation color", "the loudest hue"); never
 * "the accent" or any capitalized role noun. Each entry holds at most one
 * em-dash so the page reads as written, not generated.
 */
export const COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE: Record<
  string,
  Record<string, string>
> = {
  friendly: {
    clean_minimal:
      'Let space do most of the work. The deepest and lightest tones carry the page, and the boldest tone shows up for human moments: a thank-you, a confirmation, a hand-raised CTA.',
    bold_graphic:
      'Lead with confident contrast, but keep the warmth in how it lands. The brightest swatch is the welcome; when it appears, it should feel like an invitation, not a command.',
    organic_natural:
      'Lean on the warm mid range for everyday surfaces. Save the deepest tones for moments that need an anchor, and let the punctuation color feel like an exception rather than a default.',
    luxe_refined:
      'Restraint with one warm note. Hold most layouts in the deepest and lightest tones; the punctuation color is reserved for the moment you want the reader to feel personally addressed.',
  },
  professional: {
    clean_minimal:
      'Discipline through quiet. The deepest and lightest tones do most of the work, and the boldest tone appears only when something genuinely needs attention. Restraint is what makes it readable.',
    bold_graphic:
      'Lead with the strongest contrast pair. The loudest hue is reserved for what changes the meaning of the page: a state, a status, a single decision the reader needs to make.',
    organic_natural:
      'Hold the page in the warm mid range and let the deepest tones anchor structure. The brightest swatch is a precise instrument; used sparingly, it keeps the system feeling considered rather than busy.',
    luxe_refined:
      'Discipline is the design. The deepest and lightest tones carry almost everything, and the punctuation color earns its weight by showing up rarely and never twice on the same surface.',
  },
  bold: {
    clean_minimal:
      'The system stays quiet so the boldest tone can be loud. Keep most layouts in the deepest and lightest tones, and when the boldest tone appears let it own the page without competition.',
    bold_graphic:
      'Contrast everywhere. The loudest hue is the point of view, not decoration. Use it where the brand is taking a position, and pull it back where it would only add noise.',
    organic_natural:
      'Ground the energy in the warm mid range. The deepest tones set the pace, and the brightest swatch lands as punctuation — sharp where it shows up, never the running rhythm.',
    luxe_refined:
      'Restraint that punches. Most of the system is held in the deepest and lightest tones; the boldest tone appears decisively but rarely, and its scarcity is what gives it force.',
  },
}

/**
 * Rank the rendered swatches by perceived lightness (relative luminance) and
 * return friendly names for the deepest, mid, and lightest entries. Defensive
 * about palettes with fewer than three usable swatches — falls back to the
 * first / middle / last entries by index, then to a single name repeated.
 */
function pickAnchorSwatchNames(
  swatches: ColorSummarySwatch[],
): { deep: string; mid: string; light: string } {
  const usable = swatches.filter((s) => s && typeof s.hex === 'string' && typeof s.name === 'string')
  if (usable.length === 0) {
    return { deep: 'the deepest tone', mid: 'the mid range', light: 'the lightest tone' }
  }

  const ranked = usable
    .map((s) => {
      const rgb = hexToRgb(s.hex)
      const l = rgb ? relativeLuminance(rgb) : 0.5
      return { name: s.name, l }
    })
    .sort((a, b) => a.l - b.l)

  const deep = ranked[0]!.name
  const light = ranked[ranked.length - 1]!.name
  const midIdx = Math.floor((ranked.length - 1) / 2)
  const mid = ranked[midIdx]!.name

  return { deep, mid, light }
}

function tonalArcSentence(deep: string, mid: string, light: string, styleAdj: string): string {
  return `${deep} carries weight, ${mid} keeps the system ${styleAdj}, and ${light} opens the page up.`
}

function composeSystemCharacter(
  paletteId: string,
  swatches: ColorSummarySwatch[],
  styleAdj: string,
): string {
  const descriptor =
    paletteDescriptions[canonicalPaletteId(paletteId)] ??
    (canonicalPaletteId(paletteId)
      ? 'Verify selectedPalette matches a wizard option.'
      : 'Palette not selected.')
  const { deep, mid, light } = pickAnchorSwatchNames(swatches)
  const closer = tonalArcSentence(deep, mid, light, styleAdj)
  return `${descriptor.trim()} ${closer}`.trim()
}

/**
 * Compose the folio 02a narrow-column summary deterministically. See module
 * docstring for the full content contract.
 */
export function composeColorSummary(input: ColorSummaryInput): ColorSummary {
  const styleAdj =
    COLOR_SUMMARY_STYLE_ADJECTIVES[input.selectedStyle] ?? STYLE_ADJECTIVE_FALLBACK

  const systemCharacter = composeSystemCharacter(input.paletteId, input.swatches, styleAdj)
  const paletteName = resolvePaletteDisplayName(input.paletteId)

  const toneRow =
    COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE[input.tonePreset] ??
    COLOR_USAGE_DISCIPLINE_BY_TONE_AND_STYLE.professional!
  const usageDiscipline =
    toneRow[input.selectedStyle] ?? toneRow.clean_minimal ?? Object.values(toneRow)[0]!

  return { paletteName, systemCharacter, usageDiscipline }
}
