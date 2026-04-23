import { Document, Page, PDFViewer, View } from '@react-pdf/renderer'

import { renderCtaFrame } from '@generation/pdf/ctaFrames/registry.js'
import {
  SOCIAL_CREATOR_MEDIA_PT,
  SOCIAL_GRID_CARD_WIDTH_PT,
  SOCIAL_REEL_CARD_WIDTH_PT,
  SOCIAL_STORY_CARD_WIDTH_PT,
  SOCIAL_PRO_MEDIA_HEIGHT_PT,
  SOCIAL_PRO_MEDIA_WIDTH_PT,
  SOCIAL_VERTICAL_MEDIA_HEIGHT_PT,
  SOCIAL_VERTICAL_MEDIA_WIDTH_PT,
} from '@generation/pdf/ctaFrames/socialFeedLayout.js'
import { CTA_FRAME_IDS } from '@generation/pdf/ctaFrames/types.js'
import type { CtaFrameId } from '@generation/pdf/ctaFrames/types.js'
import type { SocialFeedVariant } from '@generation/pdf/ctaFrames/types.js'

import { explorerGuideStyles } from './explorerStyles.js'

const SAMPLE_BUSINESS = 'Northline Studio'

/** Same shape as production `lines` (often two composed strings); the frame merges into one caption. */
const SAMPLE_LINES = [
  'Save this post. I reply to DMs with next steps within a day.',
  'DM the word "BRIEF" and I\u2019ll send three quick questions.',
]

const SOCIAL_FRAME_PREVIEWS: Array<{
  key: string
  frameId: CtaFrameId
  variant?: SocialFeedVariant
  heading: string
  platforms: string
  detail: string
}> = [
  {
    key: 'feed-professional',
    frameId: 'social_feed_v1',
    variant: 'professional_network_feed',
    heading: 'social_feed_v1 + professional_network_feed',
    platforms: 'LinkedIn-style feed, Facebook-style horizontal image post',
    detail: `Card uses the full preview column width (matches shipped PDF). Media slot is fixed ${SOCIAL_PRO_MEDIA_WIDTH_PT}×${SOCIAL_PRO_MEDIA_HEIGHT_PT} pt (~1.91:1), centered. Not an Instagram square grid layout.`,
  },
  {
    key: 'story',
    frameId: 'social_story_v1',
    heading: 'social_story_v1',
    platforms: 'Instagram Story, Facebook Story',
    detail: `Mobile shell width ${SOCIAL_STORY_CARD_WIDTH_PT} pt. Fixed ${SOCIAL_VERTICAL_MEDIA_WIDTH_PT}×${SOCIAL_VERTICAL_MEDIA_HEIGHT_PT} pt media (9:16), centered. Story shell keeps minimal chrome and no feed action bar.`,
  },
  {
    key: 'reel',
    frameId: 'social_reel_cover_v1',
    heading: 'social_reel_cover_v1',
    platforms: 'TikTok, YouTube Shorts, Instagram Reels cover family',
    detail: `Mobile shell width ${SOCIAL_REEL_CARD_WIDTH_PT} pt. Uses the same 9:16 vertical media family (${SOCIAL_VERTICAL_MEDIA_WIDTH_PT}×${SOCIAL_VERTICAL_MEDIA_HEIGHT_PT} pt) with reel-style footer chrome.`,
  },
  {
    key: 'grid',
    frameId: 'social_grid_photo_v1',
    heading: 'social_grid_photo_v1',
    platforms: 'Instagram profile grid photo post family, Pinterest-style square feed card',
    detail: `Mobile shell width ${SOCIAL_GRID_CARD_WIDTH_PT} pt. Square media ${SOCIAL_CREATOR_MEDIA_PT}×${SOCIAL_CREATOR_MEDIA_PT} pt (1:1), centered. This is the fuller photo-first grid silhouette.`,
  },
]

function hyphenate(word: string): string[] {
  return [word]
}

export function App() {
  const S = explorerGuideStyles()

  return (
    <div style={{ padding: 12, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>CTA frame library (dev)</h1>
      <p style={{ margin: '0 0 12px', color: '#52525b', fontSize: 13 }}>
        Live React-PDF preview. Each frame uses its own viewer so the browser does not shrink a multi-page
        PDF to fit. Does not change shipped PDFs.
      </p>
      {CTA_FRAME_IDS.filter((id) => !SOCIAL_FRAME_PREVIEWS.some((row) => row.frameId === id)).map((frameId) => (
        <section key={frameId} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px', fontFamily: 'system-ui' }}>
            {frameId}
          </h2>
          <PDFViewer
            showToolbar={false}
            style={{
              width: '100%',
              height: 520,
              border: '1px solid #e4e4e7',
              borderRadius: 6,
            }}
          >
            <Document title={`CTA frame ${frameId}`}>
              <Page
                size="A4"
                style={{
                  paddingTop: 48,
                  paddingBottom: 48,
                  paddingHorizontal: 56,
                  fontFamily: 'Inter',
                }}
              >
                <View style={{ width: '100%', maxWidth: 440, alignSelf: 'center' }}>
                  {renderCtaFrame({
                    frameId,
                    styles: S,
                    businessName: SAMPLE_BUSINESS,
                    lines: SAMPLE_LINES,
                    hyphenationCallback: hyphenate,
                  })}
                </View>
              </Page>
            </Document>
          </PDFViewer>
        </section>
      ))}
      {SOCIAL_FRAME_PREVIEWS.map((row) => (
        <section key={row.key} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px', fontFamily: 'system-ui' }}>
            {row.heading}
          </h2>
          <div
            style={{
              marginBottom: 10,
              padding: '10px 12px',
              borderRadius: 6,
              background: '#f4f4f5',
              border: '1px solid #e4e4e7',
              fontSize: 13,
              color: '#3f3f46',
              lineHeight: 1.45,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Geometry matches</div>
            <div>{row.platforms}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#52525b' }}>{row.detail}</div>
          </div>
          <PDFViewer
            showToolbar={false}
            style={{
              width: '100%',
              height: 520,
              border: '1px solid #e4e4e7',
              borderRadius: 6,
            }}
          >
            <Document title={`CTA frame ${row.frameId}${row.variant ? ` (${row.variant})` : ''}`}>
              <Page
                size="A4"
                style={{
                  paddingTop: 48,
                  paddingBottom: 48,
                  paddingHorizontal: 56,
                  fontFamily: 'Inter',
                }}
              >
                <View style={{ width: '100%', maxWidth: 440, alignSelf: 'center' }}>
                  {renderCtaFrame({
                    frameId: row.frameId,
                    styles: S,
                    businessName: SAMPLE_BUSINESS,
                    lines: SAMPLE_LINES,
                    hyphenationCallback: hyphenate,
                    ...(row.variant ? { socialFeedVariant: row.variant } : {}),
                  })}
                </View>
              </Page>
            </Document>
          </PDFViewer>
        </section>
      ))}
    </div>
  )
}
