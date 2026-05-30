import {
  canonicalPaletteId,
  getTouchpointDefinition,
  getTouchpointLabel,
  normalizeTouchpoints,
  resolveBuyerArchetypeTitle,
  type BusinessOperatingModel,
  type GuideFocus,
  type IdentityKitForm,
  type PrimaryGoal,
  type TouchpointId,
  type VoiceSliders,
} from '@identity-kit/shared'

import {
  brandBriefBlocks,
  styleGuideBlocks,
  typographySpecimenSlots,
  type TypographySpecimenSlot,
  voicePlaybookBlocks,
  VOICE_PLAYBOOK_CTA_BODY_SPLIT,
} from './coreAssembly.js'
import { contrastRatio, friendlyColorName, hexToRgb, relativeLuminance } from './colorContrast.js'
import { composeColorSummary } from './colorSummary.js'
import { composePersonalityEditorialTriplet } from './personalityEditorialTriplet.js'
import { composePersonalityStoryQuote } from './personalityStoryQuote.js'
import { composePersonalityStandsFor } from './personalityStandsFor.js'
import { composeTypographyWordmarkRail } from './typographyWordmarkRail.js'
import { directoryListingFamilyFromPrimaryId, pickCtaFrameId } from '../pdf/ctaFrames/pickPresentation.js'
import type { GuideCtaPresentation, SocialFeedVariant } from '../pdf/ctaFrames/types.js'
import { industryGroupFromIndustry, normalizeCtaVoiceTone } from './ctaIndustryGroups.js'
import {
  buildCtaTemplateLines,
  fallbackPasteReadyByGoal,
  getPasteReadyCtaVariants,
  type PasteReadyPhraseContext,
} from './ctaSurfacePhrases.js'

export { composeColorSummary } from './colorSummary.js'
export { composePersonalityEditorialTriplet } from './personalityEditorialTriplet.js'
export { composePersonalityStoryQuote } from './personalityStoryQuote.js'
export { composePersonalityStandsFor, STANDS_FOR_BY_NARRATOR } from './personalityStandsFor.js'
export { composeTypographyWordmarkRail } from './typographyWordmarkRail.js'

type Block = { heading: string; body: string }
type PaletteRow = { hex: string; role: string; flex?: number }

export type GuideTemplateId = 'heroRail' | 'referenceGrid' | 'showcase' | 'visualBoard'
export type GuideEditorialLayoutId =
  | 'heroQuoteRail'
  | 'proseQuoteRail'
  | 'traitsSamples'
  | 'sampleShowcase'
  | 'visualSystemBoard'
export type GuideDekMode = 'full' | 'none'
export type GuideVisualOccupancy = 'light' | 'medium' | 'strong'
export type GuideExampleDensity = 'low' | 'medium' | 'high'

export type GuideCtaSurfaceId =
  | 'website'
  | 'email'
  | 'social'
  /** Second social slot: Facebook story + TikTok/YouTube reel as two `mobile_tall` shells (`two_mobile_row`). */
  | 'social_secondary'
  | 'marketplace'
  | 'directory'

export interface GuideCtaSurfaceBlock {
  id: GuideCtaSurfaceId
  /** Reader-facing plain English label (folio UI uppercases via GuideOpenModule). */
  label: string
  lines: string[]
  /**
   * Optional in-context frame for folio 05 (vector shell). When absent, PDF uses a plain list.
   */
  presentation?: GuideCtaPresentation
}

export interface GuideEditorialMeta {
  folio: string
  navLabel: string
  title: string
  deck?: string
  layout: GuideEditorialLayoutId
  dekMode: GuideDekMode
  visualOccupancy: GuideVisualOccupancy
  exampleDensity: GuideExampleDensity
  /**
   * Label for a generic editorial figure / system block.
   * This is intentionally non-logo-specific so sparse pages can
   * create visual occupancy without implying unavailable assets.
   */
  figureLabel?: string
}

export interface BrandIdentityGuideSignals {
  guideFocus: Exclude<GuideFocus, ''>
  primaryGoal: Exclude<PrimaryGoal, ''>
  primaryTouchpoint: string
  emphasis: 'voice' | 'visual' | 'handoff' | 'action'
  /** Normalized touchpoint ids (for density / channel breadth). */
  touchpointCount: number
  /**
   * Combined stage + touchpoint breadth: trims or enriches list caps and before/after pairs
   * (sparse early-stage / single-channel vs. richer multi-channel / established).
   */
  contentDensityBias: -1 | 0 | 1
}

/**
 * Kind of positioning trust cue selected for folio 02. Exactly one is chosen
 * per render in this priority order: `differentiator` > `collaborator` > `generic`.
 */
export type PositioningTrustCueKind = 'differentiator' | 'collaborator' | 'generic'

/**
 * The single trust anchor rendered in the folio 02 rail.
 * `label` is plain-language (e.g. "Your edge", "If someone is helping you",
 * "How it should feel"). `body` is the cue body text.
 */
export interface PositioningTrustCue {
  kind: PositioningTrustCueKind
  label: string
  body: string
}

export interface PositioningBrandBehavior {
  showsUpAs: string
  avoids: string
  earnsTrustBy: string
}

export interface BrandIdentityGuideModel {
  signals: BrandIdentityGuideSignals
  summary: {
    template: 'heroRail'
    editorial: GuideEditorialMeta
    anchor: string
    /**
     * Short paste-able sentence ("{Business} helps {audience}. {Transformation}.")
     * derived from the anchor, minus the trailing tone clause. Reusable by
     * the reader as a bio line or email sign-off. Also surfaced on the
     * Trust & story spread when no qualifying story note is present.
     */
    oneLine: string
    whatWeDo: string
    whoItsFor: string
    transformation: string
    guidingTraits: string[]
    differentiator?: string
    focusLead: string
  }
  positioning: {
    template: 'heroRail',
    editorial: GuideEditorialMeta
    layoutVariant: 'storyHeavy' | 'supportHeavy'
    title: string
    focusLead: string
    /**
     * Folio 03 gradient quote: one intake paragraph from `step5.originSummary` /
     * `step5.motivation` when substantive. Not derived from the Brand Brief
     * story block template sentences.
     */
    storyNote?: string
    /**
     * 3 adjectives derived from `tonePreset` + `voiceSliders`, rendered on
     * folio 03 as the "Feel" inline trait list (narrow column). Always
     * 3 items when the composer can derive them; empty only in degenerate
     * cases (missing tonePreset and flat sliders).
     */
    feelAdjectives: string[]
    /**
     * Signal-only legacy sentence derived from `feelAdjectives`. Kept for
     * non-PDF consumers and for the trust-cue generic fallback body (see
     * `selectPositioningTrustCue`). Not rendered on folio 03 — the adjectives
     * ship as a structured list in the narrow column instead.
     */
    feelLine?: string
    /**
     * Short concrete line for the folio 03 "What it stands for" block.
     * Priority: qualifying step4.missionStatement > qualifying step5.motivation >
     * narrator-keyed fallback (STANDS_FOR_BY_NARRATOR). Omitted when
     * `signals.contentDensityBias === -1` to honor the sparse bias.
     */
    standsForLine?: string
    /**
     * Optional 3-slot editorial block for folio 03 (Personality). Preferred
     * when available because it adds density without introducing extra rails.
     * Slots stay short and non-overlapping with Summary / trust cue copy.
     */
    editorialTriplet?: {
      vision: string
      mission: string
      promise: string
    }
    /**
     * Paste-able one-line brand statement (mirror of summary.oneLine).
     * Surfaced on Trust & story when there is no qualifying storyNote, so
     * the spread has a concrete reusable sentence instead of only a feel line
     * and a trust cue. Omitted when storyNote is present to avoid overload.
     */
    oneLine?: string
    /**
     * Compact personality behavior card for folio 03. These lines turn hidden
     * audience / outcome / competitor signals into practical public behavior
     * without surfacing raw intake lists.
     */
    behavior: PositioningBrandBehavior
    /**
     * Exactly one trust anchor per render. Priority:
     * differentiator > collaborator > generic feel fallback. The render does not
     * echo this cue across multiple slots; rail owns it.
     */
    trustCue: PositioningTrustCue
  }
  voice: {
    template: 'referenceGrid'
    editorial: GuideEditorialMeta
    traits: string[]
    rules: string[]
    messagingAngles: string[]
    /** Optional second band below the two-column voice grid (application framing). */
    bottomBand: { title: string; body: string }
  }
  examples: {
    template: 'showcase'
    editorial: GuideEditorialMeta
    samplePhrases: string[]
    doLines: string[]
    avoidLines: string[]
    /**
     * Copy-ready CTA lines shaped by primaryGoal. 2-3 entries, rendered on
     * Examples under samplePhrases as a reusable reference. Replaces the
     * previous "Calls to action" column on Voice, which described patterns
     * abstractly instead of handing the reader paste-able copy.
     */
    ctaTemplates: string[]
    /**
     * Surface-specific CTAs for folio 05 (still plain-English labels).
     *
     * Copy is intentionally **specific and verb-led** (NN/g guidance on weak
     * generic CTAs like “Get started”) and avoids “click here” phrasing that
     * reads poorly for assistive tech users (WCAG-adjacent writing hygiene).
     */
    ctaSurfaces: GuideCtaSurfaceBlock[]
    beforeAfter: Array<{ label: string; before: string; after: string }>
  }
  visual: {
    template: 'visualBoard'
    /**
     * Editorial meta for the **Color** page (folio 02a).
     * The Look section spans two physical pages: 02a Color and 02b Typography.
     * Both share `activeSection: 'look'` and the single 'Look' nav entry.
     */
    editorial: GuideEditorialMeta
    paletteId: string
    /**
     * Equally-sized swatches rendered on folio 02a. Each carries the hex
     * and a friendly editorial name (e.g. *Deep Navy*, *Pale Sky*); no
     * role / flex prescription. The legacy role-and-flex source rows are
     * private to assembly and not part of the rendered guide model. See
     * OUTPUT_TRANSLATION_SPEC §10A.12.
     */
    swatches: Array<{ hex: string; name: string }>
    /**
     * Smart, signal-driven summary rendered in the narrow column on folio 02a.
     *   - `paletteName` — wizard palette name (section header on 02a; no period).
     *   - `systemCharacter` — palette descriptor + templated tonal-arc closer.
     *   - `usageDiscipline` — one entry from the `(tonePreset × selectedStyle)` dictionary.
     * Audience / imagery / voice-bridge clauses are intentionally not
     * surfaced here. See `composeColorSummary` and OUTPUT_TRANSLATION_SPEC
     * §10A.12.
     */
    summary: {
      paletteName: string
      systemCharacter: string
      usageDiscipline: string
    }
    /**
     * Single-sentence caption about the overall visual direction. Retained on
     * the model for non-guide consumers; **not surfaced on folio 02a**.
     */
    visualCaption: string
    visualKeywords: string[]
    typography: {
      /**
       * Editorial meta for the **Typography** page (folio 02b).
       * Sibling of `visual.editorial`; rendered as a separate spread page
       * but sharing the 'Look' nav highlight.
       */
      editorial: GuideEditorialMeta
      /**
       * Folio 02b bottom-band left rail: fonts-first intro, wordmark grid explainer,
       * Google Fonts specimen links + licensing (see `composeTypographyWordmarkRail`).
       */
      wordmarkBandRail: {
        fontIntro: string
        wordmarkIntro: string
        downloadLinks: Array<{ label: string; href: string }>
        licensing: string
      }
      specimens: TypographySpecimenSlot[]
      /**
       * Where each registered typeface belongs. 1-2 rows, derived from the
       * specimen slots. Replaces a reader-unfriendly "Use this face for..."
       * gap that left specimens unexplained.
       */
      applications: Array<{ face: string; use: string }>
      /**
       * Up to four deterministic palette pairs used to render the brand
       * name on folio 02b. `paletteContrastBlocks` walks pairs in
       * descending contrast, skips duplicates, and skips the chromatic
       * reverse of an already-chosen pair so the column is not two flips
       * of the same two colors. See OUTPUT_TRANSLATION_SPEC §10A.12.
       */
      wordmarkColorBlocks: Array<{ background: string; foreground: string; contrastRatio: number }>
      /**
       * Typeface cards for folio 02b — one per registered face. The PDF
       * renders a prominent face name and a weight ladder (per-family rows
       * match fonts actually embedded in the PDF; e.g. DM Serif Display only
       * ships Regular + Italic). Right-aligned; the brand name is not used here.
       * See OUTPUT_TRANSLATION_SPEC §10A.12.
       */
      typefaceSpecimens: Array<{
        faceLabel: string
        pdfFamily: string
        roleEyebrow: string
      }>
    }
    /**
     * Single-sentence imagery direction. Retained on the model for non-guide
     * consumers; **not surfaced on folio 02a**. Look has pivoted to colors
     * (02a) + typography (02b) only.
     */
    imageryDirection: string
  }
}

type ContrastPair = { background: string; foreground: string; contrastRatio: number }

