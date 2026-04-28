import type { ReactElement, ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import {
  TRANSMUTATION_ARC_NEUTRAL,
  TRANSMUTATION_ARC_PATH,
  TRANSMUTATION_ARC_VIEW_H,
  TRANSMUTATION_ARC_VIEW_W,
  TransmutationArc,
  type TransmutationArcProps,
} from './TransmutationArc.js'

function flattenElements(node: ReactNode): ReactElement[] {
  if (node === null || node === undefined || typeof node === 'boolean') return []
  if (typeof node === 'string' || typeof node === 'number') return []
  if (Array.isArray(node)) return node.flatMap(flattenElements)
  const el = node as ReactElement
  const isFragment =
    typeof el.type === 'symbol' ||
    (typeof el.type === 'function' && (el.type as { displayName?: string }).displayName === 'Fragment')
  if (isFragment) return flattenElements((el.props as { children?: ReactNode })?.children)
  const children = (el.props as { children?: ReactNode })?.children
  return [el, ...flattenElements(children)]
}

function renderArc(props: TransmutationArcProps): ReactElement {
  return TransmutationArc(props) as ReactElement
}

describe('TransmutationArc', () => {
  it('renders an Svg root with the spec viewBox and honors width/height props', () => {
    const root = renderArc({ width: 760, height: 90, accentColor: '#7A6A4F' })
    expect(root.type).toBe('SVG')
    const props = root.props as { width: number; height: number; viewBox: string }
    expect(props.viewBox).toBe(`0 0 ${TRANSMUTATION_ARC_VIEW_W} ${TRANSMUTATION_ARC_VIEW_H}`)
    expect(props.width).toBe(760)
    expect(props.height).toBe(90)
  })

  it('defaults height to 90 when only width is provided', () => {
    const root = renderArc({ width: 600, accentColor: '#7A6A4F' })
    const props = root.props as { width: number; height: number }
    expect(props.height).toBe(90)
  })

  it('renders a whisper baseline path (very light neutral horizon)', () => {
    const root = renderArc({ width: 600, accentColor: '#7A6A4F' })
    const arcPath = flattenElements((root.props as { children?: ReactNode }).children).find(
      (el) =>
        (el.type as { displayName?: string } | string) &&
        ((el.type as string) === 'PATH' || (el.type as { displayName?: string }).displayName === 'Path') &&
        (el.props as { d?: string }).d === TRANSMUTATION_ARC_PATH,
    )
    expect(arcPath).toBeDefined()
    const p = arcPath!.props as { stroke?: string; strokeWidth?: number; strokeOpacity?: number; fill?: string }
    expect(p.stroke).toBe(TRANSMUTATION_ARC_NEUTRAL)
    expect(p.fill).toBe('none')
    expect(p.strokeWidth).toBeLessThan(1)
    expect(p.strokeOpacity).toBeLessThan(0.5)
  })

  it('uses caramel only in the refined center mark cluster', () => {
    const accentColor = '#C8932A'
    const root = renderArc({ width: 600, accentColor })
    const children = flattenElements((root.props as { children?: ReactNode }).children)

    const accentTouches = children.filter((el) => {
      const cp = el.props as { fill?: string; stroke?: string }
      return cp.fill === accentColor || cp.stroke === accentColor
    })
    expect(accentTouches.length).toBeGreaterThanOrEqual(4)

    for (const el of accentTouches) {
      const cp = el.props as { cx?: number; fill?: string; stroke?: string; points?: string }
      if (cp.cx !== undefined) {
        expect(cp.cx).toBeGreaterThanOrEqual(168)
        expect(cp.cx).toBeLessThanOrEqual(172)
      }
      if (cp.points !== undefined) {
        expect(cp.points).toMatch(/160|170|180/)
      }
    }
  })

  it('keeps every non-anchor mark in the neutral palette', () => {
    const accentColor = '#7A6A4F'
    const root = renderArc({ width: 600, accentColor })
    const children = flattenElements((root.props as { children?: ReactNode }).children)
    for (const el of children) {
      const cp = el.props as { fill?: string; stroke?: string }
      if (cp.fill === accentColor || cp.stroke === accentColor) continue
      if (cp.stroke !== undefined) expect(cp.stroke).toBe(TRANSMUTATION_ARC_NEUTRAL)
      if (cp.fill !== undefined && cp.fill !== 'none') expect(cp.fill).toBe(TRANSMUTATION_ARC_NEUTRAL)
    }
  })

  it('renders deterministically for a fixed accent color (geometry is not seeded)', () => {
    const a = renderArc({ width: 600, accentColor: '#7A6A4F' })
    const b = renderArc({ width: 600, accentColor: '#7A6A4F' })
    const flatA = flattenElements((a.props as { children?: ReactNode }).children)
    const flatB = flattenElements((b.props as { children?: ReactNode }).children)
    expect(flatA.length).toBe(flatB.length)
    for (let i = 0; i < flatA.length; i++) {
      expect(JSON.stringify(flatA[i].props)).toBe(JSON.stringify(flatB[i].props))
    }
  })

  it('contains the narrative sections: raw polygons and dissolving ring trail', () => {
    const root = renderArc({ width: 600, accentColor: '#7A6A4F' })
    const children = flattenElements((root.props as { children?: ReactNode }).children)
    const polygons = children.filter((el) => (el.type as string) === 'POLYGON')
    const circles = children.filter((el) => (el.type as string) === 'CIRCLE')
    expect(polygons.length).toBeGreaterThanOrEqual(6)
    expect(circles.length).toBeGreaterThanOrEqual(6)
  })
})
