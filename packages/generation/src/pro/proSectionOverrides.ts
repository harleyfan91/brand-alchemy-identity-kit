/** Optional Pro AI prose injected into deterministic PDF assembly (Pro-A v1). */
export type ProSectionOverrides = {
  /** Replaces Brand Brief → Ideal customer body when set. */
  briefIdealCustomerBody?: string
}

export type ProEnhancementMeta = {
  idealCustomer?: 'ai' | 'scaffold' | 'deterministic' | 'skipped'
}
