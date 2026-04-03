/**
 * Writes `alchemy-symbol-strip.svg` and `alchemy-symbol-strip.png` (same graphic; PNG for Slides)
 * matching the web `AlchemySymbolStrip` layout:
 * - Strip height h-7 → 28px; glyphs h-3.5 w-3.5 → 14px (50% of strip height)
 * - mr-1 between glyphs → 4px; center text text-[10.5px] font-semibold, mx-1 around center
 *
 * Coordinate system: viewBox height 100 = strip height (28px). Scale: 1px ≈ 100/28 units.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Resvg } from '@resvg/resvg-js'

import { type SymbolId, getStripLayout } from '../src/symbolStrip.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

const STRIP_H = 100
const PX = STRIP_H / 28

const STROKE = '#3f3f46'
const LINE = '#e4e4e7'

/** h-3.5 w-3.5 = 14px; viewBox 0 0 100 100 scaled into 14px → scale 0.5 in a 100-tall strip (14/28). */
const GLYPH_SCALE = 0.5
const GLYPH_BOX = 100 * GLYPH_SCALE

/** mr-1 = 4px */
const GAP_MR1 = 4 * PX
/** mx-1 = 4px each side on center span */
const GAP_MX1 = 4 * PX

/** Gap from last left glyph to center text start = mr-1 + mx-1 left = 8px */
const GAP_LAST_TO_CENTER_TEXT = 8 * PX

/** ~width of "β△" at 10.5px (tune for visual parity) */
const CENTER_TEXT_WIDTH = 18 * PX

/** 10.5px / 28px * 100 */
const CENTER_FONT_SIZE = (10.5 / 28) * STRIP_H

/** 1px border (zinc-200 hairlines) */
const BORDER_W = 1 * PX

/** Vertical offset so scale(0.5) of 100×100 glyph centers in strip: (100 - 50) / 2 = 25 */
const GLYPH_Y = (STRIP_H - 100 * GLYPH_SCALE) / 2

/**
 * Raster width for PNG (Slides often recompresses huge images — ~2.4k px is enough for full-width HD).
 * Increase if strokes look soft; decrease if Slides still crushes detail.
 */
const PNG_WIDTH_PX = 2400

function glyphInner(id: SymbolId): string {
  const s = `fill="none" stroke="${STROKE}" stroke-width="7"`
  switch (id) {
    case 'sun':
      return `<circle cx="50" cy="50" r="30" ${s} /><circle cx="50" cy="50" r="6" fill="${STROKE}" />`
    case 'mercury':
      return `<path d="M34 20 C34 40, 66 40, 66 20" ${s} stroke-linecap="round" /><circle cx="50" cy="49" r="14" ${s} /><line x1="50" y1="63" x2="50" y2="83" ${s} stroke-linecap="round" /><line x1="36" y1="73" x2="64" y2="73" ${s} stroke-linecap="round" />`
    case 'fire':
      return `<polygon points="50,24 80,76 20,76" ${s} stroke-linejoin="round" />`
    case 'sulfur':
      return `<polygon points="50,28 74,64 26,64" ${s} stroke-linejoin="round" /><line x1="50" y1="64" x2="50" y2="88" ${s} stroke-linecap="round" /><line x1="26" y1="77" x2="74" y2="77" ${s} stroke-linecap="round" />`
    case 'air':
      return `<polygon points="50,24 80,76 20,76" ${s} stroke-linejoin="round" /><line x1="24" y1="50" x2="76" y2="50" ${s} stroke-linecap="round" />`
    case 'salt':
      return `<circle cx="50" cy="50" r="30" ${s} /><line x1="20" y1="50" x2="80" y2="50" ${s} stroke-linecap="round" />`
    case 'earth':
      return `<polygon points="20,24 80,24 50,76" ${s} stroke-linejoin="round" /><line x1="24" y1="50" x2="76" y2="50" ${s} stroke-linecap="round" />`
  }
}

/** One glyph: 100×100 paths scaled to 50×50, vertically centered like the site */
function glyphAt(x: number, id: SymbolId): string {
  return `<g transform="translate(${x},${GLYPH_Y}) scale(${GLYPH_SCALE})">${glyphInner(id)}</g>`
}

/**
 * PNG via Resvg (not Sharp/librsvg): crisper strokes on geometric SVGs at 1:1 scale in Slides.
 * @see https://github.com/thx/resvg-js
 */
function writeSvgRasterToPng(svg: string, outPath: string): void {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: PNG_WIDTH_PX },
    shapeRendering: 2, // geometricPrecision
    textRendering: 2, // geometricPrecision — center β△ label
    font: { loadSystemFonts: true },
  })
  const png = resvg.render().asPng()
  writeFileSync(outPath, png)
}

async function main() {
  const { leftSide, rightSide } = getStripLayout()
  const chunks: string[] = []

  let cursor = 0

  for (const id of leftSide) {
    chunks.push(glyphAt(cursor, id))
    cursor += GLYPH_BOX + GAP_MR1
  }

  const lastLeftGlyphRight = cursor - GAP_MR1

  const centerTextCenterX = lastLeftGlyphRight + GAP_LAST_TO_CENTER_TEXT + CENTER_TEXT_WIDTH / 2

  // Vector fire triangle (same path as row glyphs) + text β — not Unicode "β△" so Resvg/fonts
  // can't shrink △ relative to β. Layout: reserved slot [slotLeft, slotLeft + CENTER_TEXT_WIDTH].
  const slotLeft = centerTextCenterX - CENTER_TEXT_WIDTH / 2
  chunks.push(
    `<text x="${slotLeft + 8}" y="${STRIP_H / 2}" dominant-baseline="middle" text-anchor="end" font-size="${CENTER_FONT_SIZE}" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="600" letter-spacing="-0.02em" fill="${STROKE}">β</text>`,
  )
  chunks.push(glyphAt(slotLeft + 14, 'fire'))

  cursor = lastLeftGlyphRight + GAP_LAST_TO_CENTER_TEXT + CENTER_TEXT_WIDTH + GAP_MX1

  for (const id of rightSide) {
    chunks.push(glyphAt(cursor, id))
    cursor += GLYPH_BOX + GAP_MR1
  }

  const stripWidth = cursor - GAP_MR1
  const pad = 16
  const totalW = stripWidth + pad * 2

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${STRIP_H}" width="${totalW}" height="${STRIP_H}" role="img" aria-label="Brand Alchemy symbol strip">
  <rect x="0" y="0" width="${totalW}" height="${STRIP_H}" fill="white"/>
  <line x1="0" y1="${BORDER_W / 2}" x2="${totalW}" y2="${BORDER_W / 2}" stroke="${LINE}" stroke-width="${BORDER_W}"/>
  <line x1="0" y1="${STRIP_H - BORDER_W / 2}" x2="${totalW}" y2="${STRIP_H - BORDER_W / 2}" stroke="${LINE}" stroke-width="${BORDER_W}"/>
  <g transform="translate(${pad},0)">
    ${chunks.join('\n    ')}
  </g>
</svg>
`

  const outSvg = join(__dirname, '..', 'alchemy-symbol-strip.svg')
  const outPng = join(__dirname, '..', 'alchemy-symbol-strip.png')
  writeFileSync(outSvg, svg, 'utf8')
  console.log(`Wrote ${outSvg} (${totalW}×${STRIP_H}, strip ${stripWidth}u wide)`)

  writeSvgRasterToPng(svg, outPng)
  console.log(`Wrote ${outPng} (${PNG_WIDTH_PX}px wide, Resvg)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
