import { describe, expect, it } from 'vitest'

import {
  compositionTagsOverlap,
  findCompositionOverlaps,
  formatCompositionOverlapWarning,
} from './compositionOverlap.js'
import type { ImageBankAsset, ImageBankMetadataFile } from './types.js'

function asset(partial: Partial<ImageBankAsset> & Pick<ImageBankAsset, 'imageId'>): ImageBankAsset {
  return {
    sourceUrl: 'https://images.unsplash.com/photo-1',
    orientation: 'landscape',
    paletteFamily: 'warm-earth',
    styleRegister: 'warm',
    sceneType: 'texture',
    license: 'unsplash',
    src: `assets/${partial.imageId}.jpg`,
    widthPx: 1600,
    heightPx: 1066,
    bytes: 100_000,
    jpegQuality: 82,
    ingestedAt: '2026-01-01T00:00:00.000Z',
    ...partial,
  }
}

describe('compositionOverlap', () => {
  const metadata: ImageBankMetadataFile = {
    version: 1,
    assets: [
      asset({
        imageId: 'batch001_beans_texture',
        styleRegister: 'warm',
        sceneType: 'texture',
        propCategory: 'food-beverage',
        imagerySubjects: ['materials-texture', 'food-dining'],
      }),
      asset({
        imageId: 'batch009_warm_texture_bread',
        styleRegister: 'warm',
        sceneType: 'texture',
        propCategory: 'food-beverage',
        imagerySubjects: ['materials-texture', 'food-dining'],
      }),
      asset({
        imageId: 'batch002_refined_texture',
        styleRegister: 'refined',
        sceneType: 'texture',
        propCategory: 'neutral-generic',
        imagerySubjects: ['materials-texture'],
      }),
    ],
  }

  it('flags same style×scene×prop with shared imagery subjects', () => {
    const candidate = {
      styleRegister: 'warm' as const,
      sceneType: 'texture' as const,
      propCategory: 'food-beverage' as const,
      imagerySubjects: ['materials-texture'] as const,
    }

    expect(compositionTagsOverlap(candidate, metadata.assets[0]!)).toBe(true)
    expect(findCompositionOverlaps(metadata, candidate).map((row) => row.imageId)).toEqual([
      'batch001_beans_texture',
      'batch009_warm_texture_bread',
    ])
  })

  it('does not flag when prop category differs', () => {
    const candidate = {
      styleRegister: 'warm' as const,
      sceneType: 'texture' as const,
      propCategory: 'neutral-generic' as const,
      imagerySubjects: ['materials-texture'] as const,
    }

    expect(findCompositionOverlaps(metadata, candidate)).toEqual([])
  })

  it('does not flag when imagery subjects do not intersect', () => {
    const candidate = {
      styleRegister: 'warm' as const,
      sceneType: 'texture' as const,
      propCategory: 'food-beverage' as const,
      imagerySubjects: ['nature-outdoors'] as const,
    }

    expect(findCompositionOverlaps(metadata, candidate)).toEqual([])
  })

  it('formats a curator-facing warning', () => {
    const candidate = {
      styleRegister: 'warm' as const,
      sceneType: 'texture' as const,
      propCategory: 'food-beverage' as const,
      imagerySubjects: ['materials-texture', 'food-dining'] as const,
    }
    const matches = findCompositionOverlaps(metadata, candidate)
    const warning = formatCompositionOverlapWarning(candidate, matches)

    expect(warning).toContain('batch001_beans_texture')
    expect(warning).toContain('warm×texture')
  })
})
