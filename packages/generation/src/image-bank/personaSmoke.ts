import {
  IMAGE_BANK_INDUSTRY_SUITABILITY,
  industrySuitabilityFromIndustryId,
  migrateIdentityKitForm,
  resolveImageBankKitSignals,
  type IdentityKitForm,
  type ImageBankIndustrySuitability,
} from '@identity-kit/shared'

import { loadPersonaFixture } from '../fixtures/loadPersonaFixture.js'
import { loadProSmokeFixture, type ProSmokeFixtureId } from '../fixtures/loadProSmokeFixture.js'
import { resolveStyleGuideVisualReferenceModel } from './resolveStyleGuideVisualReferenceModel.js'
import type { ImageBankAsset } from './types.js'
import {
  assignDeterministicRankerPicks,
  buildVisualReferenceShortlist,
  layoutIdFromShortlistLength,
} from './visualReferencePipeline.js'

/** Minimum tagged assets per industry before persona smoke gate passes. */
export const INDUSTRY_SMOKE_TARGET = 2

/** Persona fixtures for moodboard deterministic dry-run (no AI). */
export const MOODBOARD_PERSONA_SMOKE_FIXTURES: Array<{
  id: string
  label: string
  load: () => IdentityKitForm
}> = [
  { id: 'pro-smoke:text', label: 'Harbor Lane Studio (Pro text)', load: () => loadProSmokeFixture('text') },
  { id: 'pro-smoke:vision', label: 'Northwind Roasters (Pro vision)', load: () => loadProSmokeFixture('vision') },
  {
    id: 'coffee-founder',
    label: 'Harbor Row Coffee',
    load: () => asProSmokeTier(loadPersonaFixture('coffee-founder')),
  },
  {
    id: 'established-pro',
    label: 'Sterling Compliance Advisors',
    load: () => asProSmokeTier(loadPersonaFixture('established-pro')),
  },
  {
    id: 'pc05-regulated-legal',
    label: 'Regulated legal (PC-05)',
    load: () => asProSmokeTier(loadPersonaFixture('pc05-regulated-legal')),
  },
  {
    id: 'pc07b-trades-travel',
    label: 'Trades + travel (PC-07b)',
    load: () => asProSmokeTier(loadPersonaFixture('pc07b-trades-travel')),
  },
  {
    id: 'pc08-social-product',
    label: 'Social product promo (PC-08)',
    load: () => asProSmokeTier(loadPersonaFixture('pc08-social-product-promotion')),
  },
  {
    id: 'pc06-retail',
    label: 'Mixed commerce (PC-06)',
    load: () => asProSmokeTier(loadPersonaFixture('pc06-mixed-commerce-service')),
  },
]

export type IndustryCoverageRow = {
  tag: ImageBankIndustrySuitability
  count: number
  meetsTarget: boolean
}

export type PersonaSmokeRow = {
  fixtureId: string
  label: string
  industry: string
  industryTags: ImageBankIndustrySuitability[]
  industryPool: number
  shortlistLength: number
  layoutId: string | null
  photoPicks: number
  topPicks: string[]
  spreadReady: boolean
}

export type PersonaSmokeReport = {
  assetCount: number
  industryCoverage: IndustryCoverageRow[]
  industryGatePass: boolean
  personas: PersonaSmokeRow[]
  personaGatePass: boolean
}

function asProSmokeTier(form: IdentityKitForm): IdentityKitForm {
  return migrateIdentityKitForm({ ...form, tier: 'pro' })
}

export function countIndustryCoverage(assets: ImageBankAsset[]): IndustryCoverageRow[] {
  const counts = Object.fromEntries(
    IMAGE_BANK_INDUSTRY_SUITABILITY.map((tag) => [tag, 0]),
  ) as Record<ImageBankIndustrySuitability, number>

  for (const asset of assets) {
    for (const tag of asset.industrySuitability ?? []) {
      if (tag in counts) counts[tag] += 1
    }
  }

  return IMAGE_BANK_INDUSTRY_SUITABILITY.map((tag) => ({
    tag,
    count: counts[tag],
    meetsTarget: counts[tag] >= INDUSTRY_SMOKE_TARGET,
  }))
}

function industryPoolSize(assets: ImageBankAsset[], tags: ImageBankIndustrySuitability[]): number {
  if (tags.length === 0) {
    return assets.filter((asset) => !asset.industrySuitability?.length).length
  }
  return assets.filter(
    (asset) =>
      !asset.industrySuitability?.length ||
      tags.some((tag) => asset.industrySuitability!.includes(tag)),
  ).length
}

export async function runPersonaSmokeRow(
  assets: ImageBankAsset[],
  fixtureId: string,
  label: string,
  form: IdentityKitForm,
): Promise<PersonaSmokeRow> {
  const industryTags = industrySuitabilityFromIndustryId(form.step1.industry)
  const shortlist = buildVisualReferenceShortlist(assets, form)
  const layoutId = shortlist.length >= 6 ? layoutIdFromShortlistLength(shortlist.length) : null
  const picks = layoutId ? assignDeterministicRankerPicks(shortlist, layoutId) : []
  const photoPicks = picks.filter((pick) => pick.slotId !== 'logo').length
  const model = await resolveStyleGuideVisualReferenceModel(form, { assets })

  return {
    fixtureId,
    label,
    industry: form.step1.industry,
    industryTags,
    industryPool: industryPoolSize(assets, industryTags),
    shortlistLength: shortlist.length,
    layoutId,
    photoPicks,
    topPicks: shortlist.slice(0, 6).map(({ asset, score }) => `${asset.imageId}(${score.total})`),
    spreadReady: model !== null,
  }
}

export async function buildPersonaSmokeReport(assets: ImageBankAsset[]): Promise<PersonaSmokeReport> {
  const industryCoverage = countIndustryCoverage(assets)
  const industryGatePass = industryCoverage.every((row) => row.meetsTarget)

  const personas: PersonaSmokeRow[] = []
  for (const fixture of MOODBOARD_PERSONA_SMOKE_FIXTURES) {
    const form = migrateIdentityKitForm(fixture.load())
    personas.push(await runPersonaSmokeRow(assets, fixture.id, fixture.label, form))
  }

  const personaGatePass = personas.every((row) => row.spreadReady)

  return {
    assetCount: assets.length,
    industryCoverage,
    industryGatePass,
    personas,
    personaGatePass,
  }
}

/** Pro-smoke fixture ids only — for targeted tests. */
export const PRO_SMOKE_MOODBOARD_IDS: ProSmokeFixtureId[] = ['text', 'vision']

export function kitSignalsSummary(form: IdentityKitForm): string {
  const signals = resolveImageBankKitSignals(form)
  return [
    signals.styleRegisterPrimary,
    signals.styleRegisterSecondary.join('+') || '—',
    signals.paletteFamily ?? '—',
    signals.industrySuitability.join(',') || '—',
  ].join(' · ')
}
