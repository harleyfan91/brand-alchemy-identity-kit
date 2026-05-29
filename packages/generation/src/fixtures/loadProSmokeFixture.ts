import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { IdentityKitForm } from '@identity-kit/shared'

const __dirname = dirname(fileURLToPath(import.meta.url))

const PRO_SMOKE_DIR = join(__dirname, 'pro-smoke')

export type ProSmokeFixtureId = 'text' | 'vision'

const FIXTURE_PATHS: Record<ProSmokeFixtureId, string> = {
  text: join(PRO_SMOKE_DIR, 'text.json'),
  vision: join(PRO_SMOKE_DIR, 'vision.json'),
}

export const PRO_SMOKE_FIXTURE_IDS = Object.keys(FIXTURE_PATHS) as ProSmokeFixtureId[]

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

type AssetsFile = {
  logoFile: string
  logoMediaType: ImageMediaType
  referenceFile: string
  referenceMediaType: ImageMediaType
  attribution?: Record<string, string>
  sourceUrls?: Record<string, string>
}

export type ProSmokeImagePayload = {
  logo: { mediaType: ImageMediaType; dataBase64: string }
  reference: { mediaType: ImageMediaType; dataBase64: string }
}

/**
 * Lean Pro fixtures for live Anthropic smoke tests (`npm run test:pro-smoke`)
 * and Pro PDF preview (`npm run generate:pro-pdfs -- text|vision`).
 * Not used by Core PDF generation or `npm run test:generation`.
 */
export function loadProSmokeFixture(id: ProSmokeFixtureId): IdentityKitForm {
  const path = FIXTURE_PATHS[id]
  const raw = readFileSync(path, 'utf8')
  return JSON.parse(raw) as IdentityKitForm
}

function readImageBase64(relativePath: string): string {
  return readFileSync(join(PRO_SMOKE_DIR, relativePath)).toString('base64')
}

/** Local smoke-test images from `fixtures/pro-smoke/images/` (base64 for API calls). */
export function loadProSmokeImagePayload(): ProSmokeImagePayload {
  const raw = readFileSync(join(PRO_SMOKE_DIR, 'assets.json'), 'utf8')
  const assets = JSON.parse(raw) as AssetsFile
  return {
    logo: {
      mediaType: assets.logoMediaType,
      dataBase64: readImageBase64(assets.logoFile),
    },
    reference: {
      mediaType: assets.referenceMediaType,
      dataBase64: readImageBase64(assets.referenceFile),
    },
  }
}
