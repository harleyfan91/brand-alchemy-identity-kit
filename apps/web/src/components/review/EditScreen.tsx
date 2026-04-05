import { useMemo } from 'react'

import type { IdentityKitForm } from '../../types'
import { Button } from '../ui/Button'
import { TextArea } from '../ui/TextArea'

interface EditScreenProps {
  form: IdentityKitForm
  onUpdate: (field: 'brandBrief' | 'styleGuide' | 'voicePlaybook' | 'quickStart', value: string) => void
  editableOutputs: {
    brandBrief: string
    styleGuide: string
    voicePlaybook: string
    quickStart: string
  }
  onSend: () => void
}

export function EditScreen({ form, onUpdate, editableOutputs, onSend }: EditScreenProps) {
  const tierLabel = useMemo(() => (form.tier === 'pro' ? 'Pro Kit' : 'Core Kit'), [form.tier])
  const tierEditMessage =
    form.tier === 'pro'
      ? 'These AI-personalized drafts are tuned to your intake profile and ready for final refinement.'
      : 'These guided template drafts are assembled from your intake responses and ready for final refinement.'

  return (
    <main className="min-h-screen bg-zinc-50 px-3 py-6 sm:px-6">
      <section className="mx-auto w-full max-w-xl space-y-4 rounded-3xl border border-zinc-200 bg-white px-4 py-6 sm:p-6 shadow-sm">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">{tierLabel}</p>
          <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
            Make final edits to your Identity Kit
          </h1>
          <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 sm:text-base">
            {tierEditMessage} These fields are the final source of truth for PDF generation and email delivery.
          </p>
        </header>

        <TextArea
          id="brandBrief"
          label="Brand Brief"
          rows={5}
          value={editableOutputs.brandBrief}
          onChange={(value) => onUpdate('brandBrief', value)}
        />
        <TextArea
          id="styleGuide"
          label="Brand Style Guide"
          rows={5}
          value={editableOutputs.styleGuide}
          onChange={(value) => onUpdate('styleGuide', value)}
        />
        <TextArea
          id="voicePlaybook"
          label="Voice and Content Playbook"
          rows={5}
          value={editableOutputs.voicePlaybook}
          onChange={(value) => onUpdate('voicePlaybook', value)}
        />
        <TextArea
          id="quickStart"
          label="30-Day Quick Start Checklist"
          rows={5}
          value={editableOutputs.quickStart}
          onChange={(value) => onUpdate('quickStart', value)}
        />

        {form.tier === 'pro' ? (
          <p className="rounded-xl border border-zinc-200 bg-zinc-100 p-3 text-xs text-zinc-600">
            Pro regenerate controls will be connected in Phase 2.
          </p>
        ) : null}

        <Button fullWidth onClick={onSend}>
          Send My Kit
        </Button>
      </section>
    </main>
  )
}
