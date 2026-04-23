import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  SOCIAL_REEL_CAPTION_DOCK_HEIGHT_PT,
  SOCIAL_REEL_CARD_WIDTH_PT,
  SOCIAL_SHELL_CAPTION_FONT_SIZE_PT,
  SOCIAL_VERTICAL_MEDIA_HEIGHT_PT,
} from './socialFeedLayout.js'
import { normalizeCaption, SocialActionsRow, SocialHeader } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

const STAGE_H = SOCIAL_VERTICAL_MEDIA_HEIGHT_PT

/** 9:16 reel: same flush stage as story; caption dock + actions below. Shell radius only — no inner media radius. */
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
          paddingVertical: 0,
          paddingHorizontal: 0,
          overflow: 'hidden',
        },
      ]}
    >
      <View style={{ width: '100%', height: STAGE_H, position: 'relative' }}>
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
              left: 0,
              right: 0,
              bottom: 0,
              minHeight: SOCIAL_REEL_CAPTION_DOCK_HEIGHT_PT,
              paddingBottom: 10,
              paddingTop: 8,
              paddingHorizontal: 8,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(17, 24, 39, 0.14)',
            }}
          >
            <Text
              hyphenationCallback={hyphenationCallback}
              wrap
              style={[
                S.guideListText,
                {
                  fontSize: SOCIAL_SHELL_CAPTION_FONT_SIZE_PT,
                  lineHeight: 1.42,
                  color: '#111827',
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
            meta="Reel · 3h"
            progressWidth={96}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 10, paddingBottom: 4 }}>
        <SocialActionsRow />
      </View>
    </View>
  )
}
