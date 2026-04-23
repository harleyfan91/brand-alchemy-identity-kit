import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import {
  EMAIL_CARD_FULL_WIDTH,
  SOCIAL_POST_CARD_PADDING_PT,
  WEBSITE_HERO_MEDIA_HEIGHT_PT,
} from './socialFeedLayout.js'
import { normalizeCaption } from './socialShellPrimitives.js'
import type { CtaFrameBaseProps } from './types.js'

/** Desktop-width landing **hero** shell: top bar, wide image band, headline placeholders, merged body, primary chip. */
export function WebsiteHeroCtaFrame({
  styles: S,
  businessName,
  lines,
  hyphenationCallback,
}: CtaFrameBaseProps): ReactElement {
  const body = normalizeCaption(lines)

  return (
    <View
      style={[
        S.guideCard,
        {
          width: EMAIL_CARD_FULL_WIDTH,
          alignSelf: 'stretch',
          paddingVertical: 8,
          paddingHorizontal: SOCIAL_POST_CARD_PADDING_PT,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideCardBody, { fontSize: 8.2, fontWeight: 600 }]}>
          {businessName.trim()}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 18, height: 4, borderRadius: 2, backgroundColor: '#D4D4D8', marginRight: 5 }} />
          <View style={{ width: 18, height: 4, borderRadius: 2, backgroundColor: '#E4E4E7' }} />
        </View>
      </View>

      <View
        style={{
          marginTop: 10,
          width: '100%',
          height: WEBSITE_HERO_MEDIA_HEIGHT_PT,
          borderRadius: 4,
          backgroundColor: '#E4E4E7',
        }}
      />

      <View style={{ marginTop: 10 }}>
        <View style={{ width: '78%', height: 5, borderRadius: 2, backgroundColor: '#D4D4D8' }} />
        <View style={{ width: '56%', height: 5, borderRadius: 2, backgroundColor: '#E4E4E7', marginTop: 5 }} />
      </View>

      {body ? (
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideListText, { marginTop: 8, fontSize: 8.25 }]}>
          {body}
        </Text>
      ) : null}

      <View style={{ marginTop: 8 }}>
        <View
          style={{
            minWidth: 76,
            height: 18,
            borderRadius: 3,
            backgroundColor: '#ECECF1',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 8,
          }}
        >
          <Text style={[S.guideCardBody, { fontSize: 7.2, color: '#374151', fontWeight: 600 }]}>View details</Text>
        </View>
      </View>
    </View>
  )
}
