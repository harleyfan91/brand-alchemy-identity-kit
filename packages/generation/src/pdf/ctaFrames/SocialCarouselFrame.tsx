import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  SOCIAL_CAROUSEL_CARD_WIDTH_PT,
  SOCIAL_CAROUSEL_MEDIA_HEIGHT_PT,
  SOCIAL_CAROUSEL_MEDIA_WIDTH_PT,
  SOCIAL_POST_CARD_PADDING_PT,
} from './socialFeedLayout.js'
import { normalizeCaption, SocialActionsRow, SocialHeader } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/** 4:5 carousel shell with slide indicators. */
export function SocialCarouselFrame({
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
          width: SOCIAL_CAROUSEL_CARD_WIDTH_PT,
          alignSelf: 'center',
          paddingVertical: 6,
          paddingHorizontal: SOCIAL_POST_CARD_PADDING_PT,
        },
      ]}
    >
      <SocialHeader
        styles={S}
        businessName={businessName}
        hyphenationCallback={hyphenationCallback}
        meta="Carousel · 4 slides"
        progressWidth={100}
      />

      <View style={{ width: '100%', marginTop: 6, alignItems: 'center' }}>
        <View
          style={{
            width: SOCIAL_CAROUSEL_MEDIA_WIDTH_PT,
            height: SOCIAL_CAROUSEL_MEDIA_HEIGHT_PT,
            borderRadius: 4,
            backgroundColor: '#E4E4E7',
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#A1A1AA', marginHorizontal: 2 }} />
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#D4D4D8', marginHorizontal: 2 }} />
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#D4D4D8', marginHorizontal: 2 }} />
      </View>

      {captionBody ? (
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideListText, { marginTop: 6, fontSize: 8.1 }]}>
          {captionBody}
        </Text>
      ) : null}

      <SocialActionsRow />
    </View>
  )
}
