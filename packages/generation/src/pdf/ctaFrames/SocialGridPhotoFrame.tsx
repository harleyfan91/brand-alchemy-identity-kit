import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import { SOCIAL_CREATOR_MEDIA_PT, SOCIAL_GRID_CARD_WIDTH_PT, SOCIAL_POST_CARD_PADDING_PT } from './socialFeedLayout.js'
import { normalizeCaption, SocialActionsRow, SocialHeader } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/** Square-first grid photo shell for profile-grid style social posts. */
export function SocialGridPhotoFrame({
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
          width: SOCIAL_GRID_CARD_WIDTH_PT,
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
        meta="Photo · 2h"
        progressWidth={102}
      />

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

      {captionBody ? (
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideListText, { marginTop: 6, fontSize: 8.25 }]}>
          {captionBody}
        </Text>
      ) : null}

      <SocialActionsRow />
    </View>
  )
}
