import { migrateIdentityKitForm, type IdentityKitForm } from '@identity-kit/shared'

import type { VisualReferencePhotoCount } from '../deterministic/styleGuideVisualReferenceScaffolds.js'
import type { StyleGuideVisualReferenceModel } from '../deterministic/styleGuideVisualReferenceScaffolds.js'
import { resolveStyleGuideVisualReferenceModel } from '../image-bank/resolveStyleGuideVisualReferenceModel.js'
import { buildStyleGuideVisualReferenceModel } from '../deterministic/styleGuideVisualReferenceScaffolds.js'

export type StyleGuideRenderOptions = {
  /** QA override — placeholder scaffold at a fixed layout tier (skips bank fulfillment). */
  visualReferencePhotoCount?: VisualReferencePhotoCount
  /** Pre-built model (tests). When set, skips resolution. Pass null to omit the spread. */
  visualReferenceModel?: StyleGuideVisualReferenceModel | null
  /** Force placeholder scaffold (legacy QA). */
  useVisualReferenceScaffold?: boolean
}

/** Resolve Pro visual reference model for Style Guide rendering. */
export async function resolveStyleGuideVisualReferenceForRender(
  form: IdentityKitForm,
  options?: StyleGuideRenderOptions,
): Promise<StyleGuideVisualReferenceModel | null | undefined> {
  const migrated = migrateIdentityKitForm(form)
  if (migrated.tier !== 'pro') return undefined

  if (options?.visualReferenceModel !== undefined) {
    return options.visualReferenceModel
  }

  if (options?.visualReferencePhotoCount !== undefined) {
    return buildStyleGuideVisualReferenceModel(migrated, {
      photoCount: options.visualReferencePhotoCount,
    })
  }

  if (options?.useVisualReferenceScaffold === true) {
    return buildStyleGuideVisualReferenceModel(migrated)
  }

  return resolveStyleGuideVisualReferenceModel(migrated)
}
