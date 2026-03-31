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
  const tierLabel = useMemo(() => (form.tier === 'pro' ? 'Pro Kit' : 'Standard Kit'), [form.tier])

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 sm:px-6">
      <section className="mx-auto w-full max-w-xl space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <header>
          <p className="text-sm font-medium text-zinc-500">{tierLabel}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Make final edits to your Identity Kit
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            These fields are the final source of truth for PDF generation and email delivery.
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
