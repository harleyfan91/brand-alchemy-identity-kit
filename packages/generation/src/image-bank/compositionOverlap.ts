import type { ImageBankAsset, ImageBankIngestInput } from './types.js'
import type { ImageBankMetadataFile } from './types.js'

export type CompositionTagSlice = Pick<
  ImageBankIngestInput,
  'styleRegister' | 'sceneType' | 'propCategory' | 'imagerySubjects'
>

function propCategoryKey(propCategory: CompositionTagSlice['propCategory']): string {
  return propCategory ?? '__unspecified__'
}

function sharedImagerySubjects(
  a: CompositionTagSlice['imagerySubjects'],
  b: CompositionTagSlice['imagerySubjects'],
): string[] {
  const left = a ?? []
  const right = b ?? []
  if (left.length === 0 || right.length === 0) return []
  const rightSet = new Set(right)
  return left.filter((subject) => rightSet.has(subject))
}

/**
 * True when a candidate would sit in the same compositional bucket as an existing asset:
 * style register × scene type × prop category, with overlapping imagery subjects.
 */
export function compositionTagsOverlap(
  candidate: CompositionTagSlice,
  existing: Pick<ImageBankAsset, 'styleRegister' | 'sceneType' | 'propCategory' | 'imagerySubjects'>,
): boolean {
  if (candidate.styleRegister !== existing.styleRegister) return false
  if (candidate.sceneType !== existing.sceneType) return false
  if (propCategoryKey(candidate.propCategory) !== propCategoryKey(existing.propCategory)) return false
  return sharedImagerySubjects(candidate.imagerySubjects, existing.imagerySubjects).length > 0
}

export function findCompositionOverlaps(
  metadata: ImageBankMetadataFile,
  candidate: CompositionTagSlice,
  options: { excludeImageId?: string } = {},
): ImageBankAsset[] {
  return metadata.assets.filter((asset) => {
    if (options.excludeImageId && asset.imageId === options.excludeImageId) return false
    return compositionTagsOverlap(candidate, asset)
  })
}

export function formatCompositionOverlapWarning(
  candidate: CompositionTagSlice,
  matches: ImageBankAsset[],
): string | undefined {
  if (matches.length === 0) return undefined
  const ids = matches.map((asset) => asset.imageId).join(', ')
  const subjects = sharedImagerySubjects(candidate.imagerySubjects, matches[0]?.imagerySubjects).join(', ')
  return (
    `Composition overlap: ${candidate.styleRegister}×${candidate.sceneType} + ` +
    `${candidate.propCategory ?? 'unspecified prop'} + [${subjects || 'shared subjects'}] ` +
    `already in bank (${ids}) — confirm composition is distinct before ingest`
  )
}