function sameOrderedPair(a: ContrastPair, b: ContrastPair): boolean {
  return a.background.toUpperCase() === b.background.toUpperCase() && a.foreground.toUpperCase() === b.foreground.toUpperCase()
}

/** True when `b` is the same two hexes as `a` with background and foreground swapped. */
function chromaticReverseOf(a: ContrastPair, b: ContrastPair): boolean {
  const u = (s: string) => s.toUpperCase()
  return u(a.background) === u(b.foreground) && u(a.foreground) === u(b.background)
}

/**
 * Pick up to four palette pairs by WCAG contrast ratio for the wordmark
 * blocks on folio 02b. Walks all valid pairs in descending contrast order
 * (tiebreak `bg.hex` then `fg.hex`). The first slot is always the
 * single highest-contrast pair. Further slots skip an exact duplicate
 * and skip the **chromatic reverse** of an already-chosen pair (same two
 * colors with bg/fg swapped), so the stack does not read as two flips of
 * the same pair. If fewer than four pairs survive that filter (very
 * small palettes), fewer than four are returned. Pairs below 1.5:1 are
 * dropped.
 */
export function paletteContrastBlocks(
  swatches: Array<{ hex: string }>,
): Array<{ background: string; foreground: string; contrastRatio: number }> {
  const pairs: ContrastPair[] = []
  for (let i = 0; i < swatches.length; i += 1) {
    for (let j = 0; j < swatches.length; j += 1) {
      if (i === j) continue
      const background = swatches[i]!.hex
      const foreground = swatches[j]!.hex
      const ratio = contrastRatio(foreground, background)
      if (ratio < 1.5) continue
      pairs.push({ background, foreground, contrastRatio: ratio })
    }
  }
  pairs.sort((a, b) => {
    if (b.contrastRatio !== a.contrastRatio) return b.contrastRatio - a.contrastRatio
    if (a.background !== b.background) return a.background.localeCompare(b.background)
    return a.foreground.localeCompare(b.foreground)
  })

  const chosen: ContrastPair[] = []
  const backgroundUse = new Map<string, number>()
  const BACKGROUND_USE_CAP = 2

  // Pass 1: preserve contrast ordering while capping background repeats so
  // the 2x2 grid demonstrates more palette variance.
  for (const p of pairs) {
    if (chosen.length >= 4) break
    if (chosen.some((c) => sameOrderedPair(c, p))) continue
    if (chosen.some((c) => chromaticReverseOf(c, p))) continue
    if ((backgroundUse.get(p.background.toUpperCase()) ?? 0) >= BACKGROUND_USE_CAP) continue
    chosen.push(p)
    const key = p.background.toUpperCase()
    backgroundUse.set(key, (backgroundUse.get(key) ?? 0) + 1)
  }

  // Pass 2: if strict diversity cap left fewer than four blocks, fill from the
  // same ranked pool without the cap so small/low-contrast palettes still render.
  for (const p of pairs) {
    if (chosen.length >= 4) break
    if (chosen.some((c) => sameOrderedPair(c, p))) continue
    if (chosen.some((c) => chromaticReverseOf(c, p))) continue
    chosen.push(p)
  }

  // Ensure at least one block uses the lightest palette swatch as background
  // when a valid (>=1.5 contrast, non-duplicate, non-reverse) pair exists.
  const lightest = swatches
    .map((s) => {
      const rgb = hexToRgb(s.hex)
      return { hex: s.hex, luminance: rgb ? relativeLuminance(rgb) : -1 }
    })
    .sort((a, b) => b.luminance - a.luminance)[0]?.hex
  if (lightest && !chosen.some((c) => c.background.toUpperCase() === lightest.toUpperCase())) {
    let lightBgCandidate = pairs.find((p) => {
      if (p.background.toUpperCase() !== lightest.toUpperCase()) return false
      if (chosen.some((c) => sameOrderedPair(c, p))) return false
      if (chosen.some((c) => chromaticReverseOf(c, p))) return false
      return true
    })
    let replaceReverseIdx: number | undefined
    if (!lightBgCandidate) {
      // If only the chromatic reverse blocks the lightest-background pair,
      // prefer the lightest-background orientation by replacing that reverse.
      for (const p of pairs) {
        if (p.background.toUpperCase() !== lightest.toUpperCase()) continue
        if (chosen.some((c) => sameOrderedPair(c, p))) continue
        const reverseIdx = chosen.findIndex((c) => chromaticReverseOf(c, p))
        if (reverseIdx >= 0) {
          lightBgCandidate = p
          replaceReverseIdx = reverseIdx
          break
        }
      }
    }
    if (lightBgCandidate) {
      if (replaceReverseIdx !== undefined) {
        chosen[replaceReverseIdx] = lightBgCandidate
      } else if (chosen.length < 4) {
        chosen.push(lightBgCandidate)
      } else {
        // Preserve the top-ranked anchor at index 0 and replace a weaker tail slot.
        const replaceIdx = chosen
          .map((c, i) => ({ i, c }))
          .filter(({ i }) => i > 0)
          .sort((a, b) => a.c.contrastRatio - b.c.contrastRatio)[0]?.i
        if (replaceIdx !== undefined) chosen[replaceIdx] = lightBgCandidate
      }
    }
  }

  const ordered = chosen.slice(0, 4)
  if (ordered.length < 4) return ordered
  const anchor = ordered[0]!
  const tail = ordered.slice(1)
  const perms: ContrastPair[][] = [
    [tail[0]!, tail[1]!, tail[2]!],
    [tail[0]!, tail[2]!, tail[1]!],
    [tail[1]!, tail[0]!, tail[2]!],
    [tail[1]!, tail[2]!, tail[0]!],
    [tail[2]!, tail[0]!, tail[1]!],
    [tail[2]!, tail[1]!, tail[0]!],
  ]
  const score = (arr: ContrastPair[]) => {
    const bg = (i: number) => arr[i]!.background.toUpperCase()
    let penalty = 0
    if (bg(0) === bg(1)) penalty += 3
    if (bg(2) === bg(3)) penalty += 3
    if (bg(0) === bg(2)) penalty += 4
    if (bg(1) === bg(3)) penalty += 4
    const weight = arr[0]!.contrastRatio * 3 + arr[1]!.contrastRatio * 2 + arr[2]!.contrastRatio
    return { penalty, weight }
  }
  let best = [anchor, ...perms[0]!]
  let bestScore = score(best)
  for (const perm of perms.slice(1)) {
    const candidate = [anchor, ...perm]
    const s = score(candidate)
    if (s.penalty < bestScore.penalty || (s.penalty === bestScore.penalty && s.weight > bestScore.weight)) {
      best = candidate
      bestScore = s
    }
  }
  return best
}

function uniqueFriendlySwatchNames(
  swatches: Array<{ hex: string }>,
): Array<{ hex: string; name: string }> {
  const base = swatches.map((swatch) => ({
    hex: swatch.hex,
    name: friendlyColorName(swatch.hex),
    luminance: (() => {
      const rgb = hexToRgb(swatch.hex)
      return rgb ? relativeLuminance(rgb) : 0
    })(),
  }))

  const buckets = new Map<string, typeof base>()
  for (const item of base) {
    const group = buckets.get(item.name) ?? []
    group.push(item)
    buckets.set(item.name, group)
  }

  for (const [name, group] of buckets.entries()) {
    if (group.length <= 1) continue
    group.sort((a, b) => a.luminance - b.luminance || a.hex.localeCompare(b.hex))
    const noun = name.split(/\s+/).at(-1) ?? name
    const used = new Set(group.map((item) => item.name))
    for (const item of group) {
      if (group.filter((g) => g.name === item.name).length <= 1) continue
      const rgb = hexToRgb(item.hex)
      const candidates: string[] = []
      if (rgb) {
        if (item.luminance >= 0.9) candidates.push(`Light ${noun}`, `Soft ${noun}`)
        else if (item.luminance >= 0.75) candidates.push(`Soft ${noun}`, `Muted ${noun}`)
        else if (item.luminance >= 0.5) candidates.push(`Muted ${noun}`, `Warm ${noun}`)
        else if (item.luminance >= 0.3) candidates.push(`Dark ${noun}`, `Warm ${noun}`)
        else candidates.push(`Deep ${noun}`, `Dark ${noun}`)
        if (rgb.r - rgb.b >= 18) candidates.push(`Warm ${noun}`)
        if (rgb.b - rgb.r >= 18) candidates.push(`Cool ${noun}`)
      }
      candidates.push(`${noun} ${item.hex.slice(1, 3).toUpperCase()}`)
      const replacement = candidates.find((candidate) => !used.has(candidate))
      if (replacement) {
        used.delete(item.name)
        item.name = replacement
        used.add(replacement)
      }
    }
  }

  return base.map(({ hex, name }) => ({ hex, name }))
}

const styleKeywordMap: Record<string, string[]> = {
  clean_minimal: ['clean', 'spacious', 'clear'],
  bold_graphic: ['bold', 'high-contrast', 'decisive'],
  organic_natural: ['warm', 'organic', 'handmade'],
  luxe_refined: ['refined', 'quiet', 'premium'],
}

