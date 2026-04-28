import type { ReactNode } from 'react'
import { Circle, Line, Path, Polyline, Svg } from '@react-pdf/renderer'

import {
  GLYPH_SIZE_MD,
  GLYPH_SIZE_SM,
  GLYPH_STROKE_DEFAULT,
  GLYPH_STROKE_WEIGHT,
} from '../tokens/glyphTokens.js'

export type GlyphId =
  | 'spark_clarity'
  | 'compass_direction'
  | 'heart_trust'
  | 'chat_voice'
  | 'check_confidence'
  | 'target_focus'
  | 'shield_reliability'
  | 'lightbulb_idea'

const commonStroke = (stroke: string) => ({
  fill: 'none' as const,
  stroke,
  strokeWidth: GLYPH_STROKE_WEIGHT,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

type MicroGlyphBase = {
  glyph: GlyphId
  size?: 'sm' | 'md'
}

export type MicroGlyphProps = MicroGlyphBase &
  (
    | { accent?: false | undefined; color?: string; accentColor?: undefined }
    | { accent: true; accentColor: string; color?: undefined }
  )

export function MicroGlyph(props: MicroGlyphProps) {
  const { glyph, size = 'sm' } = props
  const dim = size === 'md' ? GLYPH_SIZE_MD : GLYPH_SIZE_SM
  const accent = props.accent === true
  /** Accent mode = stroke the glyph in the kit palette accent (`accentColor`), no extra ornament. */
  const stroke = accent ? props.accentColor : props.color ?? GLYPH_STROKE_DEFAULT
  const s = commonStroke(stroke)

  const body = renderGlyphBody(glyph, s)

  return (
    <Svg width={dim} height={dim} viewBox="0 0 24 24">
      {body}
    </Svg>
  )
}

function renderGlyphBody(glyph: GlyphId, s: ReturnType<typeof commonStroke>): ReactNode {
  switch (glyph) {
    case 'spark_clarity':
      return (
        <>
          <Line x1="12" y1="3" x2="12" y2="7" {...s} />
          <Line x1="12" y1="17" x2="12" y2="21" {...s} />
          <Line x1="3" y1="12" x2="7" y2="12" {...s} />
          <Line x1="17" y1="12" x2="21" y2="12" {...s} />
          <Line x1="5.64" y1="5.64" x2="8.46" y2="8.46" {...s} />
          <Line x1="15.54" y1="15.54" x2="18.36" y2="18.36" {...s} />
          <Line x1="18.36" y1="5.64" x2="15.54" y2="8.46" {...s} />
          <Line x1="8.46" y1="15.54" x2="5.64" y2="18.36" {...s} />
        </>
      )
    case 'compass_direction':
      return (
        <>
          <Circle cx="12" cy="12" r="9" {...s} />
          <Line x1="12" y1="4" x2="12" y2="7.5" {...s} />
          <Line x1="12" y1="16.5" x2="12" y2="20" {...s} />
          <Line x1="4" y1="12" x2="7.5" y2="12" {...s} />
          <Line x1="16.5" y1="12" x2="20" y2="12" {...s} />
          <Polyline points="10.5,10 12,5.5 13.5,10" {...s} />
          <Line x1="10.5" y1="10" x2="13.5" y2="10" {...s} />
        </>
      )
    case 'heart_trust':
      return (
        <Path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          {...s}
        />
      )
    case 'chat_voice':
      return (
        <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s} />
      )
    case 'check_confidence':
      return (
        <>
          <Circle cx="12" cy="12" r="10" {...s} />
          <Polyline points="8,12 11,15 16,9" {...s} />
        </>
      )
    case 'target_focus':
      return (
        <>
          <Circle cx="12" cy="12" r="10" {...s} />
          <Circle cx="12" cy="12" r="6" {...s} />
          <Circle cx="12" cy="12" r="2.5" {...s} />
        </>
      )
    case 'shield_reliability':
      return <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...s} />
    case 'lightbulb_idea':
      return (
        <>
          <Line x1="9" y1="21" x2="15" y2="21" {...s} />
          <Line x1="9" y1="18" x2="15" y2="18" {...s} />
          <Path d="M15 18V13.3a6 6 0 1 0-6 0V18" {...s} />
        </>
      )
    default:
      return null
  }
}
