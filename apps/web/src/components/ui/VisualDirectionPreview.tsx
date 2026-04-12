import { canonicalPaletteId } from '@identity-kit/shared'

import { PALETTE_LABELS, PALETTE_OPTIONS } from '../../data/visualDirection'

const palettePreviewSwatches: Record<string, string[]> = Object.fromEntries(
  PALETTE_OPTIONS.map((palette) => [palette.id, palette.swatches]),
) as Record<string, string[]>

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
  const paletteDisplayName =
    resolvedPaletteId && PALETTE_LABELS[resolvedPaletteId]
      ? PALETTE_LABELS[resolvedPaletteId]
      : 'Your palette'
  const activeStyle = styleId || 'clean_minimal'
  const stylePreview =
    activeStyle === 'bold_graphic'
      ? {
          hint: 'High contrast, assertive hierarchy, and more punch.',
          frame: 'rounded-xl border border-gray-900 bg-gray-900 p-3 text-white',
          eyebrow: 'mb-2 inline-flex rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white',
          title: 'h-3 w-3/4 rounded bg-white',
          body: 'h-2 rounded bg-white/35',
          accent: 'h-8 rounded bg-white',
          chips: 'rounded-sm',
        }
      : activeStyle === 'organic_natural'
        ? {
            hint: 'Softer spacing and a warmer, handcrafted feel.',
            frame: 'rounded-[1.5rem] border border-[#D8D2C8] bg-[#F7F1E8] p-4 text-[#4B3F35]',
            eyebrow:
              'mb-3 inline-flex rounded-full bg-[#E8DDD0] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7A6858]',
            title: 'h-3 w-2/3 rounded-full bg-[#8A7768]',
            body: 'h-2 rounded-full bg-[#D6C6B5]',
            accent: 'h-9 rounded-[1.25rem] bg-[#CDAF8A]',
            chips: 'rounded-full',
          }
        : activeStyle === 'luxe_refined'
          ? {
              hint: 'Quiet typography, restraint, and premium spacing.',
              frame: 'rounded-xl border border-[#D8C9B0] bg-[#FAF7F2] p-4 text-[#43372C]',
              eyebrow:
                'mb-3 inline-flex border border-[#D8C9B0] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#8A755E]',
              title: 'h-px w-2/3 bg-[#43372C]',
              body: 'h-px bg-[#D8C9B0]',
              accent: 'h-10 border border-[#D8C9B0] bg-white',
              chips: 'rounded-none',
            }
          : {
              hint: 'Calm spacing with a clean, practical structure.',
              frame: 'rounded-xl border border-gray-200 bg-white p-3 text-gray-900',
              eyebrow:
                'mb-3 inline-flex rounded-md bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500',
              title: 'h-2.5 w-2/3 rounded bg-gray-900/80',
              body: 'h-2 rounded bg-gray-200',
              accent: 'h-7 rounded-md bg-gray-900',
              chips: 'rounded-sm',
            }

  const sampleFixedClass = 'w-[272px] max-w-[92vw] shrink-0'

  const styleAdaptiveSample = (
    <div className={`${sampleFixedClass} ${stylePreview.frame}`}>
      <div className="flex items-center justify-between">
        <div className={stylePreview.title} />
        <div className="flex gap-1">
          {swatches.slice(0, 3).map((color) => (
            <span
              key={color}
              className={`h-2.5 w-2.5 ${stylePreview.chips}`}
              style={{ backgroundColor: color }}
              aria-hidden
            />
          ))}
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className={`${stylePreview.eyebrow} max-w-full min-w-0 truncate`} title={eyebrowText}>
          {eyebrowText}
        </div>
        <div className={stylePreview.accent} style={{ backgroundColor: swatches[0] }} />
        <div className={`${stylePreview.body} w-4/5`} />
        <div className={`${stylePreview.body} w-3/5`} />
      </div>
    </div>
  )

  if (mode === 'style') {
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
          {styleAdaptiveSample}
        </div>
        <p className="mx-auto mt-4 max-w-sm px-1 text-center text-xs leading-relaxed text-gray-600">
          {stylePreview.hint}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-400">Color direction</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-3">
          <div className="mb-3 flex gap-1">
            {swatches.map((color) => (
              <span
                key={color}
                className="h-4 flex-1 rounded-sm"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 w-2/3 rounded bg-gray-900/80" />
            <div className="h-2 w-full rounded bg-gray-200" />
            <div className="h-2 w-5/6 rounded bg-gray-200" />
          </div>
        </div>
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-3">
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
            <div className="h-7 rounded-md" style={{ backgroundColor: swatches[0] }} />
            <div className="h-2 w-4/5 rounded bg-gray-200" />
            <div className="h-2 w-3/5 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
