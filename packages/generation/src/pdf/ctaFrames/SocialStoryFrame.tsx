import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  SOCIAL_SHELL_CAPTION_FONT_SIZE_PT,
  SOCIAL_STORY_CARD_WIDTH_PT,
  SOCIAL_STORY_REEL_DEVICE_CONTENT_HEIGHT_PT,
} from './socialFeedLayout.js'
import { normalizeCaption, SocialHeader } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/**
 * Story: one full-bleed canvas (`SOCIAL_STORY_REEL_DEVICE_CONTENT_HEIGHT_PT`)—no separate bottom band.
 * Height matches reel (9:16 stage + its actions strip) so outer device size is identical.
 */
export function SocialStoryFrame({
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
          width: SOCIAL_STORY_CARD_WIDTH_PT,
          alignSelf: cardAlignSelf,
          paddingVertical: 0,
          paddingHorizontal: 0,
          overflow: 'hidden',
        },
      ]}
    >
      <View style={{ width: '100%', height: SOCIAL_STORY_REEL_DEVICE_CONTENT_HEIGHT_PT, position: 'relative' }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#E4E4E7',
          }}
        />

        {captionBody ? (
          <View
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              right: 0,
              bottom: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text
              hyphenationCallback={hyphenationCallback}
              wrap
              style={[
                S.guideCtaCaptionText,
                {
                  width: '100%',
                  fontSize: SOCIAL_SHELL_CAPTION_FONT_SIZE_PT,
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: 1.45,
                  textAlign: 'center',
                },
              ]}
            >
              {captionBody}
            </Text>
          </View>
        ) : null}

        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 9, paddingHorizontal: 10 }}>
          <SocialHeader
            variant="onMedia"
            styles={S}
            businessName={businessName}
            hyphenationCallback={hyphenationCallback}
            meta="Story · 24h"
            progressWidth={84}
          />
        </View>
      </View>
    </View>
  )
}
