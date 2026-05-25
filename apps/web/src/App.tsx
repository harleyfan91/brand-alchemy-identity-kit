import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import { BrandWordmark } from './components/branding/BrandWordmark'
import { ToneExampleStrip } from './components/branding/ToneExampleStrip'
import { PaymentPlaceholder } from './components/flow/PaymentPlaceholder'
import { ProcessingScreen } from './components/flow/ProcessingScreen'
import { StepShell } from './components/flow/StepShell'
import { TierSelector } from './components/flow/TierSelector'
import { EditScreen } from './components/review/EditScreen'
import { ReviewScreen } from './components/review/ReviewScreen'
import { ConfirmScreen } from './components/review/ConfirmScreen'
import { Step1Snapshot } from './components/steps/Step1Snapshot'
import type { ProgressiveFooterNavApi } from './components/steps/ProgressiveSentenceSections'
import { Step2Customer } from './components/steps/Step2Customer'
import { Step3Personality } from './components/steps/Step3Personality'
import { Step4Values } from './components/steps/Step4Values'
import { Step5Story } from './components/steps/Step5Story'
import { Step6Aesthetic } from './components/steps/Step6Aesthetic'
import { Step7Industry } from './components/steps/Step7Industry'
import { VisualDirectionPreview } from './components/ui/VisualDirectionPreview'
import { tierOptions } from './data/tiers'
import { useFlowState } from './hooks/useFlowState'
import { api, type GeneratedCoreFile } from './services/api'
import { normalizeTouchpoints } from './types'
import type {
  GuideFocus,
  MoodAdjective,
  PrimaryGoal,
  Step1Offer,
  Step1Transformation,
  TouchpointId,
  VoiceSliders,
} from './types'
import { applyStep1ScalarField } from './utils/step1FieldUpdate'
import { buildVoicePreview } from './utils/voicePreview'

const initialOutputs = {
  brandBrief: 'Brand brief draft generated from your intake answers.',
  styleGuide: 'Style guide draft with colors, typography direction, and usage notes.',
  voicePlaybook: 'Voice and content playbook draft with tone and messaging examples.',
  quickStart: '30-day quick start checklist draft with weekly brand actions.',
}

const chapterPrompts: Record<number, string> = {
  1: 'Tell us the basics about your business.',
  2: 'Who usually buys from your business?',
  3: 'Shape how the brand should sound in the real world.',
  4: 'Pick the values you want your brand to lead with.',
  5: 'Add only the story context that will actually help the guide.',
  6: 'Choose your palette and visual direction.',
  7: 'Add anything that helps the guide make clearer choices.',
}

const microStepPrompts: Record<string, string> = {
  c1_s1: 'What is your business name?',
  c1_s2: 'What kind of business is this, and where do customers usually experience it?',
  c1_s3: 'What do customers trust first when they choose you?',
  c1_s4: 'Where should this guide help you first: your channels, your goal, or your next fix?',
  c1_s5: "Let's build your offer statement.",
  c1_s6: "Let's describe the change you create.",
  c1_s7: 'Optional: describe your full business in your own words.',
  c2_s1: 'Who is this most for, in plain language?',
  c2_s2: 'Optional: what are they struggling with right now?',
  c2_s3: 'Optional: what are they hoping to get to?',
  c3_s1: 'How should the brand sound when people read it?',
  c3_s2: 'Optional: how do you want your writing to make people feel?',
  c3_s3: 'Optional: show us how you already sound in writing.',
  c4_s1: 'Which values should your brand lead with?',
  c4_s2: 'Optional: add a mission statement if it really helps.',
  c5_s1: 'Which story angle feels most true, if any?',
  c5_s2: 'Optional: what origin detail is actually worth mentioning?',
  c5_s3: 'Optional: what problem are you here to solve, and what does winning look like?',
  c6_s1: 'Which palette feels right for your brand?',
  c6_s2: 'Which visual style direction fits best?',
  c6_s3:
    'Optional: which fonts are you already using? This helps your Pro kit reference continuity—map roles onto your licensed files in production.',
  c6_s4: 'Optional: upload a visual reference.',
  c6_s5: 'Optional: pick the feeling you want the visuals to have.',
  c6_s6: 'Optional: anything else the visuals should capture?',
  c7_s1: 'Optional: who might customers compare you to?',
  c7_s2: 'Optional: what makes you meaningfully different?',
}

const reassuranceCopy: Partial<Record<string, string>> = {
  c4_s1: 'You can refine this later. It guides the output, not a final manifesto.',
  c5_s1: 'This shapes the story in your kit. It does not need to be your final biography.',
  c7_s2: 'A rough answer is enough. We are looking for what feels distinct.',
}

