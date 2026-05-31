import type { IdentityKitForm } from '@identity-kit/shared'
import {
  defaultPhotoColorRelationship,
  inferKitHueSignals,
} from '@identity-kit/shared'

import { normalizePromptText } from '../sanitizers.js'

function block(title: string, lines: string[]): string {
  const body = lines.filter(Boolean).join('\n')
  return body ? `## ${title}\n${body}` : ''
}

/**
 * Renders intake into playbook context blocks for the variable user-message suffix.
 * @see docs/research/AI_INTEGRATION_PLAYBOOK.md §12.8
 * @see docs/audits/INTAKE_CONTRACT.md
 */
export function buildPromptContext(form: IdentityKitForm): {
  businessContext: string
  audienceContext: string
  voiceContext: string
  valuesContext: string
  visualPositioningContext: string
} {
  const s1 = form.step1
  const s2 = form.step2
  const s3 = form.step3
  const s4 = form.step4
  const s5 = form.step5
  const s6 = form.step6
  const s7 = form.step7

  const businessContext = block('Business', [
    `businessName: ${s1.businessName}`,
    s1.businessWebsite?.trim() ? `businessWebsite: ${s1.businessWebsite.trim()}` : '',
    s1.businessDescription?.trim()
      ? `businessDescription: ${normalizePromptText(s1.businessDescription)}`
      : '',
    `industry: ${s1.industry}`,
    `stage: ${s1.stage}`,
    `brandNarrator: ${s1.brandNarrator}`,
    `businessOperatingModel: ${s1.businessOperatingModel}`,
    `touchpoints: ${(s1.touchpoints ?? []).join(', ')}`,
    `primaryGoal: ${s1.primaryGoal}`,
    `guideFocus: ${s1.guideFocus}`,
    `offer: ${JSON.stringify(s1.offer)}`,
    `transformation: ${JSON.stringify(s1.transformation)}`,
  ])

  const audienceContext = block('Audience', [
    `customerArchetype: ${s2.customerArchetype}`,
    s2.painPoints?.trim() ? `painPoints: ${normalizePromptText(s2.painPoints)}` : '',
    s2.desiredOutcomes?.trim()
      ? `desiredOutcomes: ${normalizePromptText(s2.desiredOutcomes)}`
      : '',
  ])

  const voiceLines = [
    `tonePreset: ${s3.tonePreset}`,
    `voiceSliders: ${JSON.stringify(s3.voiceSliders)}`,
    s3.customVoiceNotes?.trim()
      ? `customVoiceNotes: ${normalizePromptText(s3.customVoiceNotes)}`
      : '',
  ]
  if (s3.voiceSamples?.length) {
    s3.voiceSamples
      .filter((s) => s.trim())
      .forEach((sample, i) => {
        voiceLines.push(`voiceSamples[${i}]: ${normalizePromptText(sample)}`)
      })
  }
  const voiceContext = block('Voice', voiceLines)

  const valuesContext = block('Values & origin', [
    `values: ${s4.values.join(', ')}`,
    s4.missionStatement?.trim()
      ? `missionStatement: ${normalizePromptText(s4.missionStatement)}`
      : '',
    `originArchetype: ${s5.originArchetype}`,
    s5.originSummary?.trim() ? `originSummary: ${normalizePromptText(s5.originSummary)}` : '',
  ])

  const visualLines = [
    `selectedPalette: ${s6.selectedPalette}`,
    `selectedStyle: ${s6.selectedStyle}`,
    s6.existingTypeface?.trim()
      ? `existingTypeface: ${normalizePromptText(s6.existingTypeface)}`
      : '',
    (s6.moodAdjectives?.length ?? 0) > 0
      ? `moodAdjectives: ${(s6.moodAdjectives ?? []).join(', ')}`
      : '',
    s6.photoColorRelationship
      ? `photoColorRelationship: ${s6.photoColorRelationship}`
      : '',
    s6.visualNotes?.trim() ? `visualNotes: ${normalizePromptText(s6.visualNotes)}` : '',
    s7.competitors.length > 0 ? `competitors: ${s7.competitors.join('; ')}` : '',
    s7.differentiation?.trim()
      ? `differentiation: ${normalizePromptText(s7.differentiation)}`
      : '',
  ]
  if (s6.hasExistingBrand && s6.existingBrand) {
    const eb = s6.existingBrand
    if (eb.hexColors?.length) visualLines.push(`existingBrand.hexColors: ${eb.hexColors.join(', ')}`)
  }
  const photoColorRelationship =
    s6.photoColorRelationship ?? defaultPhotoColorRelationship(s6.selectedStyle)
  const hueSignals = inferKitHueSignals(form, photoColorRelationship)
  if (hueSignals.preferredHueFamilies.length > 0) {
    visualLines.push(`preferredHueFamilies: ${hueSignals.preferredHueFamilies.join(', ')}`)
  }
  if (hueSignals.avoidHueFamilies.length > 0) {
    visualLines.push(`avoidHueFamilies: ${hueSignals.avoidHueFamilies.join(', ')}`)
  }
  const visualPositioningContext = block('Visual & positioning', visualLines)

  return {
    businessContext,
    audienceContext,
    voiceContext,
    valuesContext,
    visualPositioningContext,
  }
}
