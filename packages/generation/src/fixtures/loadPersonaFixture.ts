import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { IdentityKitForm } from '@identity-kit/shared'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Maps CLI id → JSON file under `fixtures/personas/`. `default` uses legacy `core-sample.json`. */
export const PERSONA_FIXTURE_FILES: Record<string, string> = {
  default: join(__dirname, 'core-sample.json'),
  'coffee-founder': join(__dirname, 'personas', 'coffee-founder.json'),
  'established-pro': join(__dirname, 'personas', 'established-pro.json'),
  'community-org': join(__dirname, 'personas', 'community-org.json'),
}

export const PERSONA_IDS = Object.keys(PERSONA_FIXTURE_FILES).sort()

/**
 * Load a named persona fixture for local PDF preview / QA.
 * Ids are kebab-case and listed in {@link PERSONA_IDS}.
 */
export function loadPersonaFixture(personaId: string): IdentityKitForm {
  const key = personaId.trim().toLowerCase()
  const path = PERSONA_FIXTURE_FILES[key]
  if (!path) {
    const allowed = PERSONA_IDS.join(', ')
    throw new Error(`Unknown persona "${personaId}". Use one of: ${allowed}`)
  }
  const raw = readFileSync(path, 'utf8')
  return JSON.parse(raw) as IdentityKitForm
}
