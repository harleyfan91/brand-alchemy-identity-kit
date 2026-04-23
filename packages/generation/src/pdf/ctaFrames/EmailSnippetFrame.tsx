import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import { EMAIL_CARD_FULL_WIDTH, SOCIAL_POST_CARD_PADDING_PT } from './socialFeedLayout.js'
import { EmailEnvelopeIcon, normalizeCaption } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

function compact(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

export function pickEmailSubject(lines: string[]): string {
  const first = lines.map(compact).find(Boolean) ?? ''
  if (!first) return 'New update from your brand'
  return compact(first.split(/[.!?]/)[0] ?? first)
}

export function pickEmailPreheader(lines: string[]): string {
  const second = lines.slice(1).map(compact).find(Boolean)
  const source = second || lines.map(compact).find(Boolean) || ''
  if (!source) return 'Open for details and next steps.'
  return compact(source)
}

export function EmailSnippetFrame({
  styles: S,
  businessName,
  lines,
  hyphenationCallback,
}: CtaFrameBaseProps): ReactElement {
  const captionBody = normalizeCaption(lines)
  const subject = pickEmailSubject(lines)
  const preheader = pickEmailPreheader(lines)

  return (
    <View
      style={[
        S.guideCard,
        {
          width: EMAIL_CARD_FULL_WIDTH,
          alignSelf: 'stretch',
          paddingVertical: 8,
          paddingHorizontal: SOCIAL_POST_CARD_PADDING_PT,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[S.guideCardBody, { fontSize: 7.4, color: '#6D7A8A' }]}>From: {businessName.trim()}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[S.guideCardBody, { fontSize: 7.4, color: '#6D7A8A', marginRight: 5 }]}>9:41 AM</Text>
          <EmailEnvelopeIcon />
        </View>
      </View>

      <Text
        hyphenationCallback={hyphenationCallback}
        style={[S.guideCardBody, { marginTop: 8, fontSize: 9.1, fontWeight: 600 }]}
      >
        Subject: {subject}
      </Text>

      <Text
        hyphenationCallback={hyphenationCallback}
        style={[S.guideCardBody, { marginTop: 4, fontSize: 8.1, color: '#6D7A8A' }]}
      >
        {preheader}
      </Text>

      <View style={{ marginTop: 7 }}>
        <View style={{ width: '96%', height: 4, borderRadius: 2, backgroundColor: '#E4E4E7' }} />
        <View style={{ width: '82%', height: 4, borderRadius: 2, backgroundColor: '#ECECF1', marginTop: 3 }} />
      </View>

      {captionBody ? (
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideListText, { marginTop: 8, fontSize: 8.5 }]}>
          {captionBody}
        </Text>
      ) : null}

      <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            minWidth: 72,
            height: 18,
            borderRadius: 3,
            backgroundColor: '#ECECF1',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 8,
          }}
        >
          <Text style={[S.guideCardBody, { fontSize: 7.2, color: '#374151', fontWeight: 600 }]}>View details</Text>
        </View>
      </View>
    </View>
  )
}
