import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  SOCIAL_POST_CARD_PADDING_PT,
  SOCIAL_REEL_CARD_WIDTH_PT,
  SOCIAL_REEL_FOOTER_HEIGHT_PT,
  SOCIAL_VERTICAL_MEDIA_HEIGHT_PT,
  SOCIAL_VERTICAL_MEDIA_WIDTH_PT,
} from './socialFeedLayout.js'
import { normalizeCaption, SocialActionsRow, SocialHeader } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/** 9:16 reel/short-video shell with copy in the lower footer area. */
export function SocialReelCoverFrame({
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
          width: SOCIAL_REEL_CARD_WIDTH_PT,
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
        meta="Reel · 3h"
        progressWidth={96}
      />

      <View style={{ width: '100%', marginTop: 6, alignItems: 'center' }}>
        <View
          style={{
            width: SOCIAL_VERTICAL_MEDIA_WIDTH_PT,
            height: SOCIAL_VERTICAL_MEDIA_HEIGHT_PT,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            backgroundColor: '#E4E4E7',
          }}
        />
        <View
          style={{
            width: SOCIAL_VERTICAL_MEDIA_WIDTH_PT,
            height: SOCIAL_REEL_FOOTER_HEIGHT_PT,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            backgroundColor: '#F1F2F4',
            justifyContent: 'flex-start',
            paddingTop: 6,
            paddingHorizontal: 5,
          }}
        >
          {captionBody ? (
            <Text
              hyphenationCallback={hyphenationCallback}
              style={[S.guideListText, { fontSize: 7.25, lineHeight: 1.2 }]}
            >
              {captionBody}
            </Text>
          ) : null}
        </View>
      </View>

      <SocialActionsRow />
    </View>
  )
}
