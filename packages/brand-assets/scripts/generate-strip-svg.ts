/**
 * Writes `alchemy-symbol-strip.svg` matching the web `AlchemySymbolStrip` layout:
 * - Strip height h-7 → 28px; glyphs h-3.5 w-3.5 → 14px (50% of strip height)
 * - mr-1 between glyphs → 4px; center text text-[10.5px] font-semibold, mx-1 around center
 *
 * Coordinate system: viewBox height 100 = strip height (28px). Scale: 1px ≈ 100/28 units.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { STRIP_CENTER_LABEL, type SymbolId, getStripLayout } from '../src/symbolStrip.ts'

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

function glyphInner(id: SymbolId): string {
  const s = `fill="none" stroke="${STROKE}" stroke-width="7"`
  switch (id) {
    case 'sun':
      return `<circle cx="50" cy="50" r="30" ${s} /><circle cx="50" cy="50" r="6" fill="${STROKE}" />`
    case 'mercury':
      return `<path d="M34 20 C34 40, 66 40, 66 20" ${s} stroke-linecap="round" /><circle cx="50" cy="49" r="14" ${s} /><line x1="50" y1="63" x2="50" y2="83" ${s} stroke-linecap="round" /><line x1="36" y1="73" x2="64" y2="73" ${s} stroke-linecap="round" />`
    case 'fire':
      return `<polygon points="50,24 80,76 20,76" ${s} stroke-linejoin="round" />`
    case 'air':
      return `<polygon points="50,24 80,76 20,76" ${s} stroke-linejoin="round" /><line x1="28" y1="50" x2="72" y2="50" ${s} stroke-linecap="round" />`
    case 'salt':
      return `<circle cx="50" cy="50" r="30" ${s} /><line x1="20" y1="50" x2="80" y2="50" ${s} stroke-linecap="round" />`
    case 'earth':
      return `<polygon points="20,24 80,24 50,76" ${s} stroke-linejoin="round" /><line x1="28" y1="50" x2="72" y2="50" ${s} stroke-linecap="round" />`
    case 'circle':
    default:
      return `<circle cx="50" cy="50" r="30" ${s} />`
  }
}

/** One glyph: 100×100 paths scaled to 50×50, vertically centered like the site */
function glyphAt(x: number, id: SymbolId): string {
  return `<g transform="translate(${x},${GLYPH_Y}) scale(${GLYPH_SCALE})">${glyphInner(id)}</g>`
}

function main() {
  const { leftSide, rightSide } = getStripLayout()
  const chunks: string[] = []

  let cursor = 0

  for (const id of leftSide) {
    chunks.push(glyphAt(cursor, id))
    cursor += GLYPH_BOX + GAP_MR1
  }

  const lastLeftGlyphRight = cursor - GAP_MR1

  const centerTextCenterX = lastLeftGlyphRight + GAP_LAST_TO_CENTER_TEXT + CENTER_TEXT_WIDTH / 2

  chunks.push(
    `<text x="${centerTextCenterX}" y="${STRIP_H / 2}" dominant-baseline="middle" text-anchor="middle" font-size="${CENTER_FONT_SIZE}" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="600" letter-spacing="-0.02em" fill="${STROKE}">${escapeXml(
      STRIP_CENTER_LABEL,
    )}</text>`,
  )

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

  const out = join(__dirname, '..', 'alchemy-symbol-strip.svg')
  writeFileSync(out, svg, 'utf8')
  console.log(`Wrote ${out} (${totalW}×${STRIP_H}, strip ${stripWidth}u wide)`)
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

main()