const guidePaletteRows: Record<string, PaletteRow[]> = {
  midnight_luxe: [
    { role: 'Primary', hex: '#0B0B0F', flex: 4 },
    { role: 'Supporting', hex: '#222333', flex: 3 },
    { role: 'Accent', hex: '#7A6A4F', flex: 2 },
    { role: 'Canvas', hex: '#D4C4A8', flex: 5 },
  ],
  earthy_warmth: [
    { role: 'Accent', hex: '#5A3E36', flex: 2 },
    { role: 'Supporting', hex: '#A77C5D', flex: 3 },
    { role: 'Canvas', hex: '#E5C7A2', flex: 4 },
    { role: 'Primary', hex: '#F8EEDF', flex: 5 },
  ],
  stealth_ember: [
    { role: 'Primary', hex: '#121212', flex: 4 },
    { role: 'Accent', hex: '#FF6A00', flex: 3 },
    { role: 'Supporting', hex: '#FFD166', flex: 2 },
    { role: 'Canvas', hex: '#E9ECEF', flex: 5 },
  ],
  signal_orange: [
    { role: 'Primary', hex: '#0F1115', flex: 4 },
    { role: 'Accent', hex: '#FF5A1F', flex: 3 },
    { role: 'Supporting', hex: '#2DD4FF', flex: 2 },
    { role: 'Canvas', hex: '#F5F7FA', flex: 5 },
  ],
  pop_triad: [
    { role: 'Primary', hex: '#111827', flex: 4 },
    { role: 'Accent', hex: '#8B5CF6', flex: 3 },
    { role: 'Supporting', hex: '#22C55E', flex: 2 },
    { role: 'Canvas', hex: '#F97316', flex: 5 },
  ],
  neo_utility: [
    { role: 'Primary', hex: '#171717', flex: 4 },
    { role: 'Accent', hex: '#A3E635', flex: 3 },
    { role: 'Supporting', hex: '#38BDF8', flex: 2 },
    { role: 'Canvas', hex: '#F8FAFC', flex: 5 },
  ],
  cyber_lime: [
    { role: 'Primary', hex: '#10121A', flex: 4 },
    { role: 'Accent', hex: '#8B5CF6', flex: 3 },
    { role: 'Supporting', hex: '#A3E635', flex: 2 },
    { role: 'Canvas', hex: '#EAF7FF', flex: 5 },
  ],
  noir_cyan: [
    { role: 'Primary', hex: '#0B1020', flex: 4 },
    { role: 'Accent', hex: '#00E5FF', flex: 3 },
    { role: 'Supporting', hex: '#7C3AED', flex: 2 },
    { role: 'Canvas', hex: '#ECF2FF', flex: 5 },
  ],
  mews_pop: [
    { role: 'Primary', hex: '#131313', flex: 4 },
    { role: 'Accent', hex: '#FF2EA6', flex: 3 },
    { role: 'Supporting', hex: '#FFFFFF', flex: 2 },
    { role: 'Canvas', hex: '#C7CBD6', flex: 5 },
  ],
  cobalt_punch: [
    { role: 'Primary', hex: '#131722', flex: 4 },
    { role: 'Accent', hex: '#2563EB', flex: 3 },
    { role: 'Supporting', hex: '#F43F5E', flex: 2 },
    { role: 'Canvas', hex: '#E2E8F0', flex: 5 },
  ],
  candy_burst: [
    { role: 'Primary', hex: '#FF4FA3', flex: 4 },
    { role: 'Accent', hex: '#7C5CFF', flex: 3 },
    { role: 'Supporting', hex: '#22C55E', flex: 2 },
    { role: 'Canvas', hex: '#FFF4F8', flex: 5 },
  ],
  citrus_splash: [
    { role: 'Primary', hex: '#0EA5E9', flex: 4 },
    { role: 'Accent', hex: '#F97316', flex: 3 },
    { role: 'Supporting', hex: '#FACC15', flex: 2 },
    { role: 'Canvas', hex: '#F8FAFC', flex: 5 },
  ],
  studio_confetti: [
    { role: 'Primary', hex: '#EC4899', flex: 4 },
    { role: 'Accent', hex: '#06B6D4', flex: 3 },
    { role: 'Supporting', hex: '#84CC16', flex: 2 },
    { role: 'Canvas', hex: '#F5F3FF', flex: 5 },
  ],
  raspberry_indigo: [
    { role: 'Primary', hex: '#DB2777', flex: 4 },
    { role: 'Accent', hex: '#4F46E5', flex: 3 },
    { role: 'Supporting', hex: '#06B6D4', flex: 2 },
    { role: 'Canvas', hex: '#F5F3FF', flex: 5 },
  ],
  emerald_amber_blue: [
    { role: 'Primary', hex: '#10B981', flex: 4 },
    { role: 'Accent', hex: '#2563EB', flex: 3 },
    { role: 'Supporting', hex: '#F59E0B', flex: 2 },
    { role: 'Canvas', hex: '#FFFBF5', flex: 5 },
  ],
  magenta_orange_cyan: [
    { role: 'Primary', hex: '#EC4899', flex: 4 },
    { role: 'Accent', hex: '#FB923C', flex: 3 },
    { role: 'Supporting', hex: '#22D3EE', flex: 2 },
    { role: 'Canvas', hex: '#F8FAFC', flex: 5 },
  ],
  ocean_calm: [
    { role: 'Primary', hex: '#0D3B66', flex: 4 },
    { role: 'Supporting', hex: '#2F6690', flex: 3 },
    { role: 'Accent', hex: '#3A7CA5', flex: 2 },
    { role: 'Canvas', hex: '#D9EDFF', flex: 5 },
  ],
  sunset_bold: [
    { role: 'Primary', hex: '#2D1E2F', flex: 4 },
    { role: 'Accent', hex: '#C8553D', flex: 3 },
    { role: 'Supporting', hex: '#F28F3B', flex: 2 },
    { role: 'Canvas', hex: '#F7D488', flex: 5 },
  ],
  sorbet_sunset: [
    { role: 'Primary', hex: '#3F0A1F', flex: 4 },
    { role: 'Accent', hex: '#DB2777', flex: 3 },
    { role: 'Supporting', hex: '#FB923C', flex: 2 },
    { role: 'Canvas', hex: '#FFF7ED', flex: 5 },
  ],
  forest_deep: [
    { role: 'Primary', hex: '#1B4332', flex: 4 },
    { role: 'Supporting', hex: '#2D6A4F', flex: 3 },
    { role: 'Accent', hex: '#40916C', flex: 2 },
    { role: 'Canvas', hex: '#D8F3DC', flex: 5 },
  ],
  minimal_light: [
    { role: 'Primary', hex: '#111111', flex: 4 },
    { role: 'Supporting', hex: '#666666', flex: 3 },
    { role: 'Accent', hex: '#CFCFCF', flex: 2 },
    { role: 'Canvas', hex: '#F7F7F7', flex: 5 },
  ],
  arctic_blue: [
    { role: 'Primary', hex: '#1A2F4D', flex: 4 },
    { role: 'Supporting', hex: '#3B6FB8', flex: 3 },
    { role: 'Accent', hex: '#89B4E8', flex: 2 },
    { role: 'Canvas', hex: '#F0F7FF', flex: 5 },
  ],
  ink_navy: [
    { role: 'Primary', hex: '#050A12', flex: 4 },
    { role: 'Supporting', hex: '#142233', flex: 3 },
    { role: 'Accent', hex: '#2A4A6E', flex: 2 },
    { role: 'Canvas', hex: '#D4DEE8', flex: 5 },
  ],
  paper_stone: [
    { role: 'Primary', hex: '#3A3634', flex: 4 },
    { role: 'Supporting', hex: '#6F6965', flex: 3 },
    { role: 'Accent', hex: '#C9C2BA', flex: 2 },
    { role: 'Canvas', hex: '#F6F3EE', flex: 5 },
  ],
  terracotta_clay: [
    { role: 'Primary', hex: '#5C2E24', flex: 4 },
    { role: 'Supporting', hex: '#9C5130', flex: 3 },
    { role: 'Accent', hex: '#D4996C', flex: 2 },
    { role: 'Canvas', hex: '#FDF5ED', flex: 5 },
  ],
  sand_dune: [
    { role: 'Primary', hex: '#4F4639', flex: 4 },
    { role: 'Supporting', hex: '#8F8170', flex: 3 },
    { role: 'Accent', hex: '#D8CAB8', flex: 2 },
    { role: 'Canvas', hex: '#FFFBF5', flex: 5 },
  ],
  moss_meadow: [
    { role: 'Primary', hex: '#1E3328', flex: 4 },
    { role: 'Supporting', hex: '#3D6B4F', flex: 3 },
    { role: 'Accent', hex: '#6FA67A', flex: 2 },
    { role: 'Canvas', hex: '#E8F5E9', flex: 5 },
  ],
  mint_fresh: [
    { role: 'Primary', hex: '#0F3430', flex: 4 },
    { role: 'Supporting', hex: '#115E59', flex: 3 },
    { role: 'Accent', hex: '#2DD4BF', flex: 2 },
    { role: 'Canvas', hex: '#ECFEFF', flex: 5 },
  ],
  citrus_pop: [
    { role: 'Primary', hex: '#3F1610', flex: 4 },
    { role: 'Supporting', hex: '#C2410C', flex: 3 },
    { role: 'Accent', hex: '#FBBF24', flex: 2 },
    { role: 'Canvas', hex: '#FFFBEB', flex: 5 },
  ],
  coastal_teal: [
    { role: 'Primary', hex: '#083344', flex: 4 },
    { role: 'Supporting', hex: '#0E7490', flex: 3 },
    { role: 'Accent', hex: '#22D3EE', flex: 2 },
    { role: 'Canvas', hex: '#ECFEFF', flex: 5 },
  ],
  sea_glass: [
    { role: 'Primary', hex: '#064E3B', flex: 4 },
    { role: 'Supporting', hex: '#047857', flex: 3 },
    { role: 'Accent', hex: '#34D399', flex: 2 },
    { role: 'Canvas', hex: '#D1FAE5', flex: 5 },
  ],
  lagoon_deep: [
    { role: 'Primary', hex: '#06343B', flex: 4 },
    { role: 'Supporting', hex: '#0F766E', flex: 3 },
    { role: 'Accent', hex: '#14B8A6', flex: 2 },
    { role: 'Canvas', hex: '#F0FDFA', flex: 5 },
  ],
  midnight_cerulean: [
    { role: 'Primary', hex: '#1E1B4B', flex: 4 },
    { role: 'Supporting', hex: '#4338CA', flex: 3 },
    { role: 'Accent', hex: '#818CF8', flex: 2 },
    { role: 'Canvas', hex: '#EEF2FF', flex: 5 },
  ],
  powder_navy: [
    { role: 'Primary', hex: '#172554', flex: 4 },
    { role: 'Supporting', hex: '#1E40AF', flex: 3 },
    { role: 'Accent', hex: '#60A5FA', flex: 2 },
    { role: 'Canvas', hex: '#EFF6FF', flex: 5 },
  ],
  graphite_fog: [
    { role: 'Primary', hex: '#131313', flex: 4 },
    { role: 'Supporting', hex: '#404040', flex: 3 },
    { role: 'Neutral', hex: '#8C8C8C', flex: 2 },
    { role: 'Canvas', hex: '#EBEBEB', flex: 5 },
  ],
  carbon_paper: [
    { role: 'Primary', hex: '#0A0A0A', flex: 4 },
    { role: 'Supporting', hex: '#3D3D3D', flex: 3 },
    { role: 'Neutral', hex: '#CFCFCF', flex: 2 },
    { role: 'Canvas', hex: '#FFFFFF', flex: 5 },
  ],
  walnut_cream: [
    { role: 'Accent', hex: '#271C15', flex: 2 },
    { role: 'Supporting', hex: '#7A4A2F', flex: 3 },
    { role: 'Canvas', hex: '#D4A574', flex: 4 },
    { role: 'Primary', hex: '#FFF9ED', flex: 5 },
  ],
  toffee_sand: [
    { role: 'Accent', hex: '#4A3520', flex: 2 },
    { role: 'Supporting', hex: '#9A7316', flex: 3 },
    { role: 'Canvas', hex: '#E8C468', flex: 4 },
    { role: 'Primary', hex: '#FFFBEB', flex: 5 },
  ],
  espresso_oat: [
    { role: 'Accent', hex: '#3E2A22', flex: 2 },
    { role: 'Supporting', hex: '#6B4B3E', flex: 3 },
    { role: 'Canvas', hex: '#A9856C', flex: 4 },
    { role: 'Primary', hex: '#F7EEE5', flex: 5 },
  ],
  amber_glow: [
    { role: 'Primary', hex: '#713F12', flex: 4 },
    { role: 'Supporting', hex: '#B45309', flex: 3 },
    { role: 'Accent', hex: '#FBBF24', flex: 2 },
    { role: 'Canvas', hex: '#FFFBEB', flex: 5 },
  ],
  copper_spark: [
    { role: 'Primary', hex: '#431407', flex: 4 },
    { role: 'Supporting', hex: '#9A3412', flex: 3 },
    { role: 'Accent', hex: '#EA580C', flex: 2 },
    { role: 'Canvas', hex: '#FFEDD5', flex: 5 },
  ],
  honey_comb: [
    { role: 'Primary', hex: '#422006', flex: 4 },
    { role: 'Supporting', hex: '#A16207', flex: 3 },
    { role: 'Accent', hex: '#EAB308', flex: 2 },
    { role: 'Canvas', hex: '#FEFCE8', flex: 5 },
  ],
  rose_dusk: [
    { role: 'Primary', hex: '#1F0A14', flex: 4 },
    { role: 'Supporting', hex: '#831843', flex: 3 },
    { role: 'Accent', hex: '#FB7185', flex: 2 },
    { role: 'Canvas', hex: '#F1F5F9', flex: 5 },
  ],
  bubblegum_pulse: [
    { role: 'Primary', hex: '#881337', flex: 4 },
    { role: 'Supporting', hex: '#E11D48', flex: 3 },
    { role: 'Accent', hex: '#FDA4AF', flex: 2 },
    { role: 'Canvas', hex: '#FFFFFF', flex: 5 },
  ],
  carnation_soft: [
    { role: 'Primary', hex: '#3F2D32', flex: 4 },
    { role: 'Supporting', hex: '#7C3A5F', flex: 3 },
    { role: 'Accent', hex: '#E8B4C2', flex: 2 },
    { role: 'Canvas', hex: '#EDD4DE', flex: 5 },
  ],
  violet_haze: [
    { role: 'Primary', hex: '#2E1065', flex: 4 },
    { role: 'Supporting', hex: '#6D28D9', flex: 3 },
    { role: 'Accent', hex: '#A78BFA', flex: 2 },
    { role: 'Canvas', hex: '#EDE9FE', flex: 5 },
  ],
  electric_orchid: [
    { role: 'Primary', hex: '#4C1D95', flex: 4 },
    { role: 'Supporting', hex: '#9333EA', flex: 3 },
    { role: 'Accent', hex: '#E879F9', flex: 2 },
    { role: 'Canvas', hex: '#FAF5FF', flex: 5 },
  ],
  plum_violet: [
    { role: 'Primary', hex: '#2F0F28', flex: 4 },
    { role: 'Supporting', hex: '#701A75', flex: 3 },
    { role: 'Accent', hex: '#A21CAF', flex: 2 },
    { role: 'Canvas', hex: '#FDF4FF', flex: 5 },
  ],
  cedar_grove: [
    { role: 'Primary', hex: '#2F3320', flex: 4 },
    { role: 'Supporting', hex: '#5C6D2A', flex: 3 },
    { role: 'Accent', hex: '#9CAF50', flex: 2 },
    { role: 'Canvas', hex: '#F7FBEA', flex: 5 },
  ],
  pine_mint: [
    { role: 'Primary', hex: '#263B0F', flex: 4 },
    { role: 'Supporting', hex: '#4D7C0F', flex: 3 },
    { role: 'Accent', hex: '#C4E85A', flex: 2 },
    { role: 'Canvas', hex: '#F7FEE7', flex: 5 },
  ],
  deep_aqua: [
    { role: 'Primary', hex: '#0F2428', flex: 4 },
    { role: 'Supporting', hex: '#2A4F56', flex: 3 },
    { role: 'Accent', hex: '#5E9AA3', flex: 2 },
    { role: 'Canvas', hex: '#E5F4F7', flex: 5 },
  ],
  teal_breeze: [
    { role: 'Primary', hex: '#001524', flex: 4 },
    { role: 'Supporting', hex: '#005F8C', flex: 3 },
    { role: 'Accent', hex: '#00A8E8', flex: 2 },
    { role: 'Canvas', hex: '#E1F6FF', flex: 5 },
  ],
  apricot_twilight: [
    { role: 'Primary', hex: '#352428', flex: 4 },
    { role: 'Supporting', hex: '#995C6B', flex: 3 },
    { role: 'Accent', hex: '#F4A574', flex: 2 },
    { role: 'Canvas', hex: '#FFF5EF', flex: 5 },
  ],
  ember_sorbet: [
    { role: 'Primary', hex: '#3E0F12', flex: 4 },
    { role: 'Supporting', hex: '#B83226', flex: 3 },
    { role: 'Accent', hex: '#FF7B54', flex: 2 },
    { role: 'Canvas', hex: '#FFF0EA', flex: 5 },
  ],
  bronze_daylight: [
    { role: 'Primary', hex: '#4D2C10', flex: 4 },
    { role: 'Supporting', hex: '#8E4A12', flex: 3 },
    { role: 'Accent', hex: '#D97706', flex: 2 },
    { role: 'Canvas', hex: '#FFF6E8', flex: 5 },
  ],
  saffron_spice: [
    { role: 'Primary', hex: '#5C1A1A', flex: 4 },
    { role: 'Supporting', hex: '#9A3412', flex: 3 },
    { role: 'Accent', hex: '#D97706', flex: 2 },
    { role: 'Canvas', hex: '#FFF7ED', flex: 5 },
  ],
  dust_rose_ink: [
    { role: 'Primary', hex: '#241018', flex: 4 },
    { role: 'Supporting', hex: '#6D3A52', flex: 3 },
    { role: 'Accent', hex: '#C48BA3', flex: 2 },
    { role: 'Canvas', hex: '#FAF5F0', flex: 5 },
  ],
  berry_blush: [
    { role: 'Primary', hex: '#1C0A18', flex: 4 },
    { role: 'Supporting', hex: '#9D174D', flex: 3 },
    { role: 'Accent', hex: '#F472B6', flex: 2 },
    { role: 'Canvas', hex: '#F5F3FF', flex: 5 },
  ],
  indigo_bloom: [
    { role: 'Primary', hex: '#1A1035', flex: 4 },
    { role: 'Supporting', hex: '#43309A', flex: 3 },
    { role: 'Accent', hex: '#6366F1', flex: 2 },
    { role: 'Canvas', hex: '#E8EAFC', flex: 5 },
  ],
  royal_lilac: [
    { role: 'Primary', hex: '#3B0764', flex: 4 },
    { role: 'Supporting', hex: '#7C3AED', flex: 3 },
    { role: 'Accent', hex: '#C4B5FD', flex: 2 },
    { role: 'Canvas', hex: '#FAF5FF', flex: 5 },
  ],
}

