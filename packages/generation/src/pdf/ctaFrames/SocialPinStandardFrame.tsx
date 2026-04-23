import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  SOCIAL_PIN_STANDARD_CARD_WIDTH_PT,
  SOCIAL_PIN_STANDARD_MEDIA_HEIGHT_PT,
  SOCIAL_PIN_STANDARD_MEDIA_WIDTH_PT,
  SOCIAL_POST_CARD_PADDING_PT,
} from './socialFeedLayout.js'
import { shortOverlayCopy } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

function pinOverlayCopy(lines: string[]): string {
  const first = shortOverlayCopy([lines[0] ?? ''], 7)
  const second = shortOverlayCopy([lines[1] ?? ''], 7)
  const ctaLead = /^(save|tap|visit|click|dm|comment|follow|shop|buy|order)\b/i
  if (first && !ctaLead.test(first)) return first
  if (second && !ctaLead.test(second)) return second

  const stripCtaLead = (raw: string): string => {
    const cleaned = raw
      .trim()
      // Drop common CTA-first sentence fragments for visual-first pin overlays.
      .replace(/^(save this post|tap(?:\s+\w+){0,4}|visit(?:\s+\w+){0,4}|click(?:\s+\w+){0,4}|comment(?:\s+\w+){0,5}|follow(?:\s+\w+){0,5}|shop(?:\s+\w+){0,5}|buy(?:\s+\w+){0,5}|order(?:\s+\w+){0,5})[.!?]\s*/i, '')
      .replace(/^dm(?:\s+\w+){0,8}[.!?]\s*/i, '')
    const sentence = cleaned.split(/[.!?]/)[0]?.trim() ?? ''
    return sentence.split(/\s+/).slice(0, 8).join(' ').trim()
  }

  const strippedFirst = stripCtaLead(lines[0] ?? '')
  if (strippedFirst) return strippedFirst
  const strippedSecond = stripCtaLead(lines[1] ?? '')
  if (strippedSecond) return strippedSecond

  return first || second
}

/** Pinterest standard pin shell (2:3) with short on-media CTA overlay. */
export function SocialPinStandardFrame({
  styles: S,
  businessName,
  lines,
  hyphenationCallback,
}: CtaFrameBaseProps): ReactElement {
  const overlay = pinOverlayCopy(lines)

  return (
    <View
      style={[
        S.guideCard,
        {
          width: SOCIAL_PIN_STANDARD_CARD_WIDTH_PT,
          alignSelf: 'center',
          paddingVertical: 6,
          paddingHorizontal: SOCIAL_POST_CARD_PADDING_PT,
        },
      ]}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <View
          style={{
            width: SOCIAL_PIN_STANDARD_MEDIA_WIDTH_PT,
            height: SOCIAL_PIN_STANDARD_MEDIA_HEIGHT_PT,
            borderRadius: 4,
            backgroundColor: '#E4E4E7',
            justifyContent: 'space-between',
            padding: 6,
          }}
        >
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ paddingVertical: 2, paddingHorizontal: 2 }}>
              <Text style={[S.guideCardBody, { fontSize: 7.4, color: '#111827', fontWeight: 600 }]}>Save</Text>
            </View>
          </View>

          <View style={{ width: '100%' }}>
            {overlay ? (
              <Text
                hyphenationCallback={hyphenationCallback}
                style={[S.guideListText, { width: '86%', fontSize: 8.2, color: '#111827', fontWeight: 600 }]}
              >
                {overlay}
              </Text>
            ) : null}
          </View>

          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ paddingVertical: 2, paddingHorizontal: 2 }}>
              <Text
                hyphenationCallback={hyphenationCallback}
                style={[S.guideCardBody, { fontSize: 7.3, color: '#111827', fontWeight: 600 }]}
              >
                Visit site
              </Text>
            </View>
            <View
              style={{
                width: 16,
                height: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={[S.guideCardBody, { fontSize: 8.2, color: '#111827', fontWeight: 600 }]}>↗</Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{ marginTop: 6, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text hyphenationCallback={hyphenationCallback} style={[S.guideCardBody, { fontSize: 8.6, fontWeight: 600 }]}>
            {businessName.trim()}
          </Text>
          <Text style={[S.guideCardBody, { fontSize: 7.8, color: '#6D7A8A' }]}>Sponsored</Text>
        </View>
        <Text style={[S.guideCardBody, { fontSize: 9, color: '#3D4654', marginLeft: 6 }]}>...</Text>
      </View>
    </View>
  )
}
