import type { IdentityKitForm } from '@identity-kit/shared'

import { hasAnthropicApiKey } from '../ai/resolveAnthropicApiKey.js'
import { rewriteBriefIdealCustomer } from '../ai/sections/briefIdealCustomer.js'
import type { ProEnhancementMeta, ProSectionOverrides } from './proSectionOverrides.js'

export type BuildProEnhancementsOptions = {
  kitOrderId: string
  /** Skip Anthropic; Brief uses deterministic depth copy only. */
  dryRun?: boolean
}

export type ProEnhancementsResult = {
  overrides: ProSectionOverrides
  meta: ProEnhancementMeta
}

/**
 * Pro-A v1: one live AI section (`brief.idealCustomer`) for PDF preview.
 * Full kit fulfillment will expand this to all `ai_enhanced` + `ai_only` sections.
 */
export async function buildProEnhancements(
  form: IdentityKitForm,
  opts: BuildProEnhancementsOptions,
): Promise<ProEnhancementsResult> {
  if (opts.dryRun) {
    return { overrides: {}, meta: { idealCustomer: 'skipped' } }
  }

  if (!hasAnthropicApiKey()) {
    console.warn(
      '[pro] No Anthropic API key — Brief Ideal customer stays deterministic. Set ANTHROPIC_API_KEY or ANTHROPIC_API_KEY_2 in .env.',
    )
    return { overrides: {}, meta: { idealCustomer: 'deterministic' } }
  }

  const result = await rewriteBriefIdealCustomer(form, opts.kitOrderId)
  return {
    overrides: { briefIdealCustomerBody: result.pdfBody },
    meta: { idealCustomer: result.source === 'ai' ? 'ai' : 'scaffold' },
  }
}
