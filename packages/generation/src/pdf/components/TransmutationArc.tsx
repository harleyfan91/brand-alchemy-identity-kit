import { Circle, Line, Path, Polygon, Svg, Text } from '@react-pdf/renderer'

/**
 * TransmutationArc — Folio 04 (Voice) accent.
 *
 * A static, deterministic SVG encoding the story:
 * Raw -> Ordering -> Refined -> Pure (dissolving rings).
 *
 * The second zone ("ordering") has no caption on purpose: the three raw
 * marks are the same narrative slots as the refined mark’s three parts —
 * outer triangle, ring, inner dot — shown mid-morph (vertex lerp toward
 * those targets; the dot slot uses a denser small n-gon) and shifted closer
 * together on x so the band reads as
 * “closing in” on the perfectly stacked refined cluster. The quad→ring slot
 * uses one **inward circular fillet** at the corner nearest refined (trim +
 * `A` arc) so the corner smooths symmetrically instead of warping the whole
 * quad toward the accent.
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

const REFINED_CX = 170
const REFINED_RING_R = 4.6

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function formatPoints(pts: Array<{ x: number; y: number }>): string {
  return pts.map((p) => `${round2(p.x)},${round2(p.y)}`).join(' ')
}

function centroid(pts: Array<{ x: number; y: number }>): { x: number; y: number } {
  const sx = pts.reduce((a, p) => a + p.x, 0)
  const sy = pts.reduce((a, p) => a + p.y, 0)
  return { x: sx / pts.length, y: sy / pts.length }
}

/** CCW sort of four points around their centroid (convex quad for stroke). */
function orderConvexQuad(pts: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
  const c = centroid(pts)
  return [...pts].sort((a, b) => Math.atan2(a.y - c.y, a.x - c.x) - Math.atan2(b.y - c.y, b.x - c.x))
}

function shiftX(pts: Array<{ x: number; y: number }>, dx: number): Array<{ x: number; y: number }> {
  return pts.map((p) => ({ x: p.x + dx, y: p.y }))
}

/**
 * Same morphed quad as the polygon lerp, but the corner nearest the refined
 * stack gets a **circular fillet** (trim + inward `A` arc): the sharp corner is
 * symmetrically “filed down” toward a ring-like curve, without biasing the
 * whole shape toward the accent (which read as wilting with an outward Q).
 */
function orderingQuadPathWithInwardCircularFillet(
  quad: Array<{ x: number; y: number }>,
  refinedCx: number,
  refinedCy: number,
  trim: number,
): string {
  if (quad.length !== 4) return 'M0,0Z'

  let k = 0
  let best = Infinity
  for (let i = 0; i < 4; i++) {
    const d = Math.hypot(quad[i].x - refinedCx, quad[i].y - refinedCy)
    if (d < best) {
      best = d
      k = i
    }
  }

  const A = quad[(k + 3) % 4]
  const B = quad[k]
  const C = quad[(k + 1) % 4]
  const far = quad[(k + 2) % 4]

  const dBA = Math.hypot(B.x - A.x, B.y - A.y) || 1
  const dBC = Math.hypot(C.x - B.x, C.y - B.y) || 1
  const trimClamped = Math.min(trim, dBA * 0.34, dBC * 0.34)

  const dirA = { x: (A.x - B.x) / dBA, y: (A.y - B.y) / dBA }
  const dirC = { x: (C.x - B.x) / dBC, y: (C.y - B.y) / dBC }
  const gamma = Math.acos(Math.max(-1, Math.min(1, dirA.x * dirC.x + dirA.y * dirC.y)))

  const P = { x: B.x + dirA.x * trimClamped, y: B.y + dirA.y * trimClamped }
  const Q = { x: B.x + dirC.x * trimClamped, y: B.y + dirC.y * trimClamped }

  const ctr = centroid(quad)
  const simpleClosed = [
    `M${round2(A.x)},${round2(A.y)}`,
    `L${round2(B.x)},${round2(B.y)}`,
    `L${round2(C.x)},${round2(C.y)}`,
    `L${round2(far.x)},${round2(far.y)}`,
    'Z',
  ].join(' ')

  if (!Number.isFinite(gamma) || gamma < 0.25 || trimClamped < 0.35) {
    return simpleClosed
  }

  const half = gamma / 2
  const tanHalf = Math.tan(half)
  if (!Number.isFinite(tanHalf) || Math.abs(tanHalf) < 1e-4) {
    return simpleClosed
  }

  let R = trimClamped / tanHalf
  R = Math.min(R, 6)

  let bis = { x: dirA.x + dirC.x, y: dirA.y + dirC.y }
  const bisLen = Math.hypot(bis.x, bis.y) || 1
  bis = { x: bis.x / bisLen, y: bis.y / bisLen }
  if (bis.x * (ctr.x - B.x) + bis.y * (ctr.y - B.y) < 0) {
    bis = { x: -bis.x, y: -bis.y }
  }

  const dBO = R / Math.sin(half)
  const O = { x: B.x + bis.x * dBO, y: B.y + bis.y * dBO }

  const rP = Math.hypot(P.x - O.x, P.y - O.y)
  const rQ = Math.hypot(Q.x - O.x, Q.y - O.y)
  const Rarc = Math.min(6.5, (rP + rQ) / 2)

  const cross = (P.x - O.x) * (Q.y - O.y) - (P.y - O.y) * (Q.x - O.x)
  const sweep = cross <= 0 ? 1 : 0
  const dotp = (P.x - O.x) * (Q.x - O.x) + (P.y - O.y) * (Q.y - O.y)
  const span = Math.abs(Math.atan2(cross, dotp))
  const large = span > Math.PI ? 1 : 0

  return [
    `M${round2(A.x)},${round2(A.y)}`,
    `L${round2(P.x)},${round2(P.y)}`,
    `A${round2(Rarc)} ${round2(Rarc)} 0 ${large} ${sweep} ${round2(Q.x)},${round2(Q.y)}`,
    `L${round2(C.x)},${round2(C.y)}`,
    `L${round2(far.x)},${round2(far.y)}`,
    'Z',
  ].join(' ')
}

