/**
 * Registers all Google Fonts used by Core kit PDFs (recipe shortlist + legacy sample pair).
 * Call once per process before rendering. Uses WOFF latin subsets (WOFF2 can break fontkit in react-pdf).
 */

import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { Font } from '@react-pdf/renderer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(join(__dirname, '../../package.json'))

let registered = false

type FaceSrc = { src: string; fontWeight: number; fontStyle: 'normal' | 'italic' }

function src(pkgPath: string): string {
  return require.resolve(pkgPath)
}

function reg(family: string, fonts: FaceSrc[]): void {
  Font.register({ family, fonts })
}

/**
 * Full shortlist registration for recipe-driven PDFs (includes Inter + Source Serif 4 for recipes that still reference them). Idempotent.
 */
export function registerCoreKitPdfFonts(): void {
  if (registered) return
  registered = true

  reg('Inter', [
    { src: src('@fontsource/inter/files/inter-latin-300-normal.woff'), fontWeight: 300, fontStyle: 'normal' },
    { src: src('@fontsource/inter/files/inter-latin-400-normal.woff'), fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/inter/files/inter-latin-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/inter/files/inter-latin-600-normal.woff'), fontWeight: 600, fontStyle: 'normal' },
    { src: src('@fontsource/inter/files/inter-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])
  reg('Source Serif 4', [
    { src: src('@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff'), fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/source-serif-4/files/source-serif-4-latin-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff'), fontWeight: 600, fontStyle: 'normal' },
    { src: src('@fontsource/source-serif-4/files/source-serif-4-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])

  reg('Playfair Display', [
    { src: src('@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff'), fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])

  reg('Fraunces', [
    { src: src('@fontsource/fraunces/files/fraunces-latin-400-normal.woff'), fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/fraunces/files/fraunces-latin-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/fraunces/files/fraunces-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])

  /** Only 400 + italic ship for this family; do not alias 700 to the same file (specimen ladder would look fake). */
  reg('DM Serif Display', [
    { src: src('@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff'), fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/dm-serif-display/files/dm-serif-display-latin-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' },
  ])

  reg('Cormorant Garamond', [
    { src: src('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff'), fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff'), fontWeight: 600, fontStyle: 'normal' },
    { src: src('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])

  const syne400 = src('@fontsource/syne/files/syne-latin-400-normal.woff')
  reg('Syne', [
    { src: syne400, fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/syne/files/syne-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
    { src: syne400, fontWeight: 400, fontStyle: 'italic' },
  ])

  const outfit400 = src('@fontsource/outfit/files/outfit-latin-400-normal.woff')
  reg('Outfit', [
    { src: src('@fontsource/outfit/files/outfit-latin-300-normal.woff'), fontWeight: 300, fontStyle: 'normal' },
    { src: outfit400, fontWeight: 400, fontStyle: 'normal' },
    /** No latin italic files in @fontsource/outfit; map italic to upright so specimens/layout resolve. */
    { src: outfit400, fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/outfit/files/outfit-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])

  reg('DM Sans', [
    { src: src('@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff'), fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/dm-sans/files/dm-sans-latin-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])

  const manrope400 = src('@fontsource/manrope/files/manrope-latin-400-normal.woff')
  reg('Manrope', [
    { src: src('@fontsource/manrope/files/manrope-latin-300-normal.woff'), fontWeight: 300, fontStyle: 'normal' },
    { src: manrope400, fontWeight: 400, fontStyle: 'normal' },
    { src: manrope400, fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/manrope/files/manrope-latin-600-normal.woff'), fontWeight: 600, fontStyle: 'normal' },
    { src: src('@fontsource/manrope/files/manrope-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])

  reg('Lato', [
    { src: src('@fontsource/lato/files/lato-latin-300-normal.woff'), fontWeight: 300, fontStyle: 'normal' },
    { src: src('@fontsource/lato/files/lato-latin-400-normal.woff'), fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/lato/files/lato-latin-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/lato/files/lato-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])

  reg('Open Sans', [
    { src: src('@fontsource/open-sans/files/open-sans-latin-300-normal.woff'), fontWeight: 300, fontStyle: 'normal' },
    { src: src('@fontsource/open-sans/files/open-sans-latin-400-normal.woff'), fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/open-sans/files/open-sans-latin-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/open-sans/files/open-sans-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])

  reg('Roboto', [
    { src: src('@fontsource/roboto/files/roboto-latin-300-normal.woff'), fontWeight: 300, fontStyle: 'normal' },
    { src: src('@fontsource/roboto/files/roboto-latin-400-normal.woff'), fontWeight: 400, fontStyle: 'normal' },
    { src: src('@fontsource/roboto/files/roboto-latin-400-italic.woff'), fontWeight: 400, fontStyle: 'italic' },
    { src: src('@fontsource/roboto/files/roboto-latin-700-normal.woff'), fontWeight: 700, fontStyle: 'normal' },
  ])
}
