import type { IdentityKitForm } from '@identity-kit/shared'

export function assertProTier(form: IdentityKitForm): void {
  if (form.tier !== 'pro') {
    throw new Error(`Pro PDF pipeline expected tier "pro", got ${String(form.tier)}`)
  }
}