const focusMeta: Record<
  Exclude<GuideFocus, ''>,
  { emphasis: BrandIdentityGuideSignals['emphasis']; lead: string; collaborator?: string }
> = {
  look_more_professional: {
    emphasis: 'visual',
    lead: 'Make the brand feel clearer and more intentional wherever people encounter it.',
    collaborator: 'Share the summary and visual pages if someone else is helping with the brand.',
  },
  sound_more_consistent: {
    emphasis: 'voice',
    lead: 'Keep the brand sounding recognizably like the same business everywhere it shows up.',
    collaborator: 'Share the summary, voice, and example pages together if someone else is helping with copy.',
  },
  give_clear_direction: {
    emphasis: 'handoff',
    lead: 'Use this as a short guide so someone else can make brand decisions faster.',
    collaborator: 'This works as a short guide: summary first, then visual direction, then example copy.',
  },
  know_what_to_fix_first: {
    emphasis: 'action',
    lead: 'Focus on the few updates that will make the brand feel more cohesive.',
    collaborator: 'If someone else is making changes, begin with the application and checklist pages.',
  },
}

function blockByHeading(blocks: Block[], heading: string): string {
  return blocks.find((block) => block.heading === heading)?.body.trim() ?? ''
}

function toSentenceList(body: string): string[] {
  return body
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function extractWhatWeDo(body: string): string {
  const match = body.match(/^[^:]+:\s*(.+?)\s+\([^()]+,\s*[^()]+\)\.?$/)
  return match?.[1]?.trim() ?? body.trim()
}

function extractAudience(body: string): string {
  const beforePain = body.split('Pain points:')[0] ?? body
  const beforeOutcomes = beforePain.split('Desired outcomes:')[0] ?? beforePain
  return beforeOutcomes.replace(/\.$/, '').trim()
}

function firstParagraphs(body: string, count: number): string {
  return body
    .split('\n\n')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, count)
    .join(' ')
}

function firstSentences(body: string, count: number): string {
  return toSentenceList(body)
    .slice(0, count)
    .join(' ')
    .trim()
}

/**
 * Copy-ready CTA lines for the Examples spread, shaped by primaryGoal.
 *
 * Each goal maps to 3 plain-language templates (short → medium) the reader
 * can paste directly into emails, buttons, or captions without editing. When
 * no goal is selected, falls back to the extracted ctaExamples from the
 * Voice Playbook, or a neutral 3-line set.
 *
 * Templates avoid banned vocabulary (no "touchpoint", "rollout",
 * "first surface", etc.) and do not reference specific channels.
 */
export function composeCtaTemplates(
  primaryGoal: PrimaryGoal,
  ctaExamples: string[],
  meta: {
    industryGroup: ReturnType<typeof industryGroupFromIndustry>
    voiceTone: ReturnType<typeof normalizeCtaVoiceTone>
    sensitiveIndustry: boolean
    seedKey: string
  },
): string[] {
  if (!primaryGoal) {
    const fallback = ctaExamples.slice(0, 3).filter((line) => line.trim().length > 0)
    if (fallback.length >= 2) return fallback
    return [
      'Say hello when you are ready.',
      'Reply to this email to start the conversation.',
      'Learn more on the website.',
    ]
  }
  return buildCtaTemplateLines({
    primaryGoal,
    industryGroup: meta.industryGroup,
    voiceTone: meta.voiceTone,
    sensitiveIndustry: meta.sensitiveIndustry,
    seedKey: meta.seedKey,
  })
}

type SocialCtaTone = 'professional' | 'casual'

