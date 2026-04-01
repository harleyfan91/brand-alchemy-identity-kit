import { useMemo, useState } from 'react'

import { stepMeta } from '../data/steps'
import type { IdentityKitForm, Screen, StepErrors, StepIndex, Tier } from '../types'

const now = () => new Date().toISOString()

const createInitialForm = (): IdentityKitForm => ({
  tier: null,
  sessionId: `sess_${crypto.randomUUID()}`,
  orderId: null,
  paymentStatus: 'pending',
  fulfillmentStatus: 'not_started',
  step1: { businessName: '', offer: '', industry: '', stage: '' },
  step2: { customerArchetype: '', painPoints: '', desiredOutcomes: '' },
  step3: {
    tonePreset: '',
    voiceSliders: { formality: 50, energy: 50, directness: 50, warmth: 50, playfulness: 50 },
    customVoiceNotes: '',
  },
  step4: { values: [], missionStatement: '' },
  step5: { originArchetype: '', originSummary: '', motivation: '' },
  step6: {
    selectedPalette: '',
    selectedStyle: '',
    colorMoodNotes: '',
    styleNotes: '',
    referenceUploadName: '',
  },
  step7: { competitors: [], differentiation: '' },
  createdAt: now(),
  updatedAt: now(),
})

const required = (value: string) => (value.trim() ? '' : 'This field is required.')

export function useFlowState() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [stepIndex, setStepIndex] = useState<StepIndex>(1)
  const [editingStep, setEditingStep] = useState<StepIndex | null>(null)
  const [form, setForm] = useState<IdentityKitForm>(createInitialForm)
  const [errors, setErrors] = useState<StepErrors>({})

  const activeStep = useMemo(() => stepMeta.find((step) => step.id === stepIndex) ?? stepMeta[0], [stepIndex])

  const setTier = (tier: Tier) => {
    setForm((prev) => ({ ...prev, tier, updatedAt: now() }))
  }

  const updateForm = (updater: (current: IdentityKitForm) => IdentityKitForm) => {
    setForm((prev) => ({ ...updater(prev), updatedAt: now() }))
  }

  const validateStep = (index: StepIndex): boolean => {
    const nextErrors: StepErrors = {}
    if (index === 1) {
      nextErrors['step1.businessName'] = required(form.step1.businessName)
      nextErrors['step1.offer'] = required(form.step1.offer)
      nextErrors['step1.industry'] = required(form.step1.industry)
      nextErrors['step1.stage'] = required(form.step1.stage)
    }
    if (index === 2) {
      nextErrors['step2.customerArchetype'] = required(form.step2.customerArchetype)
    }
    if (index === 4) {
      nextErrors['step4.values'] = form.step4.values.length >= 2 ? '' : 'Select at least two values.'
    }
    if (index === 5) {
      nextErrors['step5.originArchetype'] = required(form.step5.originArchetype)
    }
    if (index === 6) {
      nextErrors['step6.selectedPalette'] = required(form.step6.selectedPalette)
      nextErrors['step6.selectedStyle'] = required(form.step6.selectedStyle)
    }
    const filtered = Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => Boolean(value)),
    ) as StepErrors
    setErrors(filtered)
    return Object.keys(filtered).length === 0
  }

  const startFlow = () => {
    if (!form.tier) return
    setScreen('step')
    setStepIndex(1)
    setErrors({})
  }

  const continueStep = () => {
    if (!validateStep(stepIndex)) return
    if (editingStep) {
      setEditingStep(null)
      setScreen('review')
      return
    }
    if (stepIndex < 7) {
      setStepIndex((stepIndex + 1) as StepIndex)
      setErrors({})
      return
    }
    setScreen('review')
  }

  const backStep = () => {
    if (editingStep) {
      setEditingStep(null)
      setScreen('review')
      return
    }
    if (stepIndex > 1) {
      setStepIndex((stepIndex - 1) as StepIndex)
      setErrors({})
      return
    }
    setScreen('landing')
  }

  const goToReview = () => setScreen('review')
  const goToPayment = () => setScreen('payment')
  const goToProcessing = () => {
    setForm((prev) => ({ ...prev, fulfillmentStatus: 'in_progress', updatedAt: now() }))
    setScreen('processing')
  }
  const goToEdit = () => {
    setForm((prev) => ({ ...prev, paymentStatus: 'paid', fulfillmentStatus: 'complete', updatedAt: now() }))
    setScreen('edit')
  }
  const goToConfirm = () => setScreen('confirm')

  const editStep = (index: StepIndex) => {
    setEditingStep(index)
    setStepIndex(index)
    setErrors({})
    setScreen('step')
  }

  return {
    screen,
    stepIndex,
    activeStep,
    form,
    errors,
    setTier,
    updateForm,
    startFlow,
    continueStep,
    backStep,
    goToReview,
    goToPayment,
    goToProcessing,
    goToEdit,
    goToConfirm,
    editStep,
  }
}
