import type { IdentityKitForm } from '@identity-kit/shared'

/** Matches DELIVERABLE_PRODUCTION_SPEC.md §7 gating for `08-brand-audit.pdf`. */
export function shouldIncludeBrandAudit(form: IdentityKitForm): boolean {
  if (!form.step6.hasExistingBrand) return false
  const existing = form.step6.existingBrand
  if (existing?.logoRef?.trim()) return true
  if (existing?.referenceImageRef?.trim()) return true
  if (existing?.hexColors?.some((h) => h.trim().length > 0)) return true
  if (form.step1.businessWebsite?.trim()) return true
  return false
}
