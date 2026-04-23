import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  MARKETPLACE_LISTING_CARD_WIDTH_PT,
  MARKETPLACE_LISTING_IMAGE_PT,
  SOCIAL_POST_CARD_PADDING_PT,
} from './socialFeedLayout.js'
import { normalizeCaption } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/** Generic marketplace listing card shell (image + title + price/meta + CTA). */
export function MarketplaceListingFrame({
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
          width: MARKETPLACE_LISTING_CARD_WIDTH_PT,
          alignSelf: 'center',
          paddingVertical: 6,
          paddingHorizontal: SOCIAL_POST_CARD_PADDING_PT,
        },
      ]}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <View
          style={{
            width: MARKETPLACE_LISTING_IMAGE_PT,
            height: MARKETPLACE_LISTING_IMAGE_PT,
            borderRadius: 4,
            backgroundColor: '#E4E4E7',
          }}
        />
      </View>

      <Text
        hyphenationCallback={hyphenationCallback}
        style={[S.guideCardBody, { marginTop: 6, fontSize: 8.6, fontWeight: 600 }]}
      >
        {businessName.trim()}
      </Text>

      <View style={{ marginTop: 4 }}>
        <View style={{ width: '78%', height: 4, borderRadius: 2, backgroundColor: '#D4D4D8' }} />
        <View style={{ width: '64%', height: 4, borderRadius: 2, backgroundColor: '#E4E4E7', marginTop: 3 }} />
      </View>

      <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[S.guideCardBody, { fontSize: 8.5, fontWeight: 600 }]}>$48</Text>
        <Text style={[S.guideCardBody, { fontSize: 7.7, color: '#6D7A8A' }]}>4.8 ★ · 120</Text>
      </View>

      {captionBody ? (
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideListText, { marginTop: 6, fontSize: 8.1 }]}>
          {captionBody}
        </Text>
      ) : null}
    </View>
  )
}