function normalizeCtaLineKey(line: string): string {
  return line
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[’']/g, "'")
    .replace(/[^\p{L}\p{N}\s'-]/gu, '')
}

function dedupeCtaLines(
  lines: string[],
  forbidden: Set<string>,
  max: number,
): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const key = normalizeCtaLineKey(line)
    if (!key || seen.has(key) || forbidden.has(key)) continue
    seen.add(key)
    out.push(line)
    if (out.length >= max) break
  }
  return out
}

function isMarketplaceTouchpoint(id: TouchpointId): boolean {
  return getTouchpointDefinition(id).bucket === 'marketplace'
}

function isDirectoryTouchpoint(id: TouchpointId): boolean {
  return getTouchpointDefinition(id).bucket === 'online_directory'
}

function isSocialTouchpoint(id: TouchpointId): boolean {
  return getTouchpointDefinition(id).bucket === 'social'
}

function socialCtaTone(socialIds: TouchpointId[]): SocialCtaTone {
  if (socialIds.some((id) => id === 'linkedin' || id === 'youtube')) return 'professional'
  return 'casual'
}

function uniqueSocialTouchpointLabels(ids: TouchpointId[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of ids) {
    const label = getTouchpointLabel(id)
    if (seen.has(label)) continue
    seen.add(label)
    out.push(label)
  }
  return out
}

function socialSurfaceFamilyFromPrimary(id: TouchpointId | undefined): NonNullable<GuideCtaPresentation['socialSurfaceFamily']> {
  if (!id) return 'grid_photo'
  if (id === 'linkedin') return 'link_preview'
  if (id === 'facebook') return 'story'
  if (id === 'youtube' || id === 'tiktok') return 'reel_cover'
  if (id === 'pinterest') return 'pin_standard'
  if (id === 'threads') return 'text_only'
  return 'grid_photo'
}

function composeSocialFeedPresentation(
  socialIds: TouchpointId[],
  socialTone: SocialCtaTone,
): Pick<GuideCtaPresentation, 'platformSummary' | 'socialFeedVariant' | 'socialSurfaceFamily'> {
  const labels = uniqueSocialTouchpointLabels(socialIds)
  const primarySocialId = socialIds[0]
  const platformSummary = labels.length > 0 ? labels.slice(0, 5).join(' · ') : 'Social'
  const socialFeedVariant: SocialFeedVariant =
    socialTone === 'professional' ? 'professional_network_feed' : 'creator_visual_feed'
  const socialSurfaceFamily = socialSurfaceFamilyFromPrimary(primarySocialId)
  return { platformSummary, socialFeedVariant, socialSurfaceFamily }
}

/** Single-channel summary + surface family for a fixed primary (dual mobile folio slots). */
function composeSocialFeedPresentationForPrimary(
  socialTone: SocialCtaTone,
  primarySocialId: TouchpointId,
): Pick<GuideCtaPresentation, 'platformSummary' | 'socialFeedVariant' | 'socialSurfaceFamily'> {
  const platformSummary = getTouchpointLabel(primarySocialId)
  const socialFeedVariant: SocialFeedVariant =
    socialTone === 'professional' ? 'professional_network_feed' : 'creator_visual_feed'
  const socialSurfaceFamily = socialSurfaceFamilyFromPrimary(primarySocialId)
  return { platformSummary, socialFeedVariant, socialSurfaceFamily }
}

function shouldEmitDualMobileStoryReelSlots(touchpointIds: TouchpointId[]): boolean {
  return (
    touchpointIds.includes('facebook') &&
    touchpointIds.some((id) => id === 'tiktok' || id === 'youtube')
  )
}

/** Instagram feed + Facebook story as two social surfaces for folio 05 QA/content. */
function shouldEmitDualSocialStoryFeedSlots(touchpointIds: TouchpointId[]): boolean {
  return touchpointIds.includes('instagram') && touchpointIds.includes('facebook')
}

/** Facebook story + TikTok/YouTube reel as two surfaces → `two_mobile_row` on folio 05. */
function expandDualMobileSocialSurfaces(
  surfaces: GuideCtaSurfaceId[],
  touchpointIds: TouchpointId[],
  maxSurfaces: number,
): GuideCtaSurfaceId[] {
  const wantsDualMobile = shouldEmitDualMobileStoryReelSlots(touchpointIds)
  const wantsDualStoryFeed = shouldEmitDualSocialStoryFeedSlots(touchpointIds)
  if ((!wantsDualMobile && !wantsDualStoryFeed) || !surfaces.includes('social')) {
    return surfaces
  }
  const others = surfaces.filter((s) => s !== 'social')
  const budgetForOthers = Math.max(0, maxSurfaces - 2)
  return [...others.slice(0, budgetForOthers), 'social', 'social_secondary']
}

function maxCtaSurfaces(contentDensityBias: -1 | 0 | 1): number {
  if (contentDensityBias === -1) return 2
  return 3
}

/**
 * Intentional phrase-bank gaps (surface routing × `primaryGoal`). When true, folio 05
 * omits this surface so CTAs do not fall through to generic goal-level fallbacks.
 *
 * @see packages/generation/dev/cta-phrase-banks/CTA_COPY_RULES.md §4 (Intentional platform-goal gaps)
 * @see docs/research/CTA_BANK_AUDIT.md §4B.1
 */
function isIntentionalFolio05CtaGap(args: {
  surfaceId: GuideCtaSurfaceId
  primaryGoal: Exclude<PrimaryGoal, ''>
  socialTone: SocialCtaTone
  directoryPrimaryTouchpoint: TouchpointId | undefined
}): boolean {
  const { surfaceId, primaryGoal, socialTone, directoryPrimaryTouchpoint } = args
  if (surfaceId === 'social' || surfaceId === 'social_secondary') {
    if (socialTone !== 'professional') return false
    return primaryGoal === 'direct_sales' || primaryGoal === 'retention'
  }
  if (surfaceId === 'directory') {
    const family = directoryListingFamilyFromPrimaryId(directoryPrimaryTouchpoint)
    if (family === 'post_offer') {
      return primaryGoal === 'audience_growth' || primaryGoal === 'retention'
    }
    return primaryGoal === 'lead_gen' || primaryGoal === 'audience_growth' || primaryGoal === 'retention'
  }
  return false
}

type CtaIntentTier = 'discover' | 'consider' | 'act'
type CtaSurfaceActionMode = 'shop' | 'book' | 'message' | 'save' | 'subscribe' | 'reengage'
type CtaRiskProfile = 'standard' | 'sensitive_industry'
type CtaOfferMode = 'product' | 'service' | 'mixed'

interface CtaCompositionContext {
  primaryGoal: Exclude<PrimaryGoal, ''>
  businessOperatingModel: BusinessOperatingModel | ''
  offerId: string
  deliveryId: string | undefined
  stage: string
  industry: string
  brandNarrator: string
  /** Step 3 tone preset; normalized inside strategy for CTA phrase routing. */
  tonePreset: string
  painPoints: string | undefined
  desiredOutcomes: string | undefined
}

interface CtaCompositionStrategy {
  intentTier: CtaIntentTier
  riskProfile: CtaRiskProfile
  offerMode: CtaOfferMode
  socialTone: SocialCtaTone
  variantSeed: number
  industryGroup: ReturnType<typeof industryGroupFromIndustry>
  voiceTone: ReturnType<typeof normalizeCtaVoiceTone>
  brandNarrator: string
  /** Soft phrase layer for sensitive density trim, excluding groups already authored softly (`regulated_services`, `health_wellness`). */
  phraseLowPressure: boolean
  actionBySurface: Record<GuideCtaSurfaceId, CtaSurfaceActionMode>
  outcomeHint?: string
  painHint?: string
  expectationHint?: string
}

function stableHash(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function pickDeterministicVariant<T>(variants: readonly T[], seed: number, scope: string): T {
  if (variants.length === 0) throw new Error('pickDeterministicVariant called with empty variants')
  const idx = stableHash(`${seed}:${scope}`) % variants.length
  return variants[idx] as T
}

function inferOfferMode(context: CtaCompositionContext): CtaOfferMode {
  const offer = context.offerId.toLowerCase()
  const delivery = (context.deliveryId ?? '').toLowerCase()
  if (/(product|shop|store|retail|merch|physical)/.test(offer)) return 'product'
  if (/(service|consult|coaching|book|appointment|session)/.test(offer)) return 'service'
  if (/(shipping|pickup|delivery)/.test(delivery)) return 'product'
  if (/(call|meeting|consult|appointment|session)/.test(delivery)) return 'service'
  if (context.businessOperatingModel === 'online_only') return 'product'
  if (context.businessOperatingModel === 'we_travel_to_customers') return 'service'
  return 'mixed'
}

function intentTierFromGoal(primaryGoal: Exclude<PrimaryGoal, ''>): CtaIntentTier {
  if (primaryGoal === 'audience_growth') return 'discover'
  if (primaryGoal === 'lead_gen') return 'consider'
  return 'act'
}

function actionModeForSurface(args: {
  surface: GuideCtaSurfaceId
  primaryGoal: Exclude<PrimaryGoal, ''>
  offerMode: CtaOfferMode
}): CtaSurfaceActionMode {
  const { surface, primaryGoal, offerMode } = args
  if (primaryGoal === 'audience_growth') {
    return surface === 'social' || surface === 'social_secondary' ? 'subscribe' : 'save'
  }
  if (primaryGoal === 'retention') return 'reengage'
  if (primaryGoal === 'direct_sales') {
    if (surface === 'email' || surface === 'social' || surface === 'social_secondary') return 'shop'
    if (surface === 'directory') return offerMode === 'service' ? 'book' : 'shop'
  }
  if (surface === 'website' || surface === 'marketplace') return offerMode === 'service' ? 'book' : 'shop'
  if (surface === 'email' || surface === 'directory') {
    return primaryGoal === 'lead_gen' ? 'message' : offerMode === 'service' ? 'book' : 'message'
  }
  return primaryGoal === 'lead_gen' ? 'message' : offerMode === 'service' ? 'book' : 'shop'
}

function expectationHintForContext(context: CtaCompositionContext): string | undefined {
  if (context.primaryGoal === 'lead_gen') return 'I will follow up within one business day'
  if (context.primaryGoal === 'direct_sales') {
    if (inferOfferMode(context) === 'product') return 'checkout is quick and straightforward'
    return 'you can choose a time in one step'
  }
  if (context.primaryGoal === 'retention') return 'you can pick up where you left off'
  return undefined
}

function resolveCtaStrategy(args: {
  socialTone: SocialCtaTone
  context: CtaCompositionContext
}): CtaCompositionStrategy {
  const { socialTone, context } = args
  const offerMode = inferOfferMode(context)
  const industryGroup = industryGroupFromIndustry(context.industry)
  const voiceTone = normalizeCtaVoiceTone(context.tonePreset, {
    emptyPresetSocialTone: socialTone === 'professional' ? 'professional' : 'casual',
  })
  const riskProfile: CtaRiskProfile = INDUSTRIES_DENSITY_TRIM.has(context.industry)
    ? 'sensitive_industry'
    : 'standard'
  const phraseLowPressure =
    riskProfile === 'sensitive_industry' &&
    industryGroup !== 'regulated_services' &&
    industryGroup !== 'health_wellness'
  const actionBySurface: Record<GuideCtaSurfaceId, CtaSurfaceActionMode> = {
    website: actionModeForSurface({ surface: 'website', primaryGoal: context.primaryGoal, offerMode }),
    email: actionModeForSurface({ surface: 'email', primaryGoal: context.primaryGoal, offerMode }),
    social: actionModeForSurface({ surface: 'social', primaryGoal: context.primaryGoal, offerMode }),
    social_secondary: actionModeForSurface({
      surface: 'social_secondary',
      primaryGoal: context.primaryGoal,
      offerMode,
    }),
    marketplace: actionModeForSurface({ surface: 'marketplace', primaryGoal: context.primaryGoal, offerMode }),
    directory: actionModeForSurface({ surface: 'directory', primaryGoal: context.primaryGoal, offerMode }),
  }
  const variantSeed = stableHash(
    [
      context.primaryGoal,
      context.businessOperatingModel || 'none',
      context.offerId,
      context.deliveryId || 'none',
      context.stage,
      context.industry,
      industryGroup,
      voiceTone,
      context.tonePreset,
      context.painPoints || 'none',
      context.desiredOutcomes || 'none',
      socialTone,
      offerMode,
      riskProfile,
    ].join('|'),
  )
  return {
    intentTier: intentTierFromGoal(context.primaryGoal),
    riskProfile,
    offerMode,
    socialTone,
    variantSeed,
    industryGroup,
    voiceTone,
    brandNarrator: context.brandNarrator,
    phraseLowPressure,
    actionBySurface,
    outcomeHint: readableFragment(context.desiredOutcomes, 8),
    painHint: readableFragment(context.painPoints, 8),
    expectationHint: expectationHintForContext(context),
  }
}

/** Fingerprint of the lines actually shown after voice / overlap dedupe. */
function renderedCtaSignature(lines: readonly string[]): string {
  return lines.map((l) => normalizeCtaLineKey(l)).join('\u0000')
}

/**
 * Choose paste-ready lines for one surface, avoiding the same rendered pair
 * already used on another folio 05 surface (dual feed + story, same bank).
 */
function composeSurfaceCtaLines(args: {
  surface: GuideCtaSurfaceId
  primaryGoal: Exclude<PrimaryGoal, ''>
  strategy: CtaCompositionStrategy
  directoryPrimaryTouchpoint?: TouchpointId
  forbidden: Set<string>
  usedRenderedCtaSignatures: Set<string>
}): string[] {
  const { surface, primaryGoal, strategy, forbidden, usedRenderedCtaSignatures } = args
  const action = strategy.actionBySurface[surface]
  const directoryFamily =
    surface === 'directory' ? directoryListingFamilyFromPrimaryId(args.directoryPrimaryTouchpoint) : undefined
  const phraseCtx: PasteReadyPhraseContext = {
    surface,
    action,
    primaryGoal,
    industryGroup: strategy.industryGroup,
    voiceTone: strategy.voiceTone,
    socialTone: strategy.socialTone,
    brandNarrator: strategy.brandNarrator,
    lowPressure: strategy.phraseLowPressure,
    outcomeHint: strategy.outcomeHint,
    painHint: strategy.painHint,
    expectationHint: strategy.expectationHint,
    directoryFamily,
  }
  const variants = getPasteReadyCtaVariants(phraseCtx)
  const scope = `surface:${surface}:action:${action}:group:${strategy.industryGroup}:voice:${strategy.voiceTone}:social:${strategy.socialTone}:intent:${strategy.intentTier}:dir:${directoryFamily ?? 'na'}`
  const tryTuples = (rows: ReadonlyArray<readonly [string, string]>, scopeKey: string): string[] | null => {
    if (rows.length === 0) return null
    const n = rows.length
    const base = stableHash(`${strategy.variantSeed}:${scopeKey}`) % n
    for (let k = 0; k < n; k += 1) {
      const idx = (base + k) % n
      const tup = rows[idx]!
      const lines = dedupeCtaLines([tup[0], tup[1]], forbidden, 2)
      if (lines.length === 0) continue
      const sig = renderedCtaSignature(lines)
      if (!usedRenderedCtaSignatures.has(sig)) {
        usedRenderedCtaSignatures.add(sig)
        return lines
      }
    }
    return null
  }

  const fromBank = tryTuples(variants, scope)
  if (fromBank) return fromBank

  const fb = fallbackPasteReadyByGoal()[primaryGoal] ?? [
    ['Say hello when you are ready.', 'Reply with what you need and we will point you to the next step.'],
  ]
  const fromFallback = tryTuples(fb, `fallback:${scope}`)
  if (fromFallback) return fromFallback

  const tup = pickDeterministicVariant(fb, strategy.variantSeed, `fallback_force:${scope}`)
  const lines = dedupeCtaLines([tup[0], tup[1]], forbidden, 2)
  usedRenderedCtaSignatures.add(renderedCtaSignature(lines))
  return lines
}

function linesForSurface(args: {
  surface: GuideCtaSurfaceId
  primaryGoal: Exclude<PrimaryGoal, ''>
  strategy: CtaCompositionStrategy
  directoryPrimaryTouchpoint?: TouchpointId
  forbidden: Set<string>
  usedRenderedCtaSignatures: Set<string>
}): string[] {
  return composeSurfaceCtaLines(args)
}

function pickSurfaces(
  touchpointIds: TouchpointId[],
  max: number,
  primaryGoal: Exclude<PrimaryGoal, ''>,
): GuideCtaSurfaceId[] {
  const has = (predicate: (id: TouchpointId) => boolean) => touchpointIds.some(predicate)

  const candidates: GuideCtaSurfaceId[] = []
  if (has((id) => id === 'website' || id === 'blog')) candidates.push('website')
  if (has((id) => id === 'email_newsletter')) candidates.push('email')
  if (has(isDirectoryTouchpoint)) candidates.push('directory')
  if (has(isMarketplaceTouchpoint)) candidates.push('marketplace')
  if (has(isSocialTouchpoint)) candidates.push('social')

  const socialIds = touchpointIds.filter(isSocialTouchpoint)
  const directoryIds = touchpointIds.filter(isDirectoryTouchpoint)
  const socialTone: SocialCtaTone = socialIds.length > 0 ? socialCtaTone(socialIds) : 'casual'
  const directoryPrimary = directoryIds[0]

  const ordered: GuideCtaSurfaceId[] = []
  const preferred: GuideCtaSurfaceId[] = ['website', 'email', 'directory', 'marketplace', 'social']
  for (const id of preferred) {
    if (!candidates.includes(id)) continue
    if (isIntentionalFolio05CtaGap({ surfaceId: id, primaryGoal, socialTone, directoryPrimaryTouchpoint: directoryPrimary }))
      continue
    if (!ordered.includes(id)) ordered.push(id)
    if (ordered.length >= max) break
  }
  return ordered
}

/**
 * Surface-aware CTAs for folio 05.
 *
 * Labels stay plain English, while line tone shifts based on selected social
 * platforms (e.g. short DM-first prompts vs. more formal connection language).
 *
 * External constraints baked into wording choices:
 * - NN/g: avoid vague CTAs like “Get started”; prefer specific outcomes.
 * - WCAG-adjacent copy hygiene: avoid “click here”; keep lines readable as link text.
 */
export function composeCtaSurfaceBlocks(args: {
  primaryGoal: Exclude<PrimaryGoal, ''>
  touchpointIds: TouchpointId[]
  contentDensityBias: -1 | 0 | 1
  businessOperatingModel: BusinessOperatingModel | ''
  offerId: string
  deliveryId: string | undefined
  stage: string
  industry: string
  brandNarrator: string
  tonePreset: string
  painPoints: string | undefined
  desiredOutcomes: string | undefined
  samplePhrases: string[]
  doLines: string[]
  ctaTemplates: string[]
}): GuideCtaSurfaceBlock[] {
  const {
    primaryGoal,
    touchpointIds,
    contentDensityBias,
    businessOperatingModel,
    offerId,
    deliveryId,
    stage,
    industry,
    brandNarrator,
    tonePreset,
    painPoints,
    desiredOutcomes,
    samplePhrases,
    doLines,
    ctaTemplates,
  } = args
  if (touchpointIds.length === 0) return []

  const maxSurfaces = maxCtaSurfaces(contentDensityBias)
  const surfaces = expandDualMobileSocialSurfaces(
    pickSurfaces(touchpointIds, maxSurfaces, primaryGoal),
    touchpointIds,
    maxSurfaces,
  )
  if (surfaces.length === 0) return []

  const socialIds = touchpointIds.filter(isSocialTouchpoint)
  const directoryIds = touchpointIds.filter(isDirectoryTouchpoint)
  const socialTone = socialIds.length > 0 ? socialCtaTone(socialIds) : 'casual'
  const strategy = resolveCtaStrategy({
    socialTone,
    context: {
      primaryGoal,
      businessOperatingModel,
      offerId,
      deliveryId,
      stage,
      industry,
      brandNarrator,
      tonePreset,
      painPoints,
      desiredOutcomes,
    },
  })
  const facebookStoryId = touchpointIds.find((id) => id === 'facebook')
  const reelPrimaryId = touchpointIds.find((id) => id === 'tiktok' || id === 'youtube')
  const instagramPrimaryId = touchpointIds.find((id) => id === 'instagram')

  const forbidden = new Set<string>()
  for (const line of [...samplePhrases, ...doLines, ...ctaTemplates]) {
    forbidden.add(normalizeCtaLineKey(line))
  }

  /** Avoids identical paste-ready pairs on two folio 05 surfaces (e.g. feed + story). */
  const usedRenderedCtaSignatures = new Set<string>()

  const blocks: GuideCtaSurfaceBlock[] = []
  for (const surface of surfaces) {
    const socialPresentation =
      surface === 'social' && facebookStoryId && reelPrimaryId
        ? composeSocialFeedPresentationForPrimary(socialTone, facebookStoryId)
        : surface === 'social_secondary' && reelPrimaryId
          ? composeSocialFeedPresentationForPrimary(socialTone, reelPrimaryId)
      : surface === 'social_secondary' && facebookStoryId && instagramPrimaryId
          ? composeSocialFeedPresentationForPrimary(socialTone, facebookStoryId)
          : surface === 'social'
            ? composeSocialFeedPresentation(socialIds, socialTone)
            : null

    const label =
      surface === 'website'
        ? 'Website'
        : surface === 'email'
          ? 'Email'
          : surface === 'social'
            ? (socialPresentation?.platformSummary ?? 'Social')
            : surface === 'social_secondary'
              ? (socialPresentation?.platformSummary ?? 'Social')
              : surface === 'marketplace'
                ? 'Marketplace'
                : 'Directory listing'

    const lines = linesForSurface({
      surface,
      primaryGoal,
      strategy,
      directoryPrimaryTouchpoint: surface === 'directory' ? directoryIds[0] : undefined,
      forbidden,
      usedRenderedCtaSignatures,
    })
    if (lines.length === 0) continue

    const socialPrimaryForFrame =
      surface === 'social' && facebookStoryId && reelPrimaryId
        ? facebookStoryId
        : surface === 'social_secondary' && reelPrimaryId
          ? reelPrimaryId
      : surface === 'social_secondary' && facebookStoryId && instagramPrimaryId
          ? facebookStoryId
          : socialIds[0]

    const framePickSurface =
      surface === 'website'
        ? 'website'
        : surface === 'email'
          ? 'email'
          : surface === 'marketplace'
            ? 'marketplace'
            : surface === 'directory'
              ? 'directory'
              : 'social'

    const frameId = pickCtaFrameId(framePickSurface, socialTone, socialPrimaryForFrame, directoryIds[0])
    const presentation: GuideCtaPresentation | undefined =
      (surface === 'social' || surface === 'social_secondary') && frameId && socialPresentation
        ? { frameId, ...socialPresentation }
        : surface === 'email' && frameId
          ? { frameId, emailSurfaceFamily: 'text_only' }
          : surface === 'marketplace' && frameId
            ? { frameId, marketplaceSurfaceFamily: 'listing' }
            : surface === 'directory' && frameId
              ? {
                  frameId,
                  directorySurfaceFamily:
                    frameId === 'directory_sponsored_listing_v1' ? 'sponsored_listing' : 'post_offer',
                }
              : surface === 'website' && frameId
                ? { frameId, websiteSurfaceFamily: 'hero' }
                : frameId
                  ? { frameId }
                  : undefined
    blocks.push({ id: surface, label, lines, presentation })
  }

  return blocks
}

/**
 * Convert an all-caps specimen role band (e.g. "HEADLINES & DISPLAY") into a
 * reader-friendly label ("Headlines & display") for typography application
 * rows on the Look spread.
 */
function toSentenceCaseLabel(label: string): string {
  const trimmed = label.trim()
  if (!trimmed) return ''
  const lower = trimmed.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

/**
 * One-line brand statement derived from the Brief anchor. Returns lead +
 * transformation (the first two sentences of the anchor), stripping the
 * trailing "The voice stays …" clause so the result reads as a short
 * paste-able sentence a reader could drop into a bio or sign-off.
 *
 * Guide-local: the anchor field is already on the model; do not touch the
 * upstream Voice Playbook assembler.
 */
export function composeBrandOneLine(anchor: string): string {
  if (!anchor.trim()) return ''
  const sentences = toSentenceList(anchor).filter(
    (sentence) => !/^The voice stays\b/i.test(sentence.trim()),
  )
  return sentences.slice(0, 2).join(' ').trim()
}

function extractDifferentiator(body: string, explicit?: string): string | undefined {
  const fromIntake = explicit?.trim()
  if (fromIntake) return fromIntake

  if (!body.trim()) return undefined
  const genericPatterns = [/Use this Brief to name yours/i, /often comes from relationships/i]
  if (genericPatterns.some((pattern) => pattern.test(body))) return undefined

  if (body.startsWith('Compared with ')) {
    const afterCompared = body.slice('Compared with '.length)
    const dotIdx = afterCompared.indexOf('.')
    const statement = dotIdx >= 0 ? afterCompared.slice(dotIdx + 1).trim() : afterCompared.trim()
    return statement || undefined
  }

  return body.replace(/\.$/, '').trim() || undefined
}

function parseDoAvoidSections(body: string): { dos: string[]; avoids: string[] } {
  const dos: string[] = []
  const avoids: string[] = []
  let mode: 'do' | 'avoid' | null = null

  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('✓ ')) {
      mode = 'do'
      dos.push(line.slice(2).trim())
      continue
    }
    if (line.startsWith('✗ ')) {
      mode = 'avoid'
      avoids.push(line.slice(2).trim())
      continue
    }
    if (line.startsWith('Do ')) {
      mode = 'do'
      dos.push(line.slice(3).trim())
      continue
    }
    if (line.startsWith('Avoid ')) {
      mode = 'avoid'
      avoids.push(line.slice(6).trim())
      continue
    }
    if (line.startsWith("Don't ")) {
      mode = 'avoid'
      avoids.push(line)
      continue
    }
    if (mode === 'do') dos.push(line)
    if (mode === 'avoid') avoids.push(line)
  }

  return { dos, avoids }
}

function extractQuotedLines(body: string, maxCount: number): string[] {
  return body
    .split('\n')
    .map((line) => line.trim().replace(/^[•*-]\s*/, '').trim())
    .filter((line) => line.startsWith('"') && line.endsWith('"'))
    .slice(0, maxCount)
}

/**
 * Extract colon-lead lines like `Expertise: in {industry}...` from the
 * `Messaging themes` playbook body, stripping the colon lead. Only takes
 * lines after the first blank line so we skip the framing paragraph and
 * any trailing "Industry vocabulary:" / "Steer around" sections.
 */
export function extractColonLeadLines(body: string, maxCount: number): string[] {
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const pool = paragraphs.length > 1 ? paragraphs.slice(1) : paragraphs
  const out: string[] = []
  for (const para of pool) {
    for (const rawLine of para.split('\n')) {
      const line = rawLine.trim()
      const match = line.match(/^([A-Z][^:\n]{1,50}):\s+(\S.*)$/)
      if (!match) continue
      const lead = match[1] ?? ''
      if (/^(industry vocabulary|steer around|preferred terms|avoid)$/i.test(lead.trim())) continue
      out.push((match[2] ?? '').trim())
      if (out.length >= maxCount) return out
    }
  }
  return out
}

/**
 * Extract plain-sentence lines from bodies like `narratorUsageNotes` that
 * emit one sentence per line. Filters empty lines and takes the first
 * `maxCount` entries.
 */
export function extractPlainSentenceLines(body: string, maxCount: number): string[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxCount)
}

