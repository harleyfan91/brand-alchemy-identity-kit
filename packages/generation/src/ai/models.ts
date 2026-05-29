/** Logical model keys — map to Anthropic API model IDs via env overrides. */
export type SectionModel = 'claude-sonnet-4-5' | 'claude-opus-4-5' | 'claude-haiku-4-5'

const MODEL_ID: Record<SectionModel, string> = {
  'claude-sonnet-4-5':
    process.env.ANTHROPIC_MODEL_SONNET?.trim() || 'claude-sonnet-4-5',
  'claude-opus-4-5': process.env.ANTHROPIC_MODEL_OPUS?.trim() || 'claude-opus-4-5',
  'claude-haiku-4-5':
    process.env.ANTHROPIC_MODEL_HAIKU?.trim() || 'claude-haiku-4-5-20251001',
}

export function resolveModelId(model: SectionModel): string {
  return MODEL_ID[model]
}
