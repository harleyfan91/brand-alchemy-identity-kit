import { Path, Polyline, Svg, Text, View } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import type { CtaFrameBaseProps } from './types.js'

const CHROME = '#9CA3AF'
const STROKE = 1.35

export function normalizeCaption(lines: string[]): string {
  return lines
    .map((s) => s.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join(' ')
}

/**
 * Pinterest/overlay-safe micro-copy: visual-first platforms perform better with short
 * in-image hooks than long imperative CTA paragraphs.
 */
export function shortOverlayCopy(lines: string[], maxWords = 8): string {
  const sentence = normalizeCaption(lines).split(/[.!?]/)[0]?.trim() ?? ''
  if (!sentence) return ''
  return sentence
    .split(/\s+/)
    .slice(0, maxWords)
    .join(' ')
}

function IconLike(): ReactElement {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        stroke={CHROME}
        strokeWidth={STROKE}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function IconComment(): ReactElement {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke={CHROME}
        strokeWidth={STROKE}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function IconRepost(): ReactElement {
  const common = {
    stroke: CHROME,
    strokeWidth: STROKE,
    fill: 'none' as const,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Polyline points="17 1 21 5 17 9" {...common} />
      <Polyline points="7 23 3 19 7 15" {...common} />
      <Path d="M21 5H9.5a4 4 0 0 0-4 4v1" {...common} />
      <Path d="M3 19h11.5a4 4 0 0 0 4-4v-1" {...common} />
    </Svg>
  )
}

function IconSend(): ReactElement {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Path
        d="m22 2-7 20-4-9-9-4Z"
        stroke={CHROME}
        strokeWidth={STROKE}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 2 11 13"
        stroke={CHROME}
        strokeWidth={STROKE}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function EmailEnvelopeIcon(): ReactElement {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Path
        d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
        stroke={CHROME}
        strokeWidth={STROKE}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m3 8 9 6 9-6"
        stroke={CHROME}
        strokeWidth={STROKE}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function SocialHeader({
  styles: S,
  businessName,
  hyphenationCallback,
  meta,
  progressWidth,
}: Pick<CtaFrameBaseProps, 'styles' | 'businessName' | 'hyphenationCallback'> & {
  meta: string
  progressWidth: number
}): ReactElement {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: '#E4E4E7',
          marginRight: 8,
        }}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text hyphenationCallback={hyphenationCallback} style={[S.guideCardBody, { fontSize: 9.25, fontWeight: 600 }]}>
          {businessName.trim()}
        </Text>
        <Text style={[S.guideCardBody, { fontSize: 7.25, color: '#6D7A8A', marginTop: 1, fontWeight: 400 }]}>
          {meta}
        </Text>
        <View
          style={{
            marginTop: 4,
            width: progressWidth,
            height: 3,
            borderRadius: 2,
            backgroundColor: '#E8E8ED',
          }}
        />
      </View>
    </View>
  )
}

export function SocialActionsRow(): ReactElement {
  return (
    <View
      style={{
        marginTop: 6,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#F4F4F5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ marginRight: 14 }}>
          <IconLike />
        </View>
        <View style={{ marginRight: 14 }}>
          <IconComment />
        </View>
        <View style={{ marginRight: 14 }}>
          <IconRepost />
        </View>
        <IconSend />
      </View>
    </View>
  )
}