function extractBulletLines(body: string, maxCount: number): string[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('• '))
    .map((line) => line.slice(2).trim())
    .slice(0, maxCount)
}

function parseBeforeAfter(body: string): Array<{ label: string; before: string; after: string }> {
  const paragraphs = body.split('\n\n')
  const result: Array<{ label: string; before: string; after: string }> = []
  let i = 0
  while (i < paragraphs.length) {
    const block = paragraphs[i] ?? ''
    const lines = block.split('\n')
    if (lines.length >= 3) {
      result.push({
        label: lines[0] ?? '',
        before: (lines[1] ?? '').replace(/^Before:\s*"?/, '').replace(/"$/, ''),
        after: (lines[2] ?? '').replace(/^After:\s*"?/, '').replace(/"$/, ''),
      })
    } else if (lines.length === 1 && lines[0]) {
      const nextBlock = paragraphs[i + 1] ?? ''
      const nextLines = nextBlock.split('\n')
      if (nextLines.length >= 2) {
        result.push({
          label: lines[0],
          before: (nextLines[0] ?? '').replace(/^Before:\s*"?/, '').replace(/"$/, ''),
          after: (nextLines[1] ?? '').replace(/^After:\s*"?/, '').replace(/"$/, ''),
        })
        i += 1
      }
    }
    i += 1
  }
  return result.filter((pair) => pair.before && pair.after)
}

const MIN_SUBSTANTIVE_BEFORE_AFTER_CHARS = 12
const MIN_STORY_WORDS_FOR_SURFACE = 8

/**
 * Up to 3 deterministic "feel" adjectives derived from `tonePreset` +
 * `voiceSliders`. Rendered on folio 03 as the "Feel" inline trait list
 * (narrow column). Each adjective is a single word; no em-dashes, no prose.
 */
export function positioningFeelAdjectives(
  tonePreset: string,
  sliders: VoiceSliders,
): string[] {
  const words: string[] = []
  if (tonePreset === 'friendly') words.push('warm', 'approachable')
  else if (tonePreset === 'professional') words.push('calm', 'composed')
  else if (tonePreset === 'bold') words.push('direct', 'confident')
  if (sliders.warmth >= 70) words.push('human')
  if (sliders.directness >= 70) words.push('clear')
  if (sliders.playfulness >= 70) words.push('light')
  if (sliders.formality >= 75) words.push('measured')
  if (sliders.energy >= 75) words.push('vivid')
  return [...new Set(words)].slice(0, 3)
}

/**
 * Short plain-language feel sentence built on top of `positioningFeelAdjectives`.
 * Kept as a signal-only field for non-PDF consumers and for the generic
 * trust-cue body fallback in `selectPositioningTrustCue`. Not rendered on
 * folio 03; the adjectives ship as a list in the narrow column instead.
 */
function positioningFeelLine(
  tonePreset: string,
  sliders: VoiceSliders,
): string | undefined {
  const uniq = positioningFeelAdjectives(tonePreset, sliders)
  if (uniq.length === 0) return undefined
  if (uniq.length === 1) return `It should feel ${uniq[0]}.`
  if (uniq.length === 2) return `It should feel ${uniq[0]} and ${uniq[1]}.`
  return `It should feel ${uniq[0]}, ${uniq[1]}, and ${uniq[2]}.`
}

/** Industries where shorter, tighter example surfaces reduce risk of overclaiming tone. */
const INDUSTRIES_DENSITY_TRIM = new Set([
  'legal_professional_services',
  'finance',
  'health_wellness',
])

export interface PositioningTrustCueContext {
  businessName: string
  differentiator: string | undefined
  emphasis: BrandIdentityGuideSignals['emphasis']
  collaboratorBody: string | undefined
  feelLine: string | undefined
  industry: string
  customerArchetype: string
  painPoints: string | undefined
  desiredOutcomes: string | undefined
  competitors: string[]
  contentDensityBias: BrandIdentityGuideSignals['contentDensityBias']
}

function sentence(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, ' ')
  if (!trimmed) return ''
  return /[.!?]\s*$/.test(trimmed) ? trimmed : `${trimmed}.`
}

