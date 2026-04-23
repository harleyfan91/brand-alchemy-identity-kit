import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import type { CtaFrameBaseProps, SocialFeedVariant } from './types.js'
import {
  SOCIAL_FEED_CARD_FULL_WIDTH,
  SOCIAL_CREATOR_MEDIA_PT,
  SOCIAL_POST_CARD_PADDING_PT,
  SOCIAL_PRO_MEDIA_HEIGHT_PT,
  SOCIAL_PRO_MEDIA_WIDTH_PT,
} from './socialFeedLayout.js'
import { normalizeCaption, SocialActionsRow, SocialHeader } from './socialShellPrimitives.js'

export function SocialFeedCardFrame({
  styles: S,
  businessName,
  lines,
  hyphenationCallback,
  platformSummary: _platformSummary,
  socialFeedVariant = 'creator_visual_feed',
}: CtaFrameBaseProps): ReactElement {
  const variant: SocialFeedVariant = socialFeedVariant
  const captionBody = normalizeCaption(lines)
  const meta = variant === 'professional_network_feed' ? '1d · Public' : '2h'

  const isPro = variant === 'professional_network_feed'

  return (
    <View
      style={[
        S.guideCard,
        {
          width: SOCIAL_FEED_CARD_FULL_WIDTH,
          alignSelf: 'stretch',
          paddingVertical: 6,
          paddingHorizontal: SOCIAL_POST_CARD_PADDING_PT,
        },
      ]}
    >
      <SocialHeader
        styles={S}
        businessName={businessName}
        hyphenationCallback={hyphenationCallback}
        meta={meta}
        progressWidth={isPro ? 140 : 112}
      />

      {isPro ? (
        <View style={{ width: '100%', marginTop: 6, alignItems: 'center' }}>
          <View
            style={{
              width: SOCIAL_PRO_MEDIA_WIDTH_PT,
              height: SOCIAL_PRO_MEDIA_HEIGHT_PT,
              borderRadius: 3,
              backgroundColor: '#E4E4E7',
            }}
          />
        </View>
      ) : (
        <View style={{ width: '100%', marginTop: 6, alignItems: 'center' }}>
          <View
            style={{
              width: SOCIAL_CREATOR_MEDIA_PT,
              height: SOCIAL_CREATOR_MEDIA_PT,
              borderRadius: 4,
              backgroundColor: '#E4E4E7',
            }}
          />
        </View>
      )}

      {captionBody ? (
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideListText, { marginTop: 6, fontSize: 8.25 }]}>
          {captionBody}
        </Text>
      ) : null}

      <SocialActionsRow />
    </View>
  )
}
