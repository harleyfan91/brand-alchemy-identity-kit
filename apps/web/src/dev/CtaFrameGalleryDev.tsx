import { useEffect, useState } from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import { CtaFrameDevGalleryDocument } from '@identity-kit/generation-gallery'

import { registerCtaGalleryPdfFonts } from './registerCtaGalleryPdfFonts.js'

/**
 * Dev-only: previews every registered CTA in-context frame via React-PDF (same code path as PDF export).
 */
export function CtaFrameGalleryDev() {
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    registerCtaGalleryPdfFonts()
    setFontsReady(true)
  }, [])

  if (!fontsReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-sm text-zinc-600">
        Loading PDF fonts…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-semibold text-zinc-900">CTA in-context frame library</h1>
            <p className="text-xs text-zinc-500">
              Dev only. Same React-PDF components as folio 05. Open with{' '}
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-[11px]">?dev=cta-frames</code>.
            </p>
          </div>
          <a href="/" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
            Back to app
          </a>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl flex-1 p-4">
        <PDFViewer style={{ width: '100%', height: 'calc(100vh - 5.5rem)' }}>
          <CtaFrameDevGalleryDocument />
        </PDFViewer>
      </div>
    </div>
  )
}
