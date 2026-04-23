import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  DIRECTORY_SPONSORED_THUMB_PT,
  EMAIL_CARD_FULL_WIDTH,
  SOCIAL_POST_CARD_PADDING_PT,
} from './socialFeedLayout.js'
import { normalizeCaption } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/**
 * Silent shell for a **sponsored listing** card: disclosure line, title, rating
 * row, thumbnail + snippet placeholders, one body block, Call as primary chip
 * (common on paid local rows) plus Website as a secondary text action.
 */
export function DirectorySponsoredListingFrame({
  styles: S,
  businessName,
  lines,
  hyphenationCallback,
}: CtaFrameBaseProps): ReactElement {
  const body = normalizeCaption(lines)

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
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={[S.guideCardBody, { fontSize: 7.2, color: '#6D7A8A' }]}>Sponsored</Text>
      </View>

      <Text hyphenationCallback={hyphenationCallback} style={[S.guideCardBody, { marginTop: 4, fontSize: 8.8, fontWeight: 600 }]}>
        {businessName.trim()}
      </Text>

      <Text style={[S.guideCardBody, { marginTop: 4, fontSize: 7.8, color: '#6D7A8A' }]}>4.8 ★ · 214 reviews</Text>

      <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            width: DIRECTORY_SPONSORED_THUMB_PT,
            height: DIRECTORY_SPONSORED_THUMB_PT,
            borderRadius: 4,
            backgroundColor: '#E4E4E7',
            marginRight: 8,
          }}
        />
        <View style={{ flex: 1, paddingTop: 2 }}>
          <View style={{ width: '92%', height: 4, borderRadius: 2, backgroundColor: '#D4D4D8' }} />
          <View style={{ width: '78%', height: 4, borderRadius: 2, backgroundColor: '#E4E4E7', marginTop: 3 }} />
          <View style={{ width: '64%', height: 4, borderRadius: 2, backgroundColor: '#ECECF1', marginTop: 3 }} />
        </View>
      </View>

      {body ? (
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideListText, { marginTop: 8, fontSize: 8.4 }]}>
          {body}
        </Text>
      ) : null}

      <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
        <View
          style={{
            minWidth: 52,
            height: 18,
            borderRadius: 3,
            backgroundColor: '#ECECF1',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
            marginRight: 8,
          }}
        >
          <Text style={[S.guideCardBody, { fontSize: 7.2, color: '#374151', fontWeight: 600 }]}>Call</Text>
        </View>
        <Text style={[S.guideCardBody, { fontSize: 7.6, color: '#9CA3AF', marginRight: 5 }]}>·</Text>
        <Text style={[S.guideCardBody, { fontSize: 7.6, color: '#3D4654', fontWeight: 600 }]}>Website</Text>
      </View>
    </View>
  )
}
