import { Document, Page, PDFViewer, Text, View } from '@react-pdf/renderer'

import { renderCtaFrame } from '@generation/pdf/ctaFrames/registry.js'
import { CTA_FRAME_IDS } from '@generation/pdf/ctaFrames/types.js'

import { explorerGuideStyles } from './explorerStyles.js'

const SAMPLE_BUSINESS =
  'Northline Studio Collective Partnership LLC - a deliberately long display name for layout QA'

const SAMPLE_LINES = [
  'Save this post. I reply to DMs with next steps within a day.',
  'DM the word "BRIEF" and I\u2019ll send three quick questions.',
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
      {CTA_FRAME_IDS.map((frameId) => (
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
    </div>
  )
}
