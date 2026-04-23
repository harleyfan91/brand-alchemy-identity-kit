import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import { SOCIAL_POST_CARD_PADDING_PT, SOCIAL_TEXT_ONLY_CARD_WIDTH_PT } from './socialFeedLayout.js'
import { normalizeCaption, SocialActionsRow, SocialHeader } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/** Text-led social shell with no media slot. */
export function SocialTextOnlyFrame({
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
          width: SOCIAL_TEXT_ONLY_CARD_WIDTH_PT,
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
        meta="Text post · 1h"
        progressWidth={88}
      />

      {captionBody ? (
        <View style={{ marginTop: 8 }}>
          <Text hyphenationCallback={hyphenationCallback} style={[S.guideListText, { fontSize: 8.5, lineHeight: 1.38 }]}>
            {captionBody}
          </Text>
        </View>
      ) : null}

      <SocialActionsRow />
    </View>
  )
}
