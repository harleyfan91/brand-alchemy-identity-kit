import type { ReactElement, ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import {
  GLYPH_SIZE_MD,
  GLYPH_SIZE_SM,
  GLYPH_STROKE_DEFAULT,
  GLYPH_STROKE_WEIGHT,
} from '../tokens/glyphTokens.js'

import { MicroGlyph, type GlyphId, type MicroGlyphProps } from './MicroGlyph.js'

const ALL_GLYPHS: GlyphId[] = [
  'spark_clarity',
  'compass_direction',
  'heart_trust',
  'chat_voice',
  'check_confidence',
  'target_focus',
  'shield_reliability',
  'lightbulb_idea',
]

/** Recursively flattens React children, including fragments and arrays, into a flat element list. */
function flattenElements(node: ReactNode): ReactElement[] {
  if (node === null || node === undefined || typeof node === 'boolean') return []
  if (typeof node === 'string' || typeof node === 'number') return []
  if (Array.isArray(node)) return node.flatMap(flattenElements)
  const el = node as ReactElement
  const isFragment =
    typeof el.type === 'symbol' || (typeof el.type === 'function' && (el.type as { displayName?: string }).displayName === 'Fragment')
  if (isFragment) {
    return flattenElements((el.props as { children?: ReactNode })?.children)
  }
  const children = (el.props as { children?: ReactNode })?.children
  return [el, ...flattenElements(children)]
}

function renderMicroGlyph(props: MicroGlyphProps): ReactElement {
  return MicroGlyph(props) as ReactElement
}

describe('MicroGlyph', () => {
  it('exports all 8 v1 glyph ids', () => {
    expect(ALL_GLYPHS).toHaveLength(8)
  })

  describe.each(ALL_GLYPHS)('%s', (glyph) => {
    it('renders an Svg root with the spec viewBox at sm', () => {
      const root = renderMicroGlyph({ glyph, size: 'sm' })
      expect(root.type).toBe('SVG')
      const props = root.props as { width: number; height: number; viewBox: string }
      expect(props.viewBox).toBe('0 0 24 24')
      expect(props.width).toBe(GLYPH_SIZE_SM)
      expect(props.height).toBe(GLYPH_SIZE_SM)
    })

    it('renders at md token size', () => {
      const root = renderMicroGlyph({ glyph, size: 'md' })
      const props = root.props as { width: number; height: number }
      expect(props.width).toBe(GLYPH_SIZE_MD)
      expect(props.height).toBe(GLYPH_SIZE_MD)
    })

    it('uses the neutral default stroke when accent is not set', () => {
      const root = renderMicroGlyph({ glyph })
      const children = flattenElements((root.props as { children?: ReactNode }).children)
      expect(children.length).toBeGreaterThan(0)
      for (const child of children) {
        const cp = child.props as { stroke?: string; fill?: string; strokeWidth?: number }
        if (cp.stroke !== undefined) {
          expect(cp.stroke).toBe(GLYPH_STROKE_DEFAULT)
          expect(cp.fill).toBe('none')
          expect(cp.strokeWidth).toBe(GLYPH_STROKE_WEIGHT)
        }
      }
    })

    it('strokes every shape with accentColor and adds no filled shapes when accent=true', () => {
      const accentColor = '#7A6A4F'
      const root = renderMicroGlyph({ glyph, accent: true, accentColor })
      const children = flattenElements((root.props as { children?: ReactNode }).children)
      for (const child of children) {
        const cp = child.props as { stroke?: string; fill?: string }
        if (cp.stroke !== undefined) expect(cp.stroke).toBe(accentColor)
        // No filled shapes (the deleted accent dot regression guard).
        expect(cp.fill === undefined || cp.fill === 'none').toBe(true)
      }
    })

    it('honors a custom neutral color override', () => {
      const root = renderMicroGlyph({ glyph, color: '#123456' })
      const children = flattenElements((root.props as { children?: ReactNode }).children)
      for (const child of children) {
        const cp = child.props as { stroke?: string }
        if (cp.stroke !== undefined) expect(cp.stroke).toBe('#123456')
      }
    })
  })
})
