import { useMemo, useState } from 'react'

import {
  getFirstMicroStepForChapter,
  getMicroStepsForTier,
  type MicroStep,
} from '../data/microStepSchema'
import { normalizeTouchpoints } from '../types'
import type { IdentityKitForm, Screen, StepErrors, StepIndex, Tier } from '../types'
import { getMicroStepValidationErrors, isMicroStepValid } from '../validation/microStepValidation'

const now = () => new Date().toISOString()

function normalizeFormTouchpoints(form: IdentityKitForm): IdentityKitForm {
  const normalized = normalizeTouchpoints((form.step1.touchpoints as unknown as string[] | undefined) ?? [])
  if (
    normalized.length === form.step1.touchpoints.length &&
    normalized.every((value, index) => value === form.step1.touchpoints[index])
  ) {
    return form
  }
  return {
    ...form,
    step1: {
      ...form.step1,
      touchpoints: normalized,
    },
  }
}

const createInitialForm = (): IdentityKitForm => ({
  tier: 'pro',
  sessionId: `sess_${crypto.randomUUID()}`,
  orderId: null,
  paymentStatus: 'pending',
  fulfillmentStatus: 'not_started',
  step1: {
    businessName: '',
    offer: {
      offerId: '',
      offerOther: '',
      audienceId: '',
      audienceOther: '',
      deliveryId: '',
      deliveryOther: '',
    },
    transformation: {
      beforeId: '',
      beforeOther: '',
      afterId: '',
      afterOther: '',
      mechanismId: '',
      mechanismOther: '',
    },
    industry: '',
    stage: '',
    brandNarrator: '',
    touchpoints: [],
  },
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
    existingTypeface: '',
    colorMoodNotes: '',
    styleNotes: '',
    referenceUploadName: '',
  },
  step7: { competitors: [], differentiation: '' },
  createdAt: now(),
  updatedAt: now(),
})

function toStepIndex(chapterIndex: number): StepIndex {
  return Math.min(7, Math.max(1, chapterIndex)) as StepIndex
}

function firstIntakeMicroStep(tier: Tier | null): MicroStep | undefined {
  return getMicroStepsForTier(tier).find((step) => step.chapterIndex > 0)
}

export function useFlowState() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [chapterIndex, setChapterIndex] = useState<number>(1)
  const [microStepIndex, setMicroStepIndex] = useState<number>(1)
  const [editingStep, setEditingStep] = useState<StepIndex | null>(null)
  const [form, setForm] = useState<IdentityKitForm>(createInitialForm)
  const [errors, setErrors] = useState<StepErrors>({})

  const tierMicroSteps = useMemo(
    () => getMicroStepsForTier(form.tier).filter((step) => step.chapterIndex > 0),
    [form.tier],
  )

  const activeMicroStep = useMemo(
    () =>
      tierMicroSteps.find(
        (step) => step.chapterIndex === chapterIndex && step.microStepIndex === microStepIndex,
      ) ?? tierMicroSteps[0],
    [chapterIndex, microStepIndex, tierMicroSteps],
  )

  const activeChapterSteps = useMemo(
    () => tierMicroSteps.filter((step) => step.chapterIndex === activeMicroStep?.chapterIndex),
    [activeMicroStep?.chapterIndex, tierMicroSteps],
  )

  const currentMicroStepPosition = useMemo(
    () => tierMicroSteps.findIndex((step) => step.id === activeMicroStep?.id) + 1,
    [activeMicroStep?.id, tierMicroSteps],
  )

  const canContinueCurrentStep = useMemo(
    () => isMicroStepValid(form, activeMicroStep),
    [activeMicroStep, form],
  )

  const activeStep = useMemo(
    () => ({
      id: toStepIndex(activeMicroStep?.chapterIndex ?? chapterIndex),
      key: `step${toStepIndex(activeMicroStep?.chapterIndex ?? chapterIndex)}` as const,
      title: activeMicroStep?.chapterLabel ?? '',
      prompt: '',
    }),
    [activeMicroStep?.chapterIndex, activeMicroStep?.chapterLabel, chapterIndex],
  )

  const setTier = (tier: Tier) => {
    setForm((prev) => ({ ...prev, tier, updatedAt: now() }))
    if (screen === 'step') {
      const first = firstIntakeMicroStep(tier)
      if (first) {
        setChapterIndex(first.chapterIndex)
        setMicroStepIndex(first.microStepIndex)
      }
    }
  }

  const updateForm = (updater: (current: IdentityKitForm) => IdentityKitForm) => {
    setForm((prev) => {
      const next = { ...normalizeFormTouchpoints(updater(prev)), updatedAt: now() }
      queueMicrotask(() => setErrors({}))
      return next
    })
  }

  const startFlow = () => {
    if (!form.tier) return
    const first = firstIntakeMicroStep(form.tier)
    if (!first) return
    setScreen('step')
    setChapterIndex(first.chapterIndex)
    setMicroStepIndex(first.microStepIndex)
    setErrors({})
  }

  const continueStep = () => {
    if (!activeMicroStep) return
    const nextErrors = getMicroStepValidationErrors(form, activeMicroStep)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setErrors({})

    const currentIndex = tierMicroSteps.findIndex((step) => step.id === activeMicroStep.id)
    const nextStep = tierMicroSteps[currentIndex + 1]

    if (editingStep) {
      if (nextStep && nextStep.chapterIndex === activeMicroStep.chapterIndex) {
        setChapterIndex(nextStep.chapterIndex)
        setMicroStepIndex(nextStep.microStepIndex)
      } else {
        setEditingStep(null)
        setScreen('review')
      }
      return
    }

    if (nextStep) {
      setChapterIndex(nextStep.chapterIndex)
      setMicroStepIndex(nextStep.microStepIndex)
      return
    }

    setScreen('review')
  }

  const backStep = () => {
    if (!activeMicroStep) return
    const currentIndex = tierMicroSteps.findIndex((step) => step.id === activeMicroStep.id)
    const previousStep = currentIndex > 0 ? tierMicroSteps[currentIndex - 1] : undefined

    if (editingStep) {
      if (previousStep && previousStep.chapterIndex === activeMicroStep.chapterIndex) {
        setChapterIndex(previousStep.chapterIndex)
        setMicroStepIndex(previousStep.microStepIndex)
      } else {
        setEditingStep(null)
        setScreen('review')
      }
      return
    }

    if (previousStep) {
      setChapterIndex(previousStep.chapterIndex)
      setMicroStepIndex(previousStep.microStepIndex)
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
    const firstForChapter = getFirstMicroStepForChapter(index, form.tier)
    if (!firstForChapter) return
    setEditingStep(index)
    setChapterIndex(firstForChapter.chapterIndex)
    setMicroStepIndex(firstForChapter.microStepIndex)
    setErrors({})
    setScreen('step')
  }

  return {
    screen,
    stepIndex: toStepIndex(activeMicroStep?.chapterIndex ?? chapterIndex),
    chapterIndex: activeMicroStep?.chapterIndex ?? chapterIndex,
    microStepIndex: activeMicroStep?.microStepIndex ?? microStepIndex,
    activeMicroStep,
    activeChapterSteps,
    currentMicroStepPosition,
    totalMicroSteps: tierMicroSteps.length,
    activeStep,
    form,
    errors,
    canContinueCurrentStep,
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
