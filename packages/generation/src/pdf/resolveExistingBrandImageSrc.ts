import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PRO_SMOKE_DIR = join(dirname(fileURLToPath(import.meta.url)), '../fixtures/pro-smoke')

/** Pro-smoke fixture logical refs → local JPEGs under `fixtures/pro-smoke/images/`. */
const PRO_SMOKE_IMAGE_BY_REF_KEY: Record<string, string> = {
  'pro-smoke/fixtures/northwind-logo': join(PRO_SMOKE_DIR, 'images/logo.jpg'),
  'pro-smoke/fixtures/northwind-reference': join(PRO_SMOKE_DIR, 'images/reference.jpg'),
}

/**
 * Absolute filesystem path for react-pdf `<Image src>` when the upload is available locally.
 * Production `pro-uploads/...` paths resolve only when `PRO_UPLOADS_LOCAL_ROOT` is set (QA).
 */
export function resolveExistingBrandImageSrc(ref: string | undefined | null): string | undefined {
  const trimmed = ref?.trim()
  if (!trimmed || trimmed.startsWith('pending:')) return undefined

  const smokePath = PRO_SMOKE_IMAGE_BY_REF_KEY[trimmed]
  if (smokePath && existsSync(smokePath)) return smokePath

  if (trimmed.startsWith('pro-uploads/')) {
    const root = process.env.PRO_UPLOADS_LOCAL_ROOT?.trim()
    if (!root) return undefined
    const relative = trimmed.replace(/^pro-uploads\//, '')
    const absolute = join(root, relative)
    return existsSync(absolute) ? absolute : undefined
  }

  if (trimmed.startsWith('/') && existsSync(trimmed)) return trimmed

  return undefined
}
