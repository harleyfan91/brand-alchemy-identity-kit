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
  step1: { businessName: '', offer: '', targetCustomer: '', stage: '' },
  step2: { audienceDescription: '', painPoints: '', desiredOutcomes: '' },
  step3: { personalityAdjectives: [], tone: '' },
  step4: { values: [], missionStatement: '' },
  step5: { originSummary: '', motivation: '' },
  step6: { colorMoodNotes: '', styleNotes: '', referenceUploadName: '' },
  step7: { industry: '', competitors: '', differentiation: '' },
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
      nextErrors['step1.targetCustomer'] = required(form.step1.targetCustomer)
      nextErrors['step1.stage'] = required(form.step1.stage)
    }
    if (index === 2) {
      nextErrors['step2.audienceDescription'] = required(form.step2.audienceDescription)
      nextErrors['step2.painPoints'] = required(form.step2.painPoints)
      nextErrors['step2.desiredOutcomes'] = required(form.step2.desiredOutcomes)
    }
    if (index === 3) {
      nextErrors['step3.personalityAdjectives'] =
        form.step3.personalityAdjectives.length > 0 ? '' : 'Select at least one adjective.'
      nextErrors['step3.tone'] = required(form.step3.tone)
    }
    if (index === 4) {
      nextErrors['step4.values'] = form.step4.values.length > 0 ? '' : 'Select at least one value.'
      nextErrors['step4.missionStatement'] = required(form.step4.missionStatement)
    }
    if (index === 5) {
      nextErrors['step5.originSummary'] = required(form.step5.originSummary)
      nextErrors['step5.motivation'] = required(form.step5.motivation)
    }
    if (index === 6) {
      nextErrors['step6.colorMoodNotes'] = required(form.step6.colorMoodNotes)
      nextErrors['step6.styleNotes'] = required(form.step6.styleNotes)
    }
    if (index === 7) {
      nextErrors['step7.industry'] = required(form.step7.industry)
      nextErrors['step7.competitors'] = required(form.step7.competitors)
      nextErrors['step7.differentiation'] = required(form.step7.differentiation)
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