function readableFragment(raw: string | undefined, maxWords: number): string | undefined {
  const first = raw
    ?.split(/\n|[.;]/)
    .map((part) => part.trim().replace(/^[-•*]\s*/, ''))
    .find(Boolean)
  if (!first) return undefined
  const withoutLead = first.includes(':') ? first.split(':').slice(1).join(':').trim() : first
  const words = withoutLead
    .replace(/^["']|["']$/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxWords)
  if (words.length < 2) return undefined
  const fragment = words.join(' ').replace(/[,.!?;:]$/, '')
  return fragment.charAt(0).toLowerCase() + fragment.slice(1)
}

function audiencePhrase(context: PositioningTrustCueContext): string | undefined {
  const title = context.customerArchetype.trim()
  if (!title) return undefined
  return title.replace(/^the\s+/i, '').toLowerCase()
}

function outcomeTrustSentence(context: PositioningTrustCueContext): string | undefined {
  const audience = audiencePhrase(context)
  const outcome = readableFragment(context.desiredOutcomes, 8)
  if (!outcome) return undefined
  return audience
    ? sentence(`It gives ${audience} a clearer path to ${outcome}`)
    : sentence(`It gives people a clearer path to ${outcome}`)
}

function painFitSentence(context: PositioningTrustCueContext): string | undefined {
  const audience = audiencePhrase(context)
  const pain = readableFragment(context.painPoints, 8)
  if (!audience || !pain) return undefined
  return sentence(`It is built for ${audience} when ${pain}`)
}

function competitorClaritySentence(context: PositioningTrustCueContext): string | undefined {
  if (context.competitors.filter(Boolean).length === 0) return undefined
  const basis = INDUSTRIES_DENSITY_TRIM.has(context.industry)
    ? 'clear expectations, plain proof, and careful claims'
    : 'clear expectations, specific proof, and a recognizable point of view'
  return sentence(`In a crowded category, trust comes from ${basis}`)
}

function genericTrustBase(context: PositioningTrustCueContext): string {
  if (INDUSTRIES_DENSITY_TRIM.has(context.industry)) {
    return `${context.businessName} earns trust by staying clear, careful, and easy to verify.`
  }
  return `${context.businessName} earns trust by being specific, consistent, and easy to act on.`
}

function trustCueSupportSentence(context: PositioningTrustCueContext): string | undefined {
  return (
    outcomeTrustSentence(context)
    ?? painFitSentence(context)
    ?? competitorClaritySentence(context)
    ?? context.feelLine
  )
}

/**
 * Pick exactly one trust anchor for folio 02.
 * Priority: differentiator > collaborator (when emphasis === 'handoff') > generic.
 * The rail owns this cue. The footer never echoes a second cue.
 */
export function selectPositioningTrustCue(context: PositioningTrustCueContext): PositioningTrustCue {
  const support = trustCueSupportSentence(context)
  if (context.differentiator && context.differentiator.trim()) {
    const body = sentence(context.differentiator)
    return {
      kind: 'differentiator',
      label: 'Your edge',
      body: support && context.contentDensityBias !== -1 ? `${body} ${support}` : body,
    }
  }
  if (context.emphasis === 'handoff' && context.collaboratorBody && context.collaboratorBody.trim()) {
    return {
      kind: 'collaborator',
      label: 'For someone helping you',
      body: support
        ? `${sentence(context.collaboratorBody)} ${support}`
        : sentence(context.collaboratorBody),
    }
  }
  const base = genericTrustBase(context)
  return {
    kind: 'generic',
    label: 'How it earns trust',
    body: support ? `${base} ${support}` : base,
  }
}

function behaviorShowsUpAs(tonePreset: string, feelAdjectives: string[]): string {
  const feel = feelAdjectives.length > 0
    ? feelAdjectives.join(', ')
    : tonePreset === 'bold'
      ? 'direct and confident'
      : tonePreset === 'friendly'
        ? 'warm and clear'
        : 'calm and composed'
  return sentence(`Shows up as ${feel} in public language`)
}

function behaviorAvoids(tonePreset: string, industry: string): string {
  if (INDUSTRIES_DENSITY_TRIM.has(industry)) {
    return 'Avoids overpromising, hype, and claims that are hard to verify.'
  }
  if (tonePreset === 'bold') return 'Avoids empty volume, vague confidence, and cleverness without proof.'
  if (tonePreset === 'friendly') return 'Avoids sounding casual when the next step needs clarity.'
  return 'Avoids vague polish, heavy jargon, and copy that hides the useful point.'
}

function behaviorEarnsTrustBy(context: PositioningTrustCueContext): string {
  const outcome = readableFragment(context.desiredOutcomes, 7)
  if (outcome) return sentence(`Earns trust by making the path to ${outcome} practical`)
  const pain = readableFragment(context.painPoints, 7)
  if (pain) return sentence(`Earns trust by naming ${pain} plainly`)
  if (context.competitors.filter(Boolean).length > 0) {
    return 'Earns trust by making the difference easy to see before anyone compares options.'
  }
  return 'Earns trust by making the next useful step obvious.'
}

function composePositioningBrandBehavior(
  form: IdentityKitForm,
  context: PositioningTrustCueContext,
  feelAdjectives: string[],
): PositioningBrandBehavior {
  return {
    showsUpAs: behaviorShowsUpAs(form.step3.tonePreset, feelAdjectives),
    avoids: behaviorAvoids(form.step3.tonePreset, form.step1.industry),
    earnsTrustBy: behaviorEarnsTrustBy(context),
  }
}

function positioningDek(guideFocus: Exclude<GuideFocus, ''>): string {
  switch (guideFocus) {
    case 'sound_more_consistent':
      return 'The feel of the brand and the one reason it earns trust.'
    case 'give_clear_direction':
      return 'What should feel true about the brand before anyone writes a line.'
    case 'know_what_to_fix_first':
      return 'What should feel true about the brand before any visible fixes.'
    case 'look_more_professional':
    default:
      return 'How the brand should come across, not only how it looks.'
  }
}

const GENERIC_BEFORE_AFTER_LABEL_RE = /^\s*(example|pair)\s*\d*\s*$/i
const META_COMMENTARY_PATTERNS: RegExp[] = [
  /position(ed)?\s+ourselves/i,
  /in a (friendlier|bolder|warmer|cooler|calmer)\s+tone/i,
  /we should sound/i,
  /\barchetype\b/i,
  /\bnarrator\b/i,
  /\bpersona\b/i,
]

function normalizeBeforeAfter(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0
  if (!a) return b.length
  if (!b) return a.length
  const m = a.length
  const n = b.length
  const dp: number[] = new Array(n + 1).fill(0)
  for (let j = 0; j <= n; j++) dp[j] = j
  for (let i = 1; i <= m; i++) {
    let prev = dp[0] ?? 0
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j] ?? 0
      if (a.charCodeAt(i - 1) === b.charCodeAt(j - 1)) {
        dp[j] = prev
      } else {
        dp[j] = 1 + Math.min(prev, dp[j] ?? 0, dp[j - 1] ?? 0)
      }
      prev = tmp
    }
  }
  return dp[n] ?? 0
}

/**
 * Deterministic rubric for folio 04 before/after pairs.
 * A pair qualifies when:
 * - label is concrete (not "Example"/"Pair" or under 3 chars)
 * - both sides clear the minimum character threshold
 * - after is not meta-commentary (no "position ourselves", "archetype", etc.)
 * - normalized before !== after, and either the first token differs or
 *   Levenshtein-over-max-length exceeds 0.3 (keeps synonym-only swaps out)
 */
export function isQualifyingBeforeAfterPair(pair: {
  label: string
  before: string
  after: string
}): boolean {
  const label = pair.label.trim()
  if (label.length < 3) return false
  if (GENERIC_BEFORE_AFTER_LABEL_RE.test(label)) return false
  const before = pair.before.trim()
  const after = pair.after.trim()
  if (before.length < MIN_SUBSTANTIVE_BEFORE_AFTER_CHARS) return false
  if (after.length < MIN_SUBSTANTIVE_BEFORE_AFTER_CHARS) return false
  if (META_COMMENTARY_PATTERNS.some((re) => re.test(after))) return false
  const nb = normalizeBeforeAfter(before)
  const na = normalizeBeforeAfter(after)
  if (!nb || !na) return false
  if (nb === na) return false
  const beforeFirstToken = nb.split(' ')[0] ?? ''
  const afterFirstToken = na.split(' ')[0] ?? ''
  if (beforeFirstToken !== afterFirstToken) return true
  const dist = levenshteinDistance(nb, na)
  const maxLen = Math.max(nb.length, na.length, 1)
  return dist / maxLen > 0.3
}

/**
 * Omit borderline "story" material so page 02 does not run a thin founder arc;
 * when omitted, the feel line carries the no-story case instead.
 */
function refineStoryNoteForGuide(note: string | undefined): string | undefined {
  if (!note?.trim()) return undefined
  const words = note.trim().split(/\s+/).filter(Boolean)
  if (words.length < MIN_STORY_WORDS_FOR_SURFACE) return undefined
  return note.trim()
}

function guideWordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

function sparseSafeStandsForLine(form: IdentityKitForm): string | undefined {
  const candidate = composePersonalityStandsFor(form)
  if (!candidate) return undefined
  const intakeSources = [form.step4.missionStatement, form.step5.motivation]
    .map((value) => sentence(value ?? ''))
    .filter(Boolean)
  if (!intakeSources.includes(candidate)) return undefined
  return guideWordCount(candidate) <= 22 ? candidate : undefined
}

function positioningStandsForLine(
  form: IdentityKitForm,
  contentDensityBias: BrandIdentityGuideSignals['contentDensityBias'],
): string | undefined {
  if (contentDensityBias === -1) return sparseSafeStandsForLine(form)
  return composePersonalityStandsFor(form)
}

function contentDensityBiasFromStageAndTouchpoints(stage: string, touchCount: number): -1 | 0 | 1 {
  const s = stage.toLowerCase()
  let score = 0
  if (s === 'new' || s === 'idea' || s === 'starting_fresh') score -= 1
  if (s === 'established' || s === 'protecting_recognition' || s === 'scaling') score += 1
  if (touchCount >= 4) score += 1
  if (touchCount <= 1) score -= 1
  if (score <= -1) return -1
  if (score >= 1) return 1
  return 0
}

function contentDensityOffsetFromIndustryAndSliders(industry: string, sliders: VoiceSliders): -1 | 0 | 1 {
  let score = 0
  if (INDUSTRIES_DENSITY_TRIM.has(industry)) score -= 1
  const expressiveAvg = (sliders.warmth + sliders.energy + sliders.playfulness) / 3
  if (expressiveAvg >= 68) score += 1
  if (sliders.formality >= 82 && sliders.directness >= 82) score -= 1
  if (score <= -1) return -1
  if (score >= 1) return 1
  return 0
}

function clampDensityBias(sum: number): -1 | 0 | 1 {
  if (sum <= -1) return -1
  if (sum >= 1) return 1
  return 0
}

function resolvePrimaryGoal(form: IdentityKitForm): Exclude<PrimaryGoal, ''> {
  return form.step1.primaryGoal || 'direct_sales'
}

function resolveGuideFocus(form: IdentityKitForm): Exclude<GuideFocus, ''> {
  return form.step1.guideFocus || 'look_more_professional'
}

function resolveNormalizedTouchpointIds(form: IdentityKitForm): ReturnType<typeof normalizeTouchpoints> {
  return normalizeTouchpoints((form.step1.touchpoints as unknown as string[] | undefined) ?? [])
}

function resolveVoiceTraits(form: IdentityKitForm): string[] {
  const traits: string[] = []
  if (form.step3.tonePreset === 'friendly') traits.push('warm', 'clear')
  if (form.step3.tonePreset === 'professional') traits.push('polished', 'trustworthy')
  if (form.step3.tonePreset === 'bold') traits.push('direct', 'confident')
  if (form.step3.voiceSliders.warmth >= 75) traits.push('human')
  if (form.step3.voiceSliders.directness >= 75) traits.push('purposeful')
  if (form.step3.voiceSliders.playfulness >= 75) traits.push('light')
  if (form.step3.voiceSliders.formality >= 75) traits.push('composed')
  if (form.step3.voiceSliders.energy >= 75) traits.push('energetic')
  return [...new Set(traits)].slice(0, 3)
}

const VOICE_PAGE_BOTTOM_BAND_TITLE = ''

const GUIDE_FOCUS_QUICK_START_WEEK: Record<Exclude<GuideFocus, ''>, 1 | 2 | 4> = {
  look_more_professional: 1,
  sound_more_consistent: 2,
  know_what_to_fix_first: 2,
  give_clear_direction: 4,
}

function voicePageQuickStartPointer(guideFocus: Exclude<GuideFocus, ''>): string {
  const week = GUIDE_FOCUS_QUICK_START_WEEK[guideFocus]
  return `Not sure where to start? See Week ${week} in Quick Start.`
}

/** Second band on Voice (folio 03): plain-language framing below traits / rules / CTAs. */
function voicePageBottomBandBody(guideFocus: Exclude<GuideFocus, ''>): string {
  const weekPointer = voicePageQuickStartPointer(guideFocus)
  return `${weekPointer} Use this page as your voice reference.`
}

function resolvePaletteRows(paletteId: string): PaletteRow[] {
  const canonicalId = canonicalPaletteId(paletteId)
  return guidePaletteRows[canonicalId] ?? guidePaletteRows.minimal_light
}

/** Equal-width swatch strip data — shared by Brand Identity Guide folio 02a and Style Guide deck folio 01. */
export function visualPaletteSwatchesWithRoles(
  paletteId: string,
): Array<{ hex: string; name: string; role: string }> {
  const rows = resolvePaletteRows(paletteId)
  const named = uniqueFriendlySwatchNames(rows.map((row) => ({ hex: row.hex })))
  return rows.map((row, index) => ({
    hex: row.hex,
    role: row.role,
    name: named[index]?.name ?? friendlyColorName(row.hex),
  }))
}

export function visualPaletteSwatches(paletteId: string): Array<{ hex: string; name: string }> {
  return visualPaletteSwatchesWithRoles(paletteId).map(({ hex, name }) => ({ hex, name }))
}

