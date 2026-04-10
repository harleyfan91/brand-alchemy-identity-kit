/**
 * Re-exports buyer archetypes from shared so the wizard and PDF generation stay aligned.
 * Edit catalog copy in `packages/shared/src/buyerArchetypes.ts`.
 */
export type { BuyerArchetypeOption } from '@identity-kit/shared'
export { fallbackArchetypes, industryArchetypes } from '@identity-kit/shared'
