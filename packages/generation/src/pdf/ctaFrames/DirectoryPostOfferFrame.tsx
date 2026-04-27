import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  DESKTOP_WIDE_CARD_OUTER_WIDTH_PT,
  DIRECTORY_POST_MEDIA_HEIGHT_PT,
  SOCIAL_POST_CARD_PADDING_PT,
} from './socialFeedLayout.js'
import { normalizeCaption } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/**
 * Silent shell for a local business **post** card (update / offer style):
 * who posted + recency, short headline placeholders, wide photo slot, one body
 * text block, then action links as plain text.
 */
export function DirectoryPostOfferFrame({
  styles: S,
  businessName,
  lines,
  hyphenationCallback,
  cardAlignSelf = 'center',
}: CtaFrameBaseProps): ReactElement {
  const body = normalizeCaption(lines)

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideCardBody, { fontSize: 8.8, fontWeight: 600 }]}>
          {businessName.trim()}
        </Text>
        <Text style={[S.guideCardBody, { fontSize: 7.4, color: '#6D7A8A' }]}>2d ago</Text>
      </View>

      <View style={{ marginTop: 6 }}>
        <View style={{ width: '88%', height: 4, borderRadius: 2, backgroundColor: '#D4D4D8' }} />
        <View style={{ width: '62%', height: 4, borderRadius: 2, backgroundColor: '#E4E4E7', marginTop: 3 }} />
      </View>

      <View
        style={{
          marginTop: 8,
          width: '100%',
          height: DIRECTORY_POST_MEDIA_HEIGHT_PT,
          borderRadius: 4,
          backgroundColor: '#E4E4E7',
        }}
      />

      {body ? (
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideCtaCaptionText, { marginTop: 8, fontSize: 8.4 }]}>
          {body}
        </Text>
      ) : null}

      <View style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
        <Text style={[S.guideCardBody, { fontSize: 7.6, color: '#3D4654', fontWeight: 600 }]}>Call</Text>
        <Text style={[S.guideCardBody, { fontSize: 7.6, color: '#9CA3AF', marginHorizontal: 5 }]}>·</Text>
        <Text style={[S.guideCardBody, { fontSize: 7.6, color: '#3D4654', fontWeight: 600 }]}>Directions</Text>
        <Text style={[S.guideCardBody, { fontSize: 7.6, color: '#9CA3AF', marginHorizontal: 5 }]}>·</Text>
        <Text style={[S.guideCardBody, { fontSize: 7.6, color: '#3D4654', fontWeight: 600 }]}>Website</Text>
      </View>
    </View>
  )
}
