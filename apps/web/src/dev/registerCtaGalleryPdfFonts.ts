/**
 * Browser-safe Inter registration for the CTA frame dev gallery (Vite resolves .woff?url).
 * Mirrors the Inter faces from `registerCoreKitPdfFonts` used by Brand Identity Guide styles.
 */
import { Font } from '@react-pdf/renderer'

import inter300 from '@fontsource/inter/files/inter-latin-300-normal.woff?url'
import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff?url'
import inter400i from '@fontsource/inter/files/inter-latin-400-italic.woff?url'
import inter600 from '@fontsource/inter/files/inter-latin-600-normal.woff?url'
import inter700 from '@fontsource/inter/files/inter-latin-700-normal.woff?url'

let registered = false

export function registerCtaGalleryPdfFonts(): void {
  if (registered) return
  registered = true
  Font.register({
    family: 'Inter',
    fonts: [
      { src: inter300, fontWeight: 300, fontStyle: 'normal' },
      { src: inter400, fontWeight: 400, fontStyle: 'normal' },
      { src: inter400i, fontWeight: 400, fontStyle: 'italic' },
      { src: inter600, fontWeight: 600, fontStyle: 'normal' },
      { src: inter700, fontWeight: 700, fontStyle: 'normal' },
    ],
  })
}
