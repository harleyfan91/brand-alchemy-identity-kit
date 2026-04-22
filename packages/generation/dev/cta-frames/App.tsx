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
    <div style={{ padding: 12, maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>CTA frame library (dev)</h1>
      <p style={{ margin: '0 0 12px', color: '#52525b', fontSize: 13 }}>
        Live React-PDF preview. Does not use Core Kit PDF assembly or change shipped PDFs. Add new{' '}
        <code>frameId</code> values to <code>CTA_FRAME_IDS</code> to see them here.
      </p>
      <PDFViewer
        showToolbar={false}
        style={{ width: '100%', height: 'calc(100vh - 120px)', border: '1px solid #e4e4e7' }}
      >
        <Document title="CTA frames">
          {CTA_FRAME_IDS.map((frameId) => (
            <Page
              key={frameId}
              size="A4"
              style={{
                paddingTop: 36,
                paddingBottom: 36,
                paddingHorizontal: 40,
                fontFamily: 'Inter',
              }}
            >
              <Text style={{ fontSize: 10, color: '#71717a', marginBottom: 10, fontFamily: 'Inter' }}>{frameId}</Text>
              <View style={{ maxWidth: 420 }}>
                {renderCtaFrame({
                  frameId,
                  styles: S,
                  businessName: SAMPLE_BUSINESS,
                  lines: SAMPLE_LINES,
                  hyphenationCallback: hyphenate,
                })}
              </View>
            </Page>
          ))}
        </Document>
      </PDFViewer>
    </div>
  )
}
