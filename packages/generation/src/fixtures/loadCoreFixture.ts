import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { IdentityKitForm } from '@identity-kit/shared'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function loadCoreSampleFixture(): IdentityKitForm {
  const raw = readFileSync(join(__dirname, 'core-sample.json'), 'utf8')
  return JSON.parse(raw) as IdentityKitForm
}