/** Ordering morph: raw slot 1→refined Δ, slot 2→ring, slot 3→dot; same t + horizontal pull-in. */
function orderingMorphPolys(y: number, tMorph: number, pullX: number) {
  const rawTri = [
    { x: 20, dy: 5 },
    { x: 25, dy: -5 },
    { x: 30, dy: 4 },
  ]
  const refTri = [
    { x: 164, dy: 6.4 },
    { x: 170, dy: -7.8 },
    { x: 176, dy: 6.4 },
  ]
  const tri = shiftX(
    rawTri.map((p, i) => ({
      x: p.x + tMorph * (refTri[i].x - p.x),
      y: y + p.dy + tMorph * (refTri[i].dy - p.dy),
    })),
    pullX,
  )

  const rawQuad = [
    { x: 42, dy: 5 },
    { x: 50, dy: 1 },
    { x: 48, dy: 8 },
    { x: 40, dy: 7 },
  ]
  const refRingCard = [
    { x: REFINED_CX, dy: -REFINED_RING_R },
    { x: REFINED_CX + REFINED_RING_R, dy: 0 },
    { x: REFINED_CX, dy: REFINED_RING_R },
    { x: REFINED_CX - REFINED_RING_R, dy: 0 },
  ]
  const quad = shiftX(
    orderConvexQuad(
      rawQuad.map((p, i) => ({
        x: p.x + tMorph * (refRingCard[i].x - p.x),
        y: y + p.dy + tMorph * (y + refRingCard[i].dy - (y + p.dy)),
      })),
    ),
    pullX,
  )

  /**
   * Dot slot: 8 stops on a compact, near-radial loop (radius wobble only — no long
   * straight run that reads as a “P”). Center sits left of the old pent so after
   * the shared lerp + pull it packs closer to the tri / quad pair.
   */
  const dotCx = 63.95
  const dotCyOff = 0.88
  const dotRadii = [2.7, 3.04, 2.84, 3.06, 2.76, 2.98, 3.02, 2.66]
  const dotPhase = 0.24
  const rawToDot = dotRadii.map((r, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 4 + dotPhase
    return {
      x: dotCx + r * Math.cos(a),
      dy: dotCyOff + r * 0.9 * Math.sin(a),
    }
  })
  const pent = shiftX(
    rawToDot.map((p) => ({
      x: p.x + tMorph * (REFINED_CX - p.x),
      y: y + p.dy + tMorph * (0 - p.dy),
    })),
    pullX,
  )

  return { tri, quad, pent }
}

