import { createRequire } from 'node:module'

import { Font } from '@react-pdf/renderer'

const require = createRequire(import.meta.url)

let registered = false

/**
 * Register Inter + Source Serif 4 (latin subsets from @fontsource) for Brand Alchemy PDFs. Idempotent.
 * Serif display defaults to normal weight; **700** is registered for specimen “Bold” samples (600 remains for accents).
 * Use `.woff` sources: WOFF2 subsetting hits fontkit "Offset is outside the bounds of the DataView" in @react-pdf/renderer.
 *
 * Call once per process before rendering any `<Document />` that uses these families.
 */
export function registerBrandPdfFonts(): void {
  if (registered) return
  registered = true

  Font.register({
    family: 'Inter',
    fonts: [
      {
        src: require.resolve('@fontsource/inter/files/inter-latin-300-normal.woff'),
        fontWeight: 300,
        fontStyle: 'normal',
      },
      {
        src: require.resolve('@fontsource/inter/files/inter-latin-400-normal.woff'),
        fontWeight: 400,
        fontStyle: 'normal',
      },
      {
        src: require.resolve('@fontsource/inter/files/inter-latin-400-italic.woff'),
        fontWeight: 400,
        fontStyle: 'italic',
      },
      {
        src: require.resolve('@fontsource/inter/files/inter-latin-600-normal.woff'),
        fontWeight: 600,
        fontStyle: 'normal',
      },
      {
        src: require.resolve('@fontsource/inter/files/inter-latin-700-normal.woff'),
        fontWeight: 700,
        fontStyle: 'normal',
      },
    ],
  })

  Font.register({
    family: 'Source Serif 4',
    fonts: [
      {
        src: require.resolve('@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff'),
        fontWeight: 400,
        fontStyle: 'normal',
      },
      {
        src: require.resolve('@fontsource/source-serif-4/files/source-serif-4-latin-400-italic.woff'),
        fontWeight: 400,
        fontStyle: 'italic',
      },
      {
        src: require.resolve('@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff'),
        fontWeight: 600,
        fontStyle: 'normal',
      },
      {
        src: require.resolve('@fontsource/source-serif-4/files/source-serif-4-latin-600-italic.woff'),
        fontWeight: 600,
        fontStyle: 'italic',
      },
      {
        src: require.resolve('@fontsource/source-serif-4/files/source-serif-4-latin-700-normal.woff'),
        fontWeight: 700,
        fontStyle: 'normal',
      },
    ],
  })
}
