import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  EMAIL_CARD_FULL_WIDTH,
  EMAIL_IMAGE_MEDIA_HEIGHT_PT,
  SOCIAL_POST_CARD_PADDING_PT,
} from './socialFeedLayout.js'
import { EmailEnvelopeIcon, normalizeCaption } from './socialShellPrimitives.js'
import { pickEmailPreheader, pickEmailSubject } from './EmailSnippetFrame.js'
import type { CtaFrameBaseProps } from './types.js'

export function EmailImageFrame({
  styles: S,
  businessName,
  lines,
  hyphenationCallback,
}: CtaFrameBaseProps): ReactElement {
  const captionBody = normalizeCaption(lines)

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

      <View
        style={{
          marginTop: 9,
          width: '100%',
          height: EMAIL_IMAGE_MEDIA_HEIGHT_PT,
          borderRadius: 4,
          backgroundColor: '#E4E4E7',
        }}
      />

      {captionBody ? (
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideListText, { marginTop: 8, fontSize: 8.5 }]}>
          {captionBody}
        </Text>
      ) : null}

      <View style={{ marginTop: 8 }}>
        <View
          style={{
            minWidth: 74,
            height: 18,
            borderRadius: 3,
            backgroundColor: '#ECECF1',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 8,
          }}
        >
          <Text style={[S.guideCardBody, { fontSize: 7.2, color: '#374151', fontWeight: 600 }]}>Shop now</Text>
        </View>
      </View>
    </View>
  )
}