export function TransmutationArc({ width, height = 90, accentColor }: TransmutationArcProps) {
  const n = TRANSMUTATION_ARC_NEUTRAL
  const refined = accentColor
  const y = 16
  /** ViewBox units; keep low — scaling to layout width magnifies apparent weight. */
  const symbolStroke = 0.5
  /** Accent cluster: same hue as palette but not full-opacity (neighbors peak ~0.65). */
  const refinedStrokeOpacity = 0.72
  const refinedLabelOpacity = 0.62
  const refinedDotFillOpacity = 0.78
  const labelFontSize = 5.25

  const tMorph = 0.5
  const prePull = orderingMorphPolys(y, tMorph, 0)
  const avgX =
    (centroid(prePull.tri).x + centroid(prePull.quad).x + centroid(prePull.pent).x) / 3
  /** Slide the trio right so they sit tighter in the ordering band (~82–148) toward refined. */
  const targetMeanX = 120
  const pullX = targetMeanX - avgX
  const { tri: orderingTri, quad: orderingQuad, pent: orderingPent } = orderingMorphPolys(y, tMorph, pullX)

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

      {/* Raw: irregular, mismatched polygons (left + right slots swapped vs prior layout). */}
      <Polygon
        points={`${20},${y + 5} ${25},${y - 5} ${30},${y + 4}`}
        fill="none"
        stroke={n}
        strokeWidth={symbolStroke}
        strokeOpacity={0.55}
        strokeLinejoin="round"
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
        points={`${64},${y + 4} ${68},${y - 5} ${74},${y - 3} ${73},${y + 5} ${66},${y + 6}`}
        fill="none"
        stroke={n}
        strokeWidth={symbolStroke}
        strokeOpacity={0.55}
        strokeLinejoin="miter"
      />

      {/* Ordering: raw tri / quad / pent → refined Δ / ring / dot (vertex lerp + horizontal pull-in). */}
      <Polygon
        points={formatPoints(orderingTri)}
        fill="none"
        stroke={n}
        strokeWidth={symbolStroke}
        strokeOpacity={0.6}
        strokeLinejoin="round"
      />
      <Path
        d={orderingQuadPathWithInwardCircularFillet(orderingQuad, REFINED_CX, y, 2.15)}
        fill="none"
        stroke={n}
        strokeWidth={symbolStroke}
        strokeOpacity={0.6}
        strokeLinejoin="round"
      />
      <Polygon
        points={formatPoints(orderingPent)}
        fill="none"
        stroke={n}
        strokeWidth={symbolStroke}
        strokeOpacity={0.6}
        strokeLinejoin="round"
      />

      {/* Refined: centered caramel destination mark in the third segment. */}
      <Polygon
        points={`${164},${y + 6.4} ${170},${y - 7.8} ${176},${y + 6.4}`}
        fill="none"
        stroke={refined}
        strokeWidth={symbolStroke}
        strokeOpacity={refinedStrokeOpacity}
      />
      <Circle
        cx={170}
        cy={y}
        r={4.6}
        fill="none"
        stroke={refined}
        strokeWidth={symbolStroke}
        strokeOpacity={refinedStrokeOpacity}
      />
      <Circle cx={170} cy={y} r={0.7} fill={refined} fillOpacity={refinedDotFillOpacity} />

      {/* Pure/dissolving: equal edge gaps (not equal centers) as radii shrink. */}
      <Circle cx={204} cy={y} r={5.8} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.45} />
      <Circle cx={204} cy={y} r={3.9} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.32} />
      <Circle cx={204} cy={y} r={2.2} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.2} />

      <Circle cx={217.4} cy={y} r={4.6} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.32} />
      <Circle cx={217.4} cy={y} r={2.4} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.2} />

      <Circle cx={228.4} cy={y} r={3.4} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.2} />
      <Circle cx={237.2} cy={y} r={2.4} fill="none" stroke={n} strokeWidth={symbolStroke} strokeOpacity={0.1} />

      {/* Labels: minimal and quiet except refined mark label. */}
      <Text x={14} y={28} fontSize={labelFontSize} fill={n} opacity={0.35} letterSpacing="0.07em">
        raw
      </Text>
      <Text x={116} y={28} textAnchor="middle" fontSize={labelFontSize} fill={n} opacity={0.24} letterSpacing="0.1em">
        ...
      </Text>
      <Text
        x={170}
        y={28}
        textAnchor="middle"
        fontSize={labelFontSize}
        fill={refined}
        opacity={refinedLabelOpacity}
        letterSpacing="0.07em"
      >
        refined
      </Text>
      <Text
        x={221}
        y={28}
        textAnchor="middle"
        fontSize={labelFontSize}
        fill={n}
        opacity={0.22}
        letterSpacing="0.07em"
      >
        pure
      </Text>
    </Svg>
  )
}
