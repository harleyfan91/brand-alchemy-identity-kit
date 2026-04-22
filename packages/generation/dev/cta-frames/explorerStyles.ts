/**
 * Subset of Brand Identity Guide PDF styles needed by current CTA frames.
 * Duplicated from CoreKitDocuments `createCoreKitStyles` values so the Vite dev
 * bundle does not import the full PDF document module (Node-only paths).
 *
 * When a frame uses new `S.*` keys, add them here (or extract shared styles later).
 */
import type { CoreKitPdfStyles } from '@generation/pdf/CoreKitDocuments.js'

const BRAND = {
  bodyText: '#3D4654',
  subText: '#6D7A8A',
} as const

const bodyFamily = 'Inter'

/** Mirrors `guideCard`, `guideCardLabel`, `guideCardBody`, `guideListText` in CoreKitDocuments. */
export function explorerGuideStyles(): CoreKitPdfStyles {
  return {
    guideCard: {
      borderWidth: 1,
      borderColor: '#E4E4E7',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: '#FFFFFF',
    },
    guideCardLabel: {
      fontSize: 6.1,
      fontFamily: bodyFamily,
      fontWeight: 600,
      letterSpacing: 0.7,
      color: BRAND.subText,
      marginBottom: 4,
    },
    guideCardBody: {
      fontSize: 9.25,
      fontFamily: bodyFamily,
      fontWeight: 300,
      lineHeight: 1.48,
      color: BRAND.bodyText,
    },
    guideListText: {
      flex: 1,
      fontSize: 9,
      fontFamily: bodyFamily,
      fontWeight: 300,
      lineHeight: 1.42,
      color: BRAND.bodyText,
    },
  } as unknown as CoreKitPdfStyles
}
