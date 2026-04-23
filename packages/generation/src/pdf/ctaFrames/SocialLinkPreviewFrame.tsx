import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import { SOCIAL_LINK_PREVIEW_THUMB_PT, SOCIAL_POST_CARD_PADDING_PT } from './socialFeedLayout.js'
import { normalizeCaption, SocialActionsRow, SocialHeader } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/** Link-preview shell: headline/snippet card + thumbnail. */
export function SocialLinkPreviewFrame({
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
          width: '100%',
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
        meta="Link post · Public"
        progressWidth={122}
      />

      <View
        style={{
          marginTop: 6,
          borderRadius: 4,
          padding: 6,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
          <View style={{ width: '70%', height: 4, borderRadius: 2, backgroundColor: '#D4D4D8' }} />
          <View style={{ width: '90%', height: 4, borderRadius: 2, backgroundColor: '#E4E4E7', marginTop: 4 }} />
          <View style={{ width: '84%', height: 4, borderRadius: 2, backgroundColor: '#E4E4E7', marginTop: 3 }} />
        </View>
        <View
          style={{
            width: SOCIAL_LINK_PREVIEW_THUMB_PT,
            height: SOCIAL_LINK_PREVIEW_THUMB_PT,
            borderRadius: 3,
            backgroundColor: '#E4E4E7',
          }}
        />
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
