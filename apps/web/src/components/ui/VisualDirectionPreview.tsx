import type { CSSProperties } from 'react'

import { canonicalPaletteId } from '@identity-kit/shared'

import { PALETTE_LABELS, PALETTE_OPTIONS } from '../../data/visualDirection'

const palettePreviewSwatches: Record<string, string[]> = Object.fromEntries(
  PALETTE_OPTIONS.map((palette) => [palette.id, palette.swatches]),
) as Record<string, string[]>

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace('#', '')
  if (h.length !== 6) return null
  const n = parseInt(h, 16)
  if (Number.isNaN(n)) return null
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const lin = (c: number) => {
    const x = c / 255
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
  }
  const R = lin(rgb.r)
  const G = lin(rgb.g)
  const B = lin(rgb.b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function sortSwatchesDarkestToLightest(swatches: string[]): [string, string, string, string] {
  const s = [...swatches].sort((a, b) => relativeLuminance(a) - relativeLuminance(b))
  while (s.length < 4) s.push('#888888')
  return [s[0]!, s[1]!, s[2]!, s[3]!]
}

function rgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`
}

type Ranked = { D: string; M1: string; M2: string; L: string }

function rankedFromSwatches(swatches: string[]): Ranked {
  const [D, M1, M2, L] = sortSwatchesDarkestToLightest(swatches)
  return { D, M1, M2, L }
}

/** Palette ink on swatch: use darkest on light grounds, lightest on dark (same ranked extremes). */
function inkForSwatchBackground(bg: string, r: Ranked): string {
  return relativeLuminance(bg) > 0.45 ? r.D : r.L
}

/** Shared chrome for style mocks. Matches clean and bold so switching styles does not resize the card. */
const STYLE_SAMPLE_FRAME = 'rounded-xl border p-3'

type StyleSkin = {
  hint: string
  frameClass: string
  frameStyle: CSSProperties
  /** Title slot is always h-2.5 × w-2/3; hairline draws 1px inside that slot. */
  titleHairline: boolean
  titleInnerClass: string
  titleStyle: CSSProperties
  eyebrowClass: string
  eyebrowStyle: CSSProperties
  /** Body rows are always h-2; hairline draws 1px centered in the slot. */
  bodyHairline: boolean
  bodyInnerClass: string
  bodyStyle: CSSProperties
  /** Accent is always h-8 w-full; this is only corner treatment. */
  accentShapeClass: string
  accentStyle: CSSProperties
  chipsClass: string
  /** When set, chip row uses these (e.g. bold omits frame color D so chips stay visible). */
  chipSwatches?: string[]
}

function placeholderStyleSkin(): StyleSkin {
  return {
    // Hint stays blank in placeholder mode — the floating bubble in the
    // preview body carries the "pick a style" message instead. The bottom
    // hint slot keeps its height via a non-breaking-space fallback in the
    // JSX so the row doesn't collapse when no style is selected.
    hint: '',
    frameClass: `${STYLE_SAMPLE_FRAME} border-dashed border-gray-300 bg-white text-gray-400`,
    frameStyle: {},
    titleHairline: false,
    titleInnerClass: 'rounded',
    titleStyle: { backgroundColor: '#e5e7eb' },
    eyebrowClass:
      'inline-flex rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400',
    eyebrowStyle: {},
    bodyHairline: false,
    bodyInnerClass: 'rounded',
    bodyStyle: { backgroundColor: '#f3f4f6' },
    accentShapeClass: 'rounded-md border border-dashed border-gray-300',
    accentStyle: { backgroundColor: 'transparent' },
    chipsClass: 'rounded-sm',
    // Override the palette-driven chips with a neutral gray ramp so the
    // unselected sample reads as fully tonally muted, not partially "live".
    chipSwatches: ['#d1d5db', '#e5e7eb', '#f3f4f6'],
  }
}

function styleSkin(activeStyle: string, r: Ranked, anchor: string): StyleSkin {
  if (!activeStyle) return placeholderStyleSkin()
  if (activeStyle === 'bold_graphic') {
    const { D, L, M1, M2 } = r
    return {
      hint: 'Stark contrast and a loud, simple hierarchy. Little ornament, strong focus.',
      frameClass: STYLE_SAMPLE_FRAME,
      frameStyle: {
        backgroundColor: D,
        borderColor: rgba(L, 0.22),
        color: L,
      },
      titleHairline: false,
      titleInnerClass: 'rounded',
      titleStyle: { backgroundColor: L },
      eyebrowClass:
        'inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]',
      eyebrowStyle: { backgroundColor: rgba(L, 0.14), color: L },
      bodyHairline: false,
      bodyInnerClass: 'rounded',
      bodyStyle: { backgroundColor: rgba(L, 0.38) },
      accentShapeClass: 'rounded',
      accentStyle: { backgroundColor: M1 },
      chipsClass: 'rounded-sm',
      chipSwatches: [M1, M2, L],
    }
  }

  if (activeStyle === 'organic_natural') {
    const { D, M1, L } = r
    return {
      hint: 'Rounded forms, relaxed rhythm, and a tone that stays soft from edge to edge.',
      frameClass: STYLE_SAMPLE_FRAME,
      frameStyle: {
        backgroundColor: L,
        borderColor: rgba(D, 0.14),
        color: rgba(D, 0.82),
      },
      titleHairline: false,
      titleInnerClass: 'rounded-full',
      titleStyle: { backgroundColor: rgba(D, 0.1) },
      eyebrowClass:
        'inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
      eyebrowStyle: {
        backgroundColor: rgba(D, 0.07),
        color: rgba(D, 0.62),
      },
      bodyHairline: false,
      bodyInnerClass: 'rounded-full',
      bodyStyle: { backgroundColor: rgba(M1, 0.22) },
      accentShapeClass: 'rounded-[1.25rem]',
      accentStyle: { backgroundColor: anchor },
      chipsClass: 'rounded-full',
    }
  }

  if (activeStyle === 'luxe_refined') {
    const { D, M1 } = r
    return {
      hint: 'Thin rules, wide margins, and a reserved, gallery-like calm.',
      frameClass: `${STYLE_SAMPLE_FRAME} border-zinc-200 bg-white text-zinc-800`,
      frameStyle: {},
      titleHairline: true,
      titleInnerClass: '',
      titleStyle: { backgroundColor: D },
      eyebrowClass:
        'inline-flex rounded-sm px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em]',
      eyebrowStyle: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: rgba(D, 0.18),
        color: rgba(D, 0.62),
        backgroundColor: '#ffffff',
      },
      bodyHairline: true,
      bodyInnerClass: '',
      bodyStyle: { backgroundColor: rgba(M1, 0.55) },
      accentShapeClass: 'rounded-none',
      accentStyle: {
        backgroundColor: anchor,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: rgba(D, 0.32),
      },
      chipsClass: 'rounded-none',
    }
  }

  // clean_minimal — white field + neutral UI grays (palette only in chips + accent); frame is the layout reference.
  return {
    hint: 'Straightforward structure, even spacing, and a clear, uncluttered read.',
    frameClass: `${STYLE_SAMPLE_FRAME} border-gray-200 bg-white text-gray-900`,
    frameStyle: {},
    titleHairline: false,
    titleInnerClass: 'rounded',
    titleStyle: { backgroundColor: 'rgb(17 24 39 / 0.8)' },
    eyebrowClass:
      'inline-flex rounded-md bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500',
    eyebrowStyle: {},
    bodyHairline: false,
    bodyInnerClass: 'rounded',
    bodyStyle: { backgroundColor: '#e5e7eb' },
    accentShapeClass: 'rounded-md',
    accentStyle: { backgroundColor: anchor },
    chipsClass: 'rounded-sm',
  }
}

export function VisualDirectionPreview({
  paletteId,
  styleId,
  mode,
  brandLabel,
}: {
  paletteId: string
  styleId: string
  mode: 'palette' | 'style'
  /** First words of the business name for the mock eyebrow; falls back when empty. */
  brandLabel?: string
}) {
  const eyebrowText = (brandLabel?.trim() || 'Your brand').slice(0, 48)
  const resolvedPaletteId = canonicalPaletteId(paletteId)
  const swatches = palettePreviewSwatches[resolvedPaletteId] ?? palettePreviewSwatches.minimal_light
  const ranked = rankedFromSwatches(swatches)
  const paletteDisplayName =
    resolvedPaletteId && PALETTE_LABELS[resolvedPaletteId]
      ? PALETTE_LABELS[resolvedPaletteId]
      : 'Your palette'
  const activeStyle = styleId
  const anchorSwatch = swatches[0] ?? ranked.D
  const skin = styleSkin(activeStyle, ranked, anchorSwatch)

  const sampleFixedClass = 'w-[272px] max-w-[92vw] shrink-0'

  const styleAdaptiveSample = (
    <div className={`${sampleFixedClass} ${skin.frameClass}`} style={skin.frameStyle}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-2.5 w-2/3 shrink-0 items-center">
          {skin.titleHairline ? (
            <div className="h-px w-full" style={skin.titleStyle} aria-hidden />
          ) : (
            <div
              className={`h-full w-full ${skin.titleInnerClass}`}
              style={skin.titleStyle}
              aria-hidden
            />
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          {(skin.chipSwatches ?? swatches.slice(0, 3)).map((color, i) => (
            <span
              key={`${color}-${i}`}
              className={`h-2.5 w-2.5 ${skin.chipsClass}`}
              style={{ backgroundColor: color }}
              aria-hidden
            />
          ))}
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex min-h-[28px] items-center">
          <div
            className={`${skin.eyebrowClass} max-w-full min-w-0 truncate`}
            style={skin.eyebrowStyle}
            title={eyebrowText}
          >
            {eyebrowText}
          </div>
        </div>
        <div className={`h-8 w-full ${skin.accentShapeClass}`} style={skin.accentStyle} aria-hidden />
        <div className="flex h-2 w-4/5 shrink-0 items-center">
          {skin.bodyHairline ? (
            <div className="h-px w-full" style={skin.bodyStyle} aria-hidden />
          ) : (
            <div
              className={`h-full w-full ${skin.bodyInnerClass}`}
              style={skin.bodyStyle}
              aria-hidden
            />
          )}
        </div>
        <div className="flex h-2 w-3/5 shrink-0 items-center">
          {skin.bodyHairline ? (
            <div className="h-px w-full" style={skin.bodyStyle} aria-hidden />
          ) : (
            <div
              className={`h-full w-full ${skin.bodyInnerClass}`}
              style={skin.bodyStyle}
              aria-hidden
            />
          )}
        </div>
      </div>
    </div>
  )

  if (mode === 'style') {
    const isPlaceholder = !activeStyle
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">Style direction</p>
        <div className="mt-4 flex flex-col items-center gap-4">
          <div
            className={`${sampleFixedClass} flex items-center gap-2.5`}
            aria-label={`Selected palette: ${paletteDisplayName}`}
          >
            <p className="min-w-0 flex-1 truncate text-left text-sm font-medium text-gray-900">{paletteDisplayName}</p>
            <div
              className="flex shrink-0 gap-px overflow-hidden rounded border border-gray-200/80 bg-white p-px"
              aria-hidden
            >
              {swatches.map((color) => (
                <span key={color} className="h-3 w-3.5 sm:w-4" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div className="relative flex justify-center">
            {styleAdaptiveSample}
            {isPlaceholder ? (
              <div
                role="status"
                className="pointer-events-none absolute left-1/2 top-1/2 w-[340px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 text-center text-base font-semibold leading-snug tracking-tight text-gray-900 shadow-md backdrop-blur-sm"
              >
                Pick a style to see how it shapes the visuals
              </div>
            ) : null}
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-sm px-1 text-center text-xs leading-relaxed text-gray-600">
          {skin.hint || '\u00A0'}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">Color direction</p>
      <div className="mt-3 grid grid-cols-2 items-stretch gap-3">
        <div className="flex h-full min-h-0 min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-3">
          <div
            className="flex min-h-0 flex-1 gap-1"
            aria-label={`${paletteDisplayName}: lettering on each swatch`}
          >
            {swatches.map((hex, i) => (
              <div
                key={`${hex}-tile-${i}`}
                className="flex min-h-0 min-w-0 flex-1 flex-col justify-end rounded-sm px-0.5 pb-1 pt-1"
                style={{ backgroundColor: hex }}
              >
                <p
                  aria-hidden
                  className="text-center text-lg font-medium leading-none tracking-tight"
                  style={{ color: inkForSwatchBackground(hex, ranked) }}
                >
                  Aa
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex h-full min-h-0 min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-12 rounded bg-gray-900/75" />
            <div className="flex gap-1">
              {swatches.slice(0, 3).map((color) => (
                <span
                  key={color}
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
              ))}
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-7 rounded-md" style={{ backgroundColor: anchorSwatch }} />
            <div className="h-2 w-4/5 rounded bg-gray-200" />
            <div className="h-2 w-3/5 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
