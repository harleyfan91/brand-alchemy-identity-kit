import { Circle, Line, Path, Polygon, Svg, Text } from '@react-pdf/renderer'

/**
 * TransmutationArc — Folio 04 (Voice) accent.
 *
 * A static, deterministic SVG encoding the story:
 * Raw -> Ordering -> Refined -> Pure (dissolving rings).
 *
 * Design rules:
 *   - Mostly neutral (#2A2A3A). The refined center mark is the only accented zone.
 *   - Geometry is fully deterministic (no PRNG / no per-business seed) so the
 *     visual reads as a brand-system mark, not a generated graphic.
 *   - viewBox is fixed at 160x30 and scaled via the `width` / `height` props.
 */

export const TRANSMUTATION_ARC_VIEW_W = 260
export const TRANSMUTATION_ARC_VIEW_H = 30
export const TRANSMUTATION_ARC_NEUTRAL = '#2A2A3A'
export const TRANSMUTATION_ARC_PATH = 'M 10 16 L 250 16'

export type TransmutationArcProps = {
  width: number
  height?: number
  accentColor: string
}

export function TransmutationArc({ width, height = 90, accentColor }: TransmutationArcProps) {
  const n = TRANSMUTATION_ARC_NEUTRAL
  const refined = accentColor
  const y = 16
  const symbolStroke = 0.75
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${TRANSMUTATION_ARC_VIEW_W} ${TRANSMUTATION_ARC_VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <Path
        d={TRANSMUTATION_ARC_PATH}
        stroke={n}
        strokeWidth={0.4}
        strokeOpacity={0.15}
        fill="none"
      />

      {/* Soft structural separators between narrative zones. */}
      <Line
        x1={82}
        y1={8}
        x2={82}
        y2={24}
        stroke={n}
        strokeWidth={0.35}
        strokeOpacity={0.2}
        strokeDasharray="2 3"
      />
      <Line
        x1={148}
        y1={8}
        x2={148}
        y2={24}
        stroke={n}
        strokeWidth={0.35}
        strokeOpacity={0.2}
        strokeDasharray="2 3"
      />
      <Line
        x1={190}
        y1={8}
        x2={190}
        y2={24}
        stroke={n}
        strokeWidth={0.35}
        strokeOpacity={0.2}
        strokeDasharray="2 3"
      />

      {/* Raw: irregular, mismatched polygons. */}
      <Polygon
        points={`${20},${y + 4} ${24},${y - 5} ${30},${y - 3} ${29},${y + 5} ${22},${y + 6}`}
        fill="none"
        stroke={n}
        strokeWidth={symbolStroke}
        strokeOpacity={0.55}
        strokeLinejoin="miter"
      />
      <Polygon
        points={`${42},${y + 5} ${50},${y + 1} ${48},${y + 8} ${40},${y + 7}`}
        fill="none"
        stroke={n}
        strokeWidth={symbolStroke}
        strokeOpacity={0.55}
        strokeLinejoin="round"
      />
      <Polygon
        points={`${64},${y + 5} ${69},${y - 5} ${74},${y + 4}`}
        fill="none"
        stroke={n}
        strokeWidth={symbolStroke}
        strokeOpacity={0.55}
        strokeLinejoin="bevel"
      />

      {/* Ordering: forms regularize and begin to rhyme. */}
      <Polygon
        points={`${100},${y + 5.6} ${104},${y - 6.4} ${108},${y + 5.6}`}
        fill="none"
        stroke={n}
        strokeWidth={symbolStroke}
        strokeOpacity={0.65}
      />
      <Polygon
        points={`${122},${y + 5.8} ${126},${y - 6.1} ${130},${y + 5.8}`}
        fill="none"
        stroke={n}
        strokeWidth={symbolStroke}
        strokeOpacity={0.65}
      />
      <Circle cx={139} cy={y + 0.7} r={4.1} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.65} />

      {/* Refined: centered caramel destination mark in the third segment. */}
      <Polygon
        points={`${164},${y + 6.4} ${170},${y - 7.8} ${176},${y + 6.4}`}
        fill="none"
        stroke={refined}
        strokeWidth={symbolStroke}
        strokeOpacity={1}
      />
      <Circle cx={170} cy={y} r={4.6} fill="none" stroke={refined} strokeWidth={symbolStroke} strokeOpacity={1} />
      <Circle cx={170} cy={y} r={0.7} fill={refined} />

      {/* Pure/dissolving: equal edge gaps (not equal centers) as radii shrink. */}
      <Circle cx={204} cy={y} r={5.8} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.45} />
      <Circle cx={204} cy={y} r={3.9} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.32} />
      <Circle cx={204} cy={y} r={2.2} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.2} />

      <Circle cx={217.4} cy={y} r={4.6} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.32} />
      <Circle cx={217.4} cy={y} r={2.4} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.2} />

      <Circle cx={228.4} cy={y} r={3.4} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.2} />
      <Circle cx={237.2} cy={y} r={2.4} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.1} />

      {/* Labels: minimal and quiet except refined mark label. */}
      <Text x={14} y={28} fontSize={6.5} fill={n} opacity={0.35} letterSpacing="0.07em">
        raw
      </Text>
      <Text x={170} y={28} textAnchor="middle" fontSize={6.5} fill={refined} opacity={1} letterSpacing="0.07em">
        refined
      </Text>
      <Text x={221} y={28} textAnchor="middle" fontSize={6.5} fill={n} opacity={0.22} letterSpacing="0.07em">
        pure
      </Text>
    </Svg>
  )
}
