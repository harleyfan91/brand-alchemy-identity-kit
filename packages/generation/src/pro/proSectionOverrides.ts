import type { ExistingBrandEntryModel } from '../deterministic/existingBrandEntryScaffolds.js'

/** Optional Pro AI prose injected into deterministic PDF assembly (Pro-A v1). */
export type ProSectionOverrides = {
  /** Replaces Brand Brief → Ideal customer body when set. */
  briefIdealCustomerBody?: string
  /** Pro Brief → starting-assets sections (after kit REF, before Brand anchor). */
  existingBrandEntry?: ExistingBrandEntryModel | null
}

export type ProEnhancementMeta = {
  idealCustomer?: 'ai' | 'scaffold' | 'deterministic' | 'skipped'
}
