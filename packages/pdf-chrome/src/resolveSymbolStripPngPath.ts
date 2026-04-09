import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/**
 * Absolute path to `alchemy-symbol-strip.png` from `@identity-kit/brand-assets`, or `null` if the package
 * is not installed / export missing. Consumers must add `@identity-kit/brand-assets` as a dependency.
 */
export function resolveBrandSymbolStripPngPath(): string | null {
  try {
    return require.resolve('@identity-kit/brand-assets/alchemy-symbol-strip.png')
  } catch {
    return null
  }
}
