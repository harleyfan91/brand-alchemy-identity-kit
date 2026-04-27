import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import { DESKTOP_WIDE_CARD_OUTER_WIDTH_PT, SOCIAL_POST_CARD_PADDING_PT } from './socialFeedLayout.js'
import { EmailEnvelopeIcon, normalizeCaption } from './socialShellPrimitives.js'
import { pickEmailPreheader, pickEmailSubject } from './EmailSnippetFrame.js'
import type { CtaFrameBaseProps } from './types.js'

export function EmailTextOnlyFrame({
  styles: S,
  businessName,
  lines,
  hyphenationCallback,
  cardAlignSelf = 'center',
}: CtaFrameBaseProps): ReactElement {
  const captionBody = normalizeCaption(lines)

  return (
    <View
      style={[
        S.guideCard,
        {
          width: DESKTOP_WIDE_CARD_OUTER_WIDTH_PT,
          alignSelf: cardAlignSelf,
          paddingVertical: 8,
          paddingHorizontal: SOCIAL_POST_CARD_PADDING_PT,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[S.guideCardBody, { fontSize: 7.4, color: '#6D7A8A' }]}>From: {businessName.trim()}</Text>
        <EmailEnvelopeIcon />
      </View>

      <Text
        hyphenationCallback={hyphenationCallback}
        style={[S.guideCardBody, { marginTop: 8, fontSize: 9.2, fontWeight: 600 }]}
      >
        Subject: {pickEmailSubject(lines)}
      </Text>

      <Text
        hyphenationCallback={hyphenationCallback}
        style={[S.guideCardBody, { marginTop: 4, fontSize: 8.1, color: '#6D7A8A' }]}
      >
        {pickEmailPreheader(lines)}
      </Text>

      <View style={{ marginTop: 8 }}>
        <View style={{ width: '96%', height: 4, borderRadius: 2, backgroundColor: '#E4E4E7' }} />
        <View style={{ width: '90%', height: 4, borderRadius: 2, backgroundColor: '#E9E9EE', marginTop: 3 }} />
        <View style={{ width: '82%', height: 4, borderRadius: 2, backgroundColor: '#ECECF1', marginTop: 3 }} />
      </View>

      {captionBody ? (
        <Text
          hyphenationCallback={hyphenationCallback}
          style={[S.guideCtaCaptionText, { marginTop: 10, fontSize: 8.6, lineHeight: 1.35 }]}
        >
          {captionBody}
        </Text>
      ) : null}

      <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            minWidth: 70,
            height: 18,
            borderRadius: 3,
            backgroundColor: '#ECECF1',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 8,
            marginRight: 10,
          }}
        >
          <Text style={[S.guideCardBody, { fontSize: 7.2, color: '#374151', fontWeight: 600 }]}>Reply</Text>
        </View>
        <Text style={[S.guideCardBody, { fontSize: 7.4, color: '#6D7A8A' }]}>Manage preferences</Text>
      </View>
    </View>
  )
}
