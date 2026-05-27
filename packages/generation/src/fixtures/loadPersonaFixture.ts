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
  /** Purpose-built folio 05 QA fixture: website + Facebook → `mobile_desktop_row` (desktop-wide + mobile-tall). */
  'cta-mixed': join(__dirname, 'personas', 'cta-mixed.json'),
  /** Core-only fields — no Pro depth inputs. Use for auditing the real Core floor. */
  'lean-core': join(__dirname, 'personas', 'lean-core.json'),
  /**
   * `PC-*` canonical path-class fixtures per `OUTPUT_TRANSLATION_SPEC.md` §3.3.
   * Used by the Pro-0 CTA bank acceptance test (see `docs/research/CTA_BANK_AUDIT.md` §4D).
   * `default` covers `PC-01`; `coffee-founder` covers `PC-02`; the six below cover the rest.
   */
  'pc03-local-team-no-directory': join(__dirname, 'personas', 'pc03-local-team-no-directory.json'),
  'pc04-local-team-with-directory': join(__dirname, 'personas', 'pc04-local-team-with-directory.json'),
  'pc05-regulated-legal': join(__dirname, 'personas', 'pc05-regulated-legal.json'),
  'pc06-mixed-commerce-service': join(__dirname, 'personas', 'pc06-mixed-commerce-service.json'),
  'pc07b-trades-travel': join(__dirname, 'personas', 'pc07b-trades-travel.json'),
  'pc08-social-product-promotion': join(__dirname, 'personas', 'pc08-social-product-promotion.json'),
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
