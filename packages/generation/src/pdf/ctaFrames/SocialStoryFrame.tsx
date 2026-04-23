import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  SOCIAL_POST_CARD_PADDING_PT,
  SOCIAL_STORY_CARD_WIDTH_PT,
  SOCIAL_VERTICAL_MEDIA_HEIGHT_PT,
  SOCIAL_VERTICAL_MEDIA_WIDTH_PT,
} from './socialFeedLayout.js'
import { normalizeCaption, SocialHeader } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/** 9:16 story shell with copy overlaid on the photo region. */
export function SocialStoryFrame({
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
          width: SOCIAL_STORY_CARD_WIDTH_PT,
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
        meta="Story · 24h"
        progressWidth={92}
      />

      <View style={{ width: '100%', marginTop: 6, alignItems: 'center' }}>
        <View
          style={{
            width: SOCIAL_VERTICAL_MEDIA_WIDTH_PT,
            height: SOCIAL_VERTICAL_MEDIA_HEIGHT_PT,
            borderRadius: 5,
            backgroundColor: '#E4E4E7',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 6,
          }}
        >
          {captionBody ? (
            <Text
              hyphenationCallback={hyphenationCallback}
              style={[
                S.guideListText,
                {
                  width: '100%',
                  fontSize: 9.2,
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: 1.35,
                  textAlign: 'center',
                },
              ]}
            >
              {captionBody}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  )
}