function StepSupport({
  text,
  tone = 'default',
}: {
  text: string
  tone?: 'default' | 'reassure'
}) {
  return (
    <p
      className={
        tone === 'reassure'
          ? 'rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-600'
          : 'text-sm font-light leading-relaxed text-gray-500'
      }
    >
      {text}
    </p>
  )
}

function App() {
  const flow = useFlowState()
  const showDevStepJumper = import.meta.env.DEV
  /** Progressive sentence steps register here so Continue can flush the active wheel draft first. */
  const progressiveMicroDraftFlushRef = useRef<(() => void) | null>(null)
  const progressiveFooterNavRef = useRef<ProgressiveFooterNavApi | null>(null)
  const [, bumpProgressiveFooter] = useReducer((count: number) => count + 1, 0)
  const [editableOutputs, setEditableOutputs] = useState(initialOutputs)
  const [competitorDraft, setCompetitorDraft] = useState('')
  const [step3RailActive, setStep3RailActive] = useState(false)
  const [generatedCoreFiles, setGeneratedCoreFiles] = useState<GeneratedCoreFile[]>([])
  const [generationError, setGenerationError] = useState<string | null>(null)

  const tierLabel = useMemo(
    () => (flow.form.tier === 'pro' ? 'Pro Kit' : 'Core Kit'),
    [flow.form.tier],
  )
  const isPro = flow.form.tier === 'pro'
  const step3Preview = useMemo(
    () => buildVoicePreview(flow.form.step3.voiceSliders),
    [flow.form.step3.voiceSliders],
  )
  const step3VoiceExampleActive =
    step3RailActive ||
    flow.form.step3.tonePreset !== '' ||
    Object.values(flow.form.step3.voiceSliders).some((v) => v !== 50)
  const activePrompt = flow.activeMicroStep
    ? microStepPrompts[flow.activeMicroStep.id] ?? chapterPrompts[flow.chapterIndex] ?? ''
    : ''
  const progressLabel = flow.activeMicroStep
    ? `${flow.activeMicroStep.chapterLabel} ${flow.microStepIndex} of ${flow.activeChapterSteps.length}`
    : ''
  const progressContextLabel =
    flow.chapterIndex >= 1 && flow.chapterIndex <= 7 ? `Section ${flow.chapterIndex} of 7` : undefined

  async function handleGenerateCoreKit() {
    if (flow.form.tier !== 'core') {
      setGenerationError('Core-only generation is enabled right now. Select Core to test real PDF output.')
      return
    }

    setGenerationError(null)
    flow.goToProcessing()
    try {
      const result = await api.generateCoreKit(flow.form as unknown as Record<string, unknown>)
      setGeneratedCoreFiles(result.files)
      flow.goToConfirm()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Core PDF generation failed.'
      setGenerationError(message)
      flow.goToPayment()
    }
  }

  useEffect(() => {
    if (flow.chapterIndex !== 3) {
      setStep3RailActive(false)
    }
  }, [flow.chapterIndex])

  // Wizards should reset scroll on step/screen change (esp. mobile) so the next view starts at the top.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    const shellScroll = document.querySelector('[data-step-shell-scroll]')
    if (shellScroll instanceof HTMLElement) shellScroll.scrollTop = 0
  }, [flow.screen, flow.chapterIndex, flow.microStepIndex])

  if (flow.screen === 'landing') {
    return (
      <main
        className={`min-h-screen bg-[color:var(--ba-color-page-bg)] px-3 py-6 sm:px-6 ${
          showDevStepJumper ? 'pb-28 sm:pb-32' : ''
        }`}
      >
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-2 flex justify-center sm:mb-2.5">
            <BrandWordmark compact />
          </div>
          <TierSelector
            tiers={tierOptions}
            selectedTier={flow.form.tier}
            onSelect={flow.setTier}
            onContinue={flow.startFlow}
          />
          {showDevStepJumper ? (
            <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white/70 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">Dev only: Jump to step</p>
              <div className="flex flex-wrap gap-2">
                {([1, 2, 3, 4, 5, 6, 7] as const).map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => flow.jumpToStep(step)}
                    className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Step {step}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    )
  }

  function renderMicroStepContent() {
    if (!flow.activeMicroStep) return null

    const commonStep1 = {
      form: flow.form,
      errors: flow.errors,
      onChange: (
        field: 'businessName' | 'industry' | 'stage' | 'businessOperatingModel' | 'businessDescription',
        value: string,
      ) =>
        flow.updateForm((prev) => ({
          ...prev,
          step1: applyStep1ScalarField(prev.step1, field, value),
        })),
      onGuideFocusChange: (value: GuideFocus) =>
        flow.updateForm((prev) => ({
          ...prev,
          step1: { ...prev.step1, guideFocus: value },
        })),
      onTouchpointToggle: (value: TouchpointId) =>
        flow.updateForm((prev) => {
          const current = prev.step1.touchpoints ?? []
          const exists = current.includes(value)
          const nextTouchpoints = exists
            ? current.filter((item) => item !== value)
            : normalizeTouchpoints([...current, value])
          return {
            ...prev,
            step1: {
              ...prev.step1,
              touchpoints: nextTouchpoints,
            },
          }
        }),
      onPrimaryGoalChange: (value: PrimaryGoal) =>
        flow.updateForm((prev) => ({
          ...prev,
          step1: { ...prev.step1, primaryGoal: value },
        })),
      onOfferChange: (field: keyof typeof flow.form.step1.offer, value: string) =>
        flow.updateForm((prev) => ({
          ...prev,
          step1: { ...prev.step1, offer: { ...prev.step1.offer, [field]: value } },
        })),
      onTransformationChange: (field: keyof typeof flow.form.step1.transformation, value: string) =>
        flow.updateForm((prev) => ({
          ...prev,
          step1: { ...prev.step1, transformation: { ...prev.step1.transformation, [field]: value } },
        })),
      onCommitStep1Draft: (patch: { offer?: Partial<Step1Offer>; transformation?: Partial<Step1Transformation> }) =>
        flow.updateForm((prev) => ({
          ...prev,
          step1: {
            ...prev.step1,
            offer: patch.offer ? { ...prev.step1.offer, ...patch.offer } : prev.step1.offer,
            transformation: patch.transformation
              ? { ...prev.step1.transformation, ...patch.transformation }
              : prev.step1.transformation,
          },
        })),
      progressiveMicroDraftFlushRef,
      progressiveFooterNavRef,
      onProgressiveFooterChange: bumpProgressiveFooter,
      onNarratorChange: (value: typeof flow.form.step1.brandNarrator) =>
        flow.updateForm((prev) => ({
          ...prev,
          step1: { ...prev.step1, brandNarrator: value },
          step5: { ...prev.step5, originArchetype: '' },
        })),
    }

    const commonStep2 = {
      form: flow.form,
      isPro,
      errors: flow.errors,
      onArchetypeChange: (value: string) =>
        flow.updateForm((prev) => ({
          ...prev,
          step2: { ...prev.step2, customerArchetype: value },
        })),
      onProFieldChange: (field: 'painPoints' | 'desiredOutcomes', value: string) =>
        flow.updateForm((prev) => ({
          ...prev,
          step2: { ...prev.step2, [field]: value },
        })),
    }

    const commonStep3 = {
      form: flow.form,
      isPro,
      errors: flow.errors,
      onPresetChange: (value: 'friendly' | 'professional' | 'bold' | '') => {
        setStep3RailActive(true)
        flow.updateForm((prev) => ({ ...prev, step3: { ...prev.step3, tonePreset: value } }))
      },
      onSliderChange: (key: keyof VoiceSliders, value: number) => {
        setStep3RailActive(true)
        flow.updateForm((prev) => ({
          ...prev,
          step3: {
            ...prev.step3,
            voiceSliders: { ...prev.step3.voiceSliders, [key]: value },
          },
        }))
      },
      onCustomVoiceChange: (value: string) =>
        flow.updateForm((prev) => ({ ...prev, step3: { ...prev.step3, customVoiceNotes: value } })),
      onVoiceSamplesChange: (next: string[]) =>
        flow.updateForm((prev) => ({ ...prev, step3: { ...prev.step3, voiceSamples: next } })),
    }

    const commonStep4 = {
      form: flow.form,
      isPro,
      errors: flow.errors,
      onValuesChange: (values: string[]) =>
        flow.updateForm((prev) => ({ ...prev, step4: { ...prev.step4, values } })),
      onMissionChange: (value: string) =>
        flow.updateForm((prev) => ({ ...prev, step4: { ...prev.step4, missionStatement: value } })),
    }

    const commonStep5 = {
      form: flow.form,
      isPro,
      errors: flow.errors,
      onArchetypeChange: (value: string) =>
        flow.updateForm((prev) => ({ ...prev, step5: { ...prev.step5, originArchetype: value } })),
      onProFieldChange: (field: 'originSummary' | 'motivation', value: string) =>
        flow.updateForm((prev) => ({ ...prev, step5: { ...prev.step5, [field]: value } })),
    }

    const commonStep6 = {
      form: flow.form,
      isPro,
      errors: flow.errors,
      onPaletteChange: (value: string) =>
        flow.updateForm((prev) => ({ ...prev, step6: { ...prev.step6, selectedPalette: value } })),
      onStyleChange: (values: string[]) =>
        flow.updateForm((prev) => ({
          ...prev,
          step6: { ...prev.step6, selectedStyle: values[0] ?? '' },
        })),
      onTextChange: (field: 'visualNotes' | 'existingTypeface', value: string) =>
        flow.updateForm((prev) => ({ ...prev, step6: { ...prev.step6, [field]: value } })),
      onUploadNameChange: (value: string) =>
        flow.updateForm((prev) => ({ ...prev, step6: { ...prev.step6, referenceUploadName: value } })),
      onMoodAdjectivesChange: (next: MoodAdjective[]) =>
        flow.updateForm((prev) => ({ ...prev, step6: { ...prev.step6, moodAdjectives: next } })),
    }

    const commonStep7 = {
      form: flow.form,
      isPro,
      errors: flow.errors,
      competitorDraft,
      onCompetitorDraftChange: setCompetitorDraft,
      onAddCompetitor: () => {
        if (!competitorDraft.trim()) return
        const value = competitorDraft.trim()
        flow.updateForm((prev) => {
          if (prev.step7.competitors.includes(value)) return prev
          return { ...prev, step7: { ...prev.step7, competitors: [...prev.step7.competitors, value] } }
        })
        setCompetitorDraft('')
      },
      onRemoveCompetitor: (value: string) =>
        flow.updateForm((prev) => ({
          ...prev,
          step7: {
            ...prev.step7,
            competitors: prev.step7.competitors.filter((item) => item !== value),
          },
        })),
      onDifferentiationChange: (value: string) =>
        flow.updateForm((prev) => ({ ...prev, step7: { ...prev.step7, differentiation: value } })),
    }

    const trimmedBusinessName = flow.form.step1.businessName.trim()
    const visualPreviewBrandLabel =
      trimmedBusinessName.length === 0
        ? undefined
        : trimmedBusinessName.split(/\s+/).filter(Boolean).slice(0, 2).join(' ')

    switch (flow.activeMicroStep.id) {
      case 'c1_s1':
        return <Step1Snapshot {...commonStep1} view="businessName" />
      case 'c1_s2':
        return <Step1Snapshot {...commonStep1} view="industryStage" />
      case 'c1_s3':
        return <Step1Snapshot {...commonStep1} view="brandNarrator" />
      case 'c1_s4':
        return <Step1Snapshot {...commonStep1} view="primaryTouchpoint" />
      case 'c1_s5':
        return <Step1Snapshot {...commonStep1} view="offerSentence" />
      case 'c1_s6':
        return <Step1Snapshot {...commonStep1} view="transformationSentence" />
      case 'c1_s7':
        return <Step1Snapshot {...commonStep1} view="businessDescription" />
      case 'c2_s1':
        return <Step2Customer {...commonStep2} visibleSections={['archetype']} />
      case 'c2_s2':
        return <Step2Customer {...commonStep2} visibleSections={['painPoints']} />
      case 'c2_s3':
        return <Step2Customer {...commonStep2} visibleSections={['desiredOutcomes']} />
      case 'c3_s1':
        return <Step3Personality {...commonStep3} visibleSections={['preset', 'sliderClusterA', 'sliderClusterB']} />
      case 'c3_s2':
        return <Step3Personality {...commonStep3} visibleSections={['customVoiceNotes']} />
      case 'c3_s3':
        return <Step3Personality {...commonStep3} visibleSections={['voiceSamples']} />
      case 'c4_s1':
        return (
          <>
            <StepSupport text={reassuranceCopy.c4_s1 ?? ''} tone="reassure" />
            <Step4Values {...commonStep4} visibleSections={['values']} />
          </>
        )
      case 'c4_s2':
        return <Step4Values {...commonStep4} visibleSections={['missionStatement']} />
      case 'c5_s1':
        return (
          <>
            <StepSupport text={reassuranceCopy.c5_s1 ?? ''} tone="reassure" />
            <Step5Story {...commonStep5} visibleSections={['originArchetype']} />
          </>
        )
      case 'c5_s2':
        return <Step5Story {...commonStep5} visibleSections={['originSummary']} />
      case 'c5_s3':
        return <Step5Story {...commonStep5} visibleSections={['motivation']} />
      case 'c6_s1':
        return (
          <>
            <div className="sticky top-0 z-10 -mx-4 bg-[color:var(--ba-color-page-bg)] px-4 pb-2 sm:-mx-6 sm:px-6">
              <VisualDirectionPreview
                paletteId={flow.form.step6.selectedPalette}
                styleId={flow.form.step6.selectedStyle}
                mode="palette"
                brandLabel={visualPreviewBrandLabel}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-full h-4 bg-gradient-to-b from-[color:var(--ba-color-page-bg)] to-transparent"
              />
            </div>
            <Step6Aesthetic {...commonStep6} visibleSections={['palette']} />
          </>
        )
      case 'c6_s2':
        return (
          <>
            <div className="sticky top-0 z-10 -mx-4 bg-[color:var(--ba-color-page-bg)] px-4 pb-2 sm:-mx-6 sm:px-6">
              <VisualDirectionPreview
                paletteId={flow.form.step6.selectedPalette}
                styleId={flow.form.step6.selectedStyle}
                mode="style"
                brandLabel={visualPreviewBrandLabel}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-full h-4 bg-gradient-to-b from-[color:var(--ba-color-page-bg)] to-transparent"
              />
            </div>
            <Step6Aesthetic {...commonStep6} visibleSections={['style']} />
          </>
        )
      case 'c6_s3':
        return <Step6Aesthetic {...commonStep6} visibleSections={['existingTypeface']} />
      case 'c6_s4':
        return <Step6Aesthetic {...commonStep6} visibleSections={['referenceUpload']} />
      case 'c6_s5':
        return <Step6Aesthetic {...commonStep6} visibleSections={['moodAdjectives']} />
      case 'c6_s6':
        return <Step6Aesthetic {...commonStep6} visibleSections={['visualNotes']} />
      case 'c7_s1':
        return <Step7Industry {...commonStep7} visibleSections={['competitors']} />
      case 'c7_s2':
        return (
          <>
            <StepSupport text={reassuranceCopy.c7_s2 ?? ''} tone="reassure" />
            <Step7Industry {...commonStep7} visibleSections={['differentiation']} />
          </>
        )
      default:
        return null
    }
  }

  if (flow.screen === 'step') {
    const shellFooter = progressiveFooterNavRef.current
    const shellContinueLabel = shellFooter?.getFooterPrimaryLabel?.() ?? 'Continue'
    const shellContinueDisabled =
      shellFooter?.getFooterPrimaryDisabled?.() ?? !flow.canContinueCurrentStep

    return (
      <StepShell
        progressLabel={progressLabel}
        progressCurrent={flow.currentMicroStepPosition}
        progressTotal={flow.totalMicroSteps}
        progressContextLabel={progressContextLabel}
        title={flow.activeMicroStep?.chapterLabel ?? ''}
        prompt={activePrompt}
        continueLabel={shellContinueLabel}
        continueDisabled={shellContinueDisabled}
        rail={
          flow.chapterIndex === 3 ? (
            <ToneExampleStrip
              active={step3VoiceExampleActive}
              sentence={step3Preview.sentence}
              mood={step3Preview.mood}
            />
          ) : undefined
        }
        mobileFooterAccessory={
          flow.chapterIndex === 3 ? (
            <ToneExampleStrip
              active={step3VoiceExampleActive}
              sentence={step3Preview.sentence}
              mood={step3Preview.mood}
            />
          ) : undefined
        }
        onBack={flow.backStep}
        onContinue={() => {
          flushSync(() => {
            progressiveMicroDraftFlushRef.current?.()
          })
          if (progressiveFooterNavRef.current?.tryAdvanceFromFooter?.()) return
          flow.continueStep()
        }}
      >
        {renderMicroStepContent()}
      </StepShell>
    )
  }

  if (flow.screen === 'review') {
    return <ReviewScreen form={flow.form} onEditStep={flow.editStep} onContinue={flow.goToPayment} />
  }

  if (flow.screen === 'payment') {
    return (
      <PaymentPlaceholder
        tierLabel={tierLabel}
        onBack={flow.goToReview}
        onStartCheckout={handleGenerateCoreKit}
        actionLabel="Generate Core PDFs"
        errorText={generationError ?? undefined}
      />
    )
  }

  if (flow.screen === 'processing') {
    return <ProcessingScreen tierLabel={tierLabel} />
  }

  if (flow.screen === 'edit') {
    return (
      <EditScreen
        form={flow.form}
        editableOutputs={editableOutputs}
        onUpdate={(field, value) => setEditableOutputs((prev) => ({ ...prev, [field]: value }))}
        onSend={flow.goToConfirm}
      />
    )
  }

  return (
    <ConfirmScreen
      tier={flow.form.tier}
      generatedFiles={generatedCoreFiles}
      onRestart={() => {
        window.location.reload()
      }}
    />
  )
}

export default App
