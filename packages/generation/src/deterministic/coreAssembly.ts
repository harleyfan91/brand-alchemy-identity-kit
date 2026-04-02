import type { IdentityKitForm } from '@identity-kit/shared'

/** Deterministic Core Kit copy — template assembly only (no AI). */
export function assertCoreTier(form: IdentityKitForm): void {
  if (form.tier !== 'core') {
    throw new Error(`Core PDF pipeline expected tier "core", got ${String(form.tier)}`)
  }
}

export function brandBriefBlocks(form: IdentityKitForm): { heading: string; body: string }[] {
  const { step1, step2, step4, step5, step7 } = form
  return [
    { heading: 'Brand overview', body: `${step1.businessName} — ${step1.offer} (${step1.industry}, ${step1.stage}).` },
    { heading: 'Ideal customer', body: step2.customerArchetype },
    { heading: 'Core transformation', body: step1.transformation },
    { heading: 'Values', body: step4.values.join(', ') },
    { heading: 'Brand story angle', body: `${step5.originArchetype}${step5.originSummary ? `. ${step5.originSummary}` : ''}` },
    {
      heading: 'Differentiation',
      body:
        step7.competitors.length > 0
          ? `Compared with ${step7.competitors.join(', ')}.`
          : 'Competitive set not specified on intake.',
    },
  ]
}

export function styleGuideBlocks(form: IdentityKitForm): { heading: string; body: string }[] {
  const { step6 } = form
  return [
    { heading: 'Palette', body: `Selected palette: ${step6.selectedPalette}` },
    { heading: 'Visual direction', body: `Style: ${step6.selectedStyle}` },
    { heading: 'Notes', body: [step6.colorMoodNotes, step6.styleNotes].filter(Boolean).join('\n\n') || '—' },
  ]
}

export function voicePlaybookBlocks(form: IdentityKitForm): { heading: string; body: string }[] {
  const { step3 } = form
  return [
    { heading: 'Tone preset', body: step3.tonePreset || '—' },
    {
      heading: 'Voice axes (snapshot)',
      body: `Formality ${step3.voiceSliders.formality}, energy ${step3.voiceSliders.energy}, directness ${step3.voiceSliders.directness}, warmth ${step3.voiceSliders.warmth}, playfulness ${step3.voiceSliders.playfulness}`,
    },
    { heading: 'Custom notes', body: step3.customVoiceNotes?.trim() || '—' },
  ]
}

export function quickStartBlocks(form: IdentityKitForm): { heading: string; body: string }[] {
  return [
    { heading: 'Week 1', body: `Anchor messaging around: ${form.step1.transformation}` },
    { heading: 'Week 2', body: `Align touchpoints with tone: ${form.step3.tonePreset || 'your voice profile'}` },
    { heading: 'Week 3', body: `Apply palette ${form.step6.selectedPalette} and style ${form.step6.selectedStyle} consistently.` },
    { heading: 'Week 4', body: 'Review competitor set and tighten differentiation language.' },
  ]
}
