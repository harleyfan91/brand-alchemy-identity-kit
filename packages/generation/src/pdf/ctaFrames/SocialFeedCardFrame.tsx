/**
 * Generic square-ish “feed post” shell (no platform marks). See docs/guides/CTA_IN_CONTEXT_FRAME_LIBRARY.md.
 */
import { Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import type { CtaFrameBaseProps } from './types.js'

function truncateDisplayName(name: string, max = 34): string {
  const t = name.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trimEnd()}\u2026`
}

export function SocialFeedCardFrame({
  styles: S,
  businessName,
  lines,
  hyphenationCallback,
}: CtaFrameBaseProps): ReactElement {
  const display = truncateDisplayName(businessName)
  const primary = lines[0] ?? ''
  const secondary = lines[1]

  return (
    <View style={S.guideCard} wrap={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: '#E4E4E7',
            marginRight: 8,
          }}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text hyphenationCallback={hyphenationCallback} style={S.guideCardBody}>
            {display}
          </Text>
          <Text style={S.guideCardLabel}>POST PREVIEW</Text>
        </View>
      </View>
      {primary ? (
        <Text hyphenationCallback={hyphenationCallback} style={S.guideListText}>
          {primary}
        </Text>
      ) : null}
      {secondary ? (
        <Text
          hyphenationCallback={hyphenationCallback}
          style={[S.guideListText, { marginTop: 6, fontWeight: 600 }]}
        >
          {secondary}
        </Text>
      ) : null}
    </View>
  )
}
