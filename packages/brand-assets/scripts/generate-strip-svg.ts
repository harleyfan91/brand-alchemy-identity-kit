/**
 * Writes `alchemy-symbol-strip.svg` from the same layout rules as the web strip.
 * Run: npm run generate -w @identity-kit/brand-assets
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { STRIP_CENTER_LABEL, type SymbolId, getStripLayout } from '../src/symbolStrip.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

const STROKE = '#3f3f46'
const LINE = '#e4e4e7'
const CELL = 112
const GAP_BEFORE_CENTER = 8
const CENTER_COL = 72
const GAP_AFTER_CENTER = 8

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

function glyphAt(x: number, id: SymbolId): string {
  return `<g transform="translate(${x},0)"><svg width="100" height="100" viewBox="0 0 100 100">${glyphInner(id)}</svg></g>`
}

function main() {
  const { leftSide, rightSide } = getStripLayout()
  const chunks: string[] = []
  let x = 0

  for (const id of leftSide) {
    chunks.push(glyphAt(x, id))
    x += CELL
  }

  x += GAP_BEFORE_CENTER
  const centerBlockStart = x
  chunks.push(
    `<text x="${centerBlockStart + CENTER_COL / 2}" y="62" text-anchor="middle" font-size="21" font-family="ui-sans-serif, system-ui, sans-serif" font-weight="600" fill="${STROKE}">${escapeXml(
      STRIP_CENTER_LABEL,
    )}</text>`,
  )
  x += CENTER_COL + GAP_AFTER_CENTER

  for (const id of rightSide) {
    chunks.push(glyphAt(x, id))
    x += CELL
  }

  const stripWidth = x
  const pad = 16
  const totalW = stripWidth + pad * 2

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} 100" width="${totalW}" height="100" role="img" aria-label="Brand Alchemy symbol strip">
  <rect x="0" y="0" width="${totalW}" height="100" fill="white"/>
  <line x1="0" y1="0.5" x2="${totalW}" y2="0.5" stroke="${LINE}" stroke-width="1"/>
  <line x1="0" y1="99.5" x2="${totalW}" y2="99.5" stroke="${LINE}" stroke-width="1"/>
  <g transform="translate(${pad},0)">
    ${chunks.join('\n    ')}
  </g>
</svg>
`

  const out = join(__dirname, '..', 'alchemy-symbol-strip.svg')
  writeFileSync(out, svg, 'utf8')
  console.log(`Wrote ${out} (${totalW}×100, strip ${stripWidth}u wide)`)
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

main()
