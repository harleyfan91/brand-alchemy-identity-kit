/**
 * Single-page PDF listing every registered CTA in-context frame with sample copy.
 * Used by the web dev gallery (`?dev=cta-frames`). Page size matches Brand Identity Guide landscape.
 */
import { Document, Page, Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'

import { brandIdentityGuidePdfStyles } from '../CoreKitDocuments.js'
import { renderCtaFrame } from './registry.js'
import { CTA_FRAME_IDS, type CtaFrameId } from './types.js'

/** Keep in sync with `LANDSCAPE_PDF_SIZE` in CoreKitDocuments.tsx */
const GALLERY_PAGE_SIZE: [number, number] = [792, 554]

function hyphenateWholeWord(word: string): string[] {
  return [word]
}

/**
 * Sample props per `frameId`. Extend when adding frames so the gallery stays exhaustive (TS-enforced).
 */
const FRAME_DEV_SAMPLES: Record<
  CtaFrameId,
  { title: string; businessName: string; lines: [string, string] }
> = {
  social_feed_v1: {
    title: 'social_feed_v1 — feed card',
    businessName: 'Northline Studio',
    lines: [
      'First line reads as post body. Keep it concrete so the preview feels real.',
      'Second line reads as the primary CTA (slightly heavier weight in the frame).',
    ],
  },
}

export function CtaFrameDevGalleryDocument(): ReactElement {
  const S = brandIdentityGuidePdfStyles()

  return (
    <Document title="CTA frame library (dev)">
      <Page
        size={GALLERY_PAGE_SIZE}
        style={{
          paddingTop: 36,
          paddingBottom: 28,
          paddingHorizontal: 40,
          backgroundColor: '#FFFFFF',
          fontFamily: 'Inter',
          fontWeight: 400,
        }}
      >
        <Text style={S.guideSpreadTitle}>CTA in-context frames</Text>
        <Text style={[S.guideCardBody, { marginTop: 6, marginBottom: 18 }]}>
          Dev-only catalog. Each block uses the same React-PDF components as folio 05. Add samples in
          FRAME_DEV_SAMPLES when you register a new frameId.
        </Text>
        <View style={S.guideSpread}>
          {CTA_FRAME_IDS.map((frameId) => {
            const sample = FRAME_DEV_SAMPLES[frameId]
            return (
              <View key={frameId} style={{ marginBottom: 20 }} wrap={false}>
                <Text style={S.guideOpenLabel}>{sample.title.toUpperCase()}</Text>
                {renderCtaFrame({
                  frameId,
                  styles: S,
                  businessName: sample.businessName,
                  lines: [...sample.lines],
                  hyphenationCallback: hyphenateWholeWord,
                })}
              </View>
            )
          })}
        </View>
      </Page>
    </Document>
  )
}