export function buildBrandIdentityGuideModel(form: IdentityKitForm): BrandIdentityGuideModel {
  const guideFocus = resolveGuideFocus(form)
  const primaryGoal = resolvePrimaryGoal(form)
  const touchpointIds = resolveNormalizedTouchpointIds(form)
  const primaryTouchpoint = touchpointIds[0] ? getTouchpointLabel(touchpointIds[0]) : 'your main channel'
  const stageTouchBias = contentDensityBiasFromStageAndTouchpoints(form.step1.stage, touchpointIds.length)
  const industrySliderBias = contentDensityOffsetFromIndustryAndSliders(
    form.step1.industry,
    form.step3.voiceSliders,
  )
  const contentDensityBias = clampDensityBias(stageTouchBias + industrySliderBias)
  const briefBlocks = brandBriefBlocks(form)
  const styleBlocks = styleGuideBlocks(form)
  const voiceBlocks = voicePlaybookBlocks(form)

  const toneBody = blockByHeading(voiceBlocks, 'Tone profile')
  const guardrailsBody = blockByHeading(voiceBlocks, 'Voice guardrails')
  const messagingThemesBody = blockByHeading(voiceBlocks, 'Messaging themes')
  const samplePhrasesBody = blockByHeading(voiceBlocks, 'Sample phrases')
  const ctaBody = blockByHeading(voiceBlocks, 'Calls to action (CTAs)')
  const writingBody = blockByHeading(voiceBlocks, 'Writing do / avoid')
  const beforeAfterBody = blockByHeading(voiceBlocks, 'Before / after examples')

  const { dos, avoids } = parseDoAvoidSections(writingBody || guardrailsBody)
  const ctaExamples = extractBulletLines(
    ctaBody.includes(VOICE_PLAYBOOK_CTA_BODY_SPLIT)
      ? ctaBody.split(VOICE_PLAYBOOK_CTA_BODY_SPLIT)[2] ?? ''
      : ctaBody,
    3,
  )
  const storyNote = refineStoryNoteForGuide(composePersonalityStoryQuote(form))
  const differentiator = extractDifferentiator(
    blockByHeading(briefBlocks, 'Differentiation'),
    form.step7.differentiation,
  )
  const overviewBody = blockByHeading(briefBlocks, 'Brand overview')
  const idealCustomerBody = blockByHeading(briefBlocks, 'Ideal customer')
  const transformation = blockByHeading(briefBlocks, 'Core transformation')
  const whatWeDo = extractWhatWeDo(overviewBody)
  const whoItsFor = extractAudience(idealCustomerBody)
  const brandAnchor = blockByHeading(briefBlocks, 'Brand anchor')
  const brandOneLine = composeBrandOneLine(brandAnchor)
  const focus = focusMeta[guideFocus]
  const emphasis = focus.emphasis
  const feelAdjectives = positioningFeelAdjectives(form.step3.tonePreset, form.step3.voiceSliders)
  const feelLine = positioningFeelLine(form.step3.tonePreset, form.step3.voiceSliders)
  const trustCueContext: PositioningTrustCueContext = {
    businessName: form.step1.businessName,
    differentiator,
    emphasis,
    collaboratorBody: emphasis === 'handoff' ? focus.collaborator : undefined,
    feelLine,
    industry: form.step1.industry,
    customerArchetype: resolveBuyerArchetypeTitle(form.step2.customerArchetype, form.step1.industry),
    painPoints: form.step2.painPoints,
    desiredOutcomes: form.step2.desiredOutcomes,
    competitors: form.step7.competitors,
    contentDensityBias,
  }
  const trustCue = selectPositioningTrustCue(trustCueContext)
  const behavior = composePositioningBrandBehavior(form, trustCueContext, feelAdjectives)
  const standsForLine = positioningStandsForLine(form, contentDensityBias)
  const baseSamplePhraseCap =
    emphasis === 'visual' ? 3 : emphasis === 'voice' || emphasis === 'action' ? 6 : 4
  const maxSamplePhrases = Math.min(6, Math.max(2, baseSamplePhraseCap + contentDensityBias))
  const maxBeforeAfterPairs =
    emphasis === 'visual' ? 1 : contentDensityBias === -1 ? 1 : 2
  const voiceListCap = contentDensityBias === -1 ? 2 : 3
  const examplesExampleDensity: GuideExampleDensity =
    emphasis === 'voice' || emphasis === 'action' ? 'high' : emphasis === 'visual' ? 'low' : 'medium'
  const examplesVisualOccupancy: GuideVisualOccupancy = emphasis === 'voice' ? 'strong' : 'medium'
  const lookVisualOccupancy: GuideVisualOccupancy =
    emphasis === 'visual' ? 'strong' : emphasis === 'voice' ? 'light' : 'medium'
  const visualKeywords = styleKeywordMap[form.step6.selectedStyle] ?? ['clear', 'consistent', 'intentional']
  const paletteId = canonicalPaletteId(form.step6.selectedPalette)
  const visualDirectionBody = blockByHeading(styleBlocks, 'Visual direction') || toneBody
  const imageryBody = blockByHeading(styleBlocks, 'Imagery direction')
  const typographySpecimens = typographySpecimenSlots(form)

  const beforeAfterPairs = parseBeforeAfter(beforeAfterBody)
    .filter(isQualifyingBeforeAfterPair)
    .slice(0, maxBeforeAfterPairs)
  // Samples fallback: when the rubric removes every before/after pair, raise
  // sample-phrase cap to the upper bound so the Examples spread stays populated.
  const effectiveMaxSamplePhrases = beforeAfterPairs.length === 0 ? 6 : maxSamplePhrases
  // De-duplicate folio 03 RULES (voice.rules) and folio 04 DO / AVOID (examples.doLines):
  // voice takes the head of `dos`; examples takes the next, disjoint slice.
  const voiceRules = dos.slice(0, voiceListCap)
  const examplesDoLines = dos.slice(voiceListCap, voiceListCap + voiceListCap)
  // Hoisted so `composeColorSummary` can rank the same swatches the page renders.
  const visualSwatches = uniqueFriendlySwatchNames(resolvePaletteRows(paletteId).map((row) => ({
    hex: row.hex,
  })))
  const samplePhrases = extractQuotedLines(samplePhrasesBody, effectiveMaxSamplePhrases)
  const ctaIndustryGroup = industryGroupFromIndustry(form.step1.industry)
  const socialIdsForCtaVoice = touchpointIds.filter(isSocialTouchpoint)
  const ctaEmptyPresetSocial =
    socialIdsForCtaVoice.length === 0
      ? 'casual'
      : socialCtaTone(socialIdsForCtaVoice) === 'professional'
        ? 'professional'
        : 'casual'
  const ctaVoiceTone = normalizeCtaVoiceTone(form.step3.tonePreset, {
    emptyPresetSocialTone: ctaEmptyPresetSocial,
  })
  const ctaTemplates = composeCtaTemplates(primaryGoal, ctaExamples, {
    industryGroup: ctaIndustryGroup,
    voiceTone: ctaVoiceTone,
    sensitiveIndustry:
      INDUSTRIES_DENSITY_TRIM.has(form.step1.industry) &&
      ctaIndustryGroup !== 'regulated_services' &&
      ctaIndustryGroup !== 'health_wellness',
    seedKey: `${form.step1.businessOperatingModel}|${form.step1.offer.offerId}|${form.step1.stage}|${form.step3.tonePreset}`,
  })
  const ctaSurfaces = composeCtaSurfaceBlocks({
    primaryGoal,
    touchpointIds,
    contentDensityBias,
    businessOperatingModel: form.step1.businessOperatingModel,
    offerId: form.step1.offer.offerId,
    deliveryId: form.step1.offer.deliveryId,
    stage: form.step1.stage,
    industry: form.step1.industry,
    brandNarrator: form.step1.brandNarrator || 'solo_expert',
    tonePreset: form.step3.tonePreset,
    painPoints: form.step2.painPoints,
    desiredOutcomes: form.step2.desiredOutcomes,
    samplePhrases,
    doLines: examplesDoLines,
    ctaTemplates,
  })
  const colorSummary = composeColorSummary({
    paletteId,
    tonePreset: form.step3.tonePreset,
    selectedStyle: form.step6.selectedStyle,
    swatches: visualSwatches,
  })
  const editorialTriplet = composePersonalityEditorialTriplet(
    form,
    { guideFocus, primaryGoal, contentDensityBias },
    {
      summaryOneLine: brandOneLine,
      summaryWhatWeDo: whatWeDo,
      summaryWhoItsFor: whoItsFor,
      trustCueBody: trustCue.body,
      visualSystemCharacter: colorSummary.systemCharacter,
      visualUsageDiscipline: colorSummary.usageDiscipline,
    },
  )
  const wordmarkColorBlocks = paletteContrastBlocks(resolvePaletteRows(paletteId))
  const wordmarkBandRail = composeTypographyWordmarkRail(form, wordmarkColorBlocks.length)
  return {
    signals: {
      guideFocus,
      primaryGoal,
      primaryTouchpoint,
      emphasis: focus.emphasis,
      touchpointCount: touchpointIds.length,
      contentDensityBias,
    },
    summary: {
      template: 'heroRail',
      editorial: {
        folio: '01',
        navLabel: 'Summary',
        title: form.step1.businessName,
        layout: 'heroQuoteRail',
        dekMode: 'none',
        visualOccupancy: 'medium',
        exampleDensity: 'low',
        figureLabel: 'Anchor quote',
      },
      anchor: brandAnchor,
      oneLine: brandOneLine,
      whatWeDo,
      whoItsFor,
      transformation,
      guidingTraits: form.step4.values.slice(0, 3),
      differentiator,
      focusLead: focus.lead,
    },
    positioning: {
      template: 'heroRail',
      editorial: {
        folio: '03',
        navLabel: 'Personality',
        title: 'How your brand should come across',
        layout: 'proseQuoteRail',
        dekMode: 'full',
        deck: storyNote
          ? 'The feel and the one credible reason behind it.'
          : positioningDek(guideFocus),
        visualOccupancy: 'medium',
        exampleDensity: 'low',
      },
      layoutVariant: storyNote ? 'storyHeavy' : 'supportHeavy',
      title: form.step1.businessName,
      focusLead: focus.lead,
      storyNote,
      feelAdjectives,
      feelLine,
      editorialTriplet,
      standsForLine,
      oneLine: storyNote ? undefined : brandOneLine || undefined,
      behavior,
      trustCue,
    },
    voice: {
      template: 'referenceGrid',
      editorial: {
        folio: '04',
        navLabel: 'Voice',
        title: 'How your brand sounds',
        layout: 'traitsSamples',
        dekMode: 'full',
        deck: 'Pick this up when you need the brand to sound like itself in a hurry.',
        visualOccupancy: emphasis === 'voice' ? 'strong' : emphasis === 'visual' ? 'light' : 'medium',
        exampleDensity: emphasis === 'voice' ? 'high' : 'medium',
        figureLabel: 'Voice examples',
      },
      traits: resolveVoiceTraits(form),
      rules: voiceRules,
      messagingAngles: extractColonLeadLines(messagingThemesBody, voiceListCap),
      bottomBand: {
        title: VOICE_PAGE_BOTTOM_BAND_TITLE,
        body: voicePageBottomBandBody(guideFocus),
      },
    },
    examples: {
      template: 'showcase',
      editorial: {
        folio: '05',
        navLabel: 'Examples',
        title: 'Your brand voice in use',
        layout: 'sampleShowcase',
        dekMode: 'full',
        deck: 'Lines you can copy into your site, posts, and emails.',
        visualOccupancy: examplesVisualOccupancy,
        exampleDensity: examplesExampleDensity,
        figureLabel: 'Before / after examples',
      },
      samplePhrases,
      doLines: examplesDoLines,
      avoidLines: avoids.slice(0, Math.min(2, voiceListCap)),
      ctaTemplates,
      ctaSurfaces,
      beforeAfter: beforeAfterPairs,
    },
    visual: {
      template: 'visualBoard',
      editorial: {
        folio: '02a',
        navLabel: 'Look',
        title: 'Your colors',
        layout: 'visualSystemBoard',
        dekMode: 'none',
        visualOccupancy: lookVisualOccupancy,
        exampleDensity: 'medium',
      },
      paletteId,
      swatches: visualSwatches,
      summary: colorSummary,
      visualCaption: firstSentences(visualDirectionBody, 1) || firstParagraphs(visualDirectionBody, 1),
      visualKeywords,
      typography: {
        editorial: {
          folio: '02b',
          navLabel: 'Look',
          title: 'Your typography',
          layout: 'visualSystemBoard',
          dekMode: 'full',
          deck: 'How your brand name looks in color, and the typefaces it sits in.',
          visualOccupancy: lookVisualOccupancy,
          exampleDensity: 'medium',
        },
        wordmarkBandRail,
        specimens: typographySpecimens,
        applications: typographySpecimens.map((specimen) => ({
          face: specimen.faceLabel,
          use: toSentenceCaseLabel(specimen.roleEyebrow),
        })),
        wordmarkColorBlocks,
        typefaceSpecimens: typographySpecimens.map((specimen) => ({
          faceLabel: specimen.faceLabel,
          pdfFamily: specimen.pdfFamily,
          roleEyebrow: specimen.roleEyebrow,
        })),
      },
      imageryDirection: firstSentences(imageryBody, 1) || imageryBody,
    },
  }
}
