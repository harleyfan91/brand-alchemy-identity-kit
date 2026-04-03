import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'

import { AlchemySymbolStrip } from './components/branding/AlchemySymbolStrip'
import { BrandWordmark } from './components/branding/BrandWordmark'
import { LiveRailStrip } from './components/branding/LiveRailStrip'
import { PaymentPlaceholder } from './components/flow/PaymentPlaceholder'
import { ProcessingScreen } from './components/flow/ProcessingScreen'
import { StepShell } from './components/flow/StepShell'
import { TierSelector } from './components/flow/TierSelector'
import { EditScreen } from './components/review/EditScreen'
import { ReviewScreen } from './components/review/ReviewScreen'
import { ConfirmScreen } from './components/review/ConfirmScreen'
import { Step1Snapshot } from './components/steps/Step1Snapshot'
import { Step2Customer } from './components/steps/Step2Customer'
import { Step3Personality } from './components/steps/Step3Personality'
import { Step4Values } from './components/steps/Step4Values'
import { Step5Story } from './components/steps/Step5Story'
import { Step6Aesthetic } from './components/steps/Step6Aesthetic'
import { Step7Industry } from './components/steps/Step7Industry'
import { stepMeta } from './data/steps'
import { tierOptions } from './data/tiers'
import { useFlowState } from './hooks/useFlowState'
import { useMediaQuery } from './hooks/useMediaQuery'
import type { VoiceSliders } from './types'
import { buildVoicePreview } from './utils/voicePreview'

const initialOutputs = {
  brandBrief: 'Brand brief draft generated from your intake answers.',
  styleGuide: 'Style guide draft with colors, typography direction, and usage notes.',
  voicePlaybook: 'Voice and content playbook draft with tone and messaging examples.',
  quickStart: '30-day quick start checklist draft with weekly brand actions.',
}

function App() {
  const flow = useFlowState()
  const [editableOutputs, setEditableOutputs] = useState(initialOutputs)
  const [competitorDraft, setCompetitorDraft] = useState('')
  const [step3RailActive, setStep3RailActive] = useState(false)
  const [landingScrollEl, setLandingScrollEl] = useState<HTMLElement | null>(null)

  const isNarrowViewport = useMediaQuery('(max-width: 639px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const useSnapLanding = isNarrowViewport && !prefersReducedMotion

  const setLandingMainEl = useCallback((el: HTMLElement | null) => {
    setLandingScrollEl(el)
  }, [])

  const tierLabel = useMemo(
    () => (flow.form.tier === 'pro' ? 'Pro Kit' : 'Core Kit'),
    [flow.form.tier],
  )
  const isPro = flow.form.tier === 'pro'

  const activeMeta = stepMeta[flow.stepIndex - 1]
  const step3Preview = useMemo(
    () => buildVoicePreview(flow.form.step3.voiceSliders),
    [flow.form.step3.voiceSliders],
  )

  useEffect(() => {
    if (flow.stepIndex !== 3) {
      setStep3RailActive(false)
    }
  }, [flow.stepIndex])

  // Wizards should reset scroll on step/screen change (esp. mobile) so the next view starts at the top.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    landingScrollEl?.scrollTo(0, 0)
  }, [flow.screen, flow.stepIndex, landingScrollEl])

  const tierSelectorBase = {
    tiers: tierOptions,
    selectedTier: flow.form.tier,
    onSelect: flow.setTier,
    onContinue: flow.startFlow,
  } as const

  if (flow.screen === 'landing') {
    if (useSnapLanding) {
      return (
        <main
          ref={setLandingMainEl}
          className="h-[100dvh] overflow-y-auto overscroll-y-contain bg-zinc-50 [scrollbar-gutter:stable] snap-y snap-mandatory"
        >
          <section className="flex min-h-[100dvh] min-h-[100svh] snap-start snap-always flex-col px-4 pb-6 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div className="flex flex-1 flex-col justify-center">
              <BrandWordmark compact />
              <p className="mx-auto mt-4 max-w-[22rem] text-center text-sm leading-relaxed text-zinc-600">
                In branding, <span className="font-medium text-zinc-800">alchemy</span> is refining your
                story and audience into a clear identity you can use everywhere.
              </p>
              <h1 className="mt-8 text-center text-[clamp(1.9rem,8vw,2.65rem)] font-bold uppercase leading-[1.05] tracking-[0.065em] text-zinc-900">
                Build your brand kit in minutes
              </h1>
              <div className="mt-10 -mx-4">
                <AlchemySymbolStrip />
              </div>
            </div>
            <p className="mt-4 pb-[max(0.25rem,env(safe-area-inset-bottom))] text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
              Swipe up to continue
            </p>
          </section>
          <section className="flex min-h-[100dvh] min-h-[100svh] snap-start snap-always flex-col px-4 pb-36 pt-2">
            <div className="mx-auto w-full max-w-xl">
              <TierSelector {...tierSelectorBase} hideIntro scrollRoot={landingScrollEl} />
            </div>
          </section>
        </main>
      )
    }

    return (
      <main ref={setLandingMainEl} className="min-h-screen bg-zinc-50 px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-2 flex justify-center sm:mb-2.5">
            <BrandWordmark compact />
          </div>
          {isNarrowViewport ? (
            <section className="pb-6 pt-1">
              <p className="mx-auto max-w-[22rem] text-center text-sm leading-relaxed text-zinc-600">
                In branding, <span className="font-medium text-zinc-800">alchemy</span> is refining your
                story and audience into a clear identity you can use everywhere.
              </p>
              <h1 className="mt-6 text-center text-[clamp(1.9rem,8vw,2.5rem)] font-bold uppercase leading-[1.05] tracking-[0.065em] text-zinc-900">
                Build your brand kit in minutes
              </h1>
              <div className="mt-8 -mx-4">
                <AlchemySymbolStrip />
              </div>
            </section>
          ) : null}
          <TierSelector {...tierSelectorBase} hideIntro={isNarrowViewport} />
        </div>
      </main>
    )
  }

  if (flow.screen === 'step') {
    return (
      <StepShell
        stepNumber={flow.stepIndex}
        totalSteps={7}
        title={activeMeta.title}
        prompt={activeMeta.prompt}
        continueDisabled={!flow.canContinueCurrentStep}
        rail={
          flow.stepIndex === 3 ? (
            <LiveRailStrip
              isActive={step3RailActive}
              content={step3Preview.sentence}
              mood={step3Preview.mood}
            />
          ) : undefined
        }
        onBack={flow.backStep}
        onContinue={flow.continueStep}
      >
        {flow.stepIndex === 1 ? (
          <Step1Snapshot
            form={flow.form}
            errors={flow.errors}
            onChange={(field, value) =>
              flow.updateForm((prev) => ({ ...prev, step1: { ...prev.step1, [field]: value } }))
            }
          />
        ) : null}
        {flow.stepIndex === 2 ? (
          <Step2Customer
            form={flow.form}
            isPro={isPro}
            errors={flow.errors}
            onArchetypeChange={(value) =>
              flow.updateForm((prev) => ({
                ...prev,
                step2: { ...prev.step2, customerArchetype: value },
              }))
            }
            onProFieldChange={(field, value) =>
              flow.updateForm((prev) => ({
                ...prev,
                step2: { ...prev.step2, [field]: value },
              }))
            }
          />
        ) : null}
        {flow.stepIndex === 3 ? (
          <Step3Personality
            form={flow.form}
            isPro={isPro}
            errors={flow.errors}
            onPresetChange={(value) => {
              setStep3RailActive(true)
              flow.updateForm((prev) => ({ ...prev, step3: { ...prev.step3, tonePreset: value } }))
            }}
            onSliderChange={(key: keyof VoiceSliders, value) => {
              setStep3RailActive(true)
              flow.updateForm((prev) => ({
                ...prev,
                step3: {
                  ...prev.step3,
                  voiceSliders: { ...prev.step3.voiceSliders, [key]: value },
                },
              }))
            }}
            onCustomVoiceChange={(value) =>
              flow.updateForm((prev) => ({ ...prev, step3: { ...prev.step3, customVoiceNotes: value } }))
            }
          />
        ) : null}
        {flow.stepIndex === 4 ? (
          <Step4Values
            form={flow.form}
            isPro={isPro}
            errors={flow.errors}
            onValuesChange={(values) =>
              flow.updateForm((prev) => ({ ...prev, step4: { ...prev.step4, values } }))
            }
            onMissionChange={(value) =>
              flow.updateForm((prev) => ({ ...prev, step4: { ...prev.step4, missionStatement: value } }))
            }
          />
        ) : null}
        {flow.stepIndex === 5 ? (
          <Step5Story
            form={flow.form}
            isPro={isPro}
            errors={flow.errors}
            onArchetypeChange={(value) =>
              flow.updateForm((prev) => ({ ...prev, step5: { ...prev.step5, originArchetype: value } }))
            }
            onProFieldChange={(field, value) =>
              flow.updateForm((prev) => ({ ...prev, step5: { ...prev.step5, [field]: value } }))
            }
          />
        ) : null}
        {flow.stepIndex === 6 ? (
          <Step6Aesthetic
            form={flow.form}
            isPro={isPro}
            errors={flow.errors}
            onPaletteChange={(value) =>
              flow.updateForm((prev) => ({ ...prev, step6: { ...prev.step6, selectedPalette: value } }))
            }
            onStyleChange={(values) =>
              flow.updateForm((prev) => ({
                ...prev,
                step6: { ...prev.step6, selectedStyle: values[0] ?? '' },
              }))
            }
            onTextChange={(field, value) =>
              flow.updateForm((prev) => ({ ...prev, step6: { ...prev.step6, [field]: value } }))
            }
            onUploadNameChange={(value) =>
              flow.updateForm((prev) => ({ ...prev, step6: { ...prev.step6, referenceUploadName: value } }))
            }
          />
        ) : null}
        {flow.stepIndex === 7 ? (
          <Step7Industry
            form={flow.form}
            isPro={isPro}
            errors={flow.errors}
            competitorDraft={competitorDraft}
            onCompetitorDraftChange={setCompetitorDraft}
            onAddCompetitor={() => {
              if (!competitorDraft.trim()) return
              const value = competitorDraft.trim()
              flow.updateForm((prev) => {
                if (prev.step7.competitors.includes(value)) return prev
                return { ...prev, step7: { ...prev.step7, competitors: [...prev.step7.competitors, value] } }
              })
              setCompetitorDraft('')
            }}
            onRemoveCompetitor={(value) =>
              flow.updateForm((prev) => ({
                ...prev,
                step7: {
                  ...prev.step7,
                  competitors: prev.step7.competitors.filter((item) => item !== value),
                },
              }))
            }
            onDifferentiationChange={(value) =>
              flow.updateForm((prev) => ({ ...prev, step7: { ...prev.step7, differentiation: value } }))
            }
          />
        ) : null}
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
        onStartCheckout={flow.goToProcessing}
      />
    )
  }

  if (flow.screen === 'processing') {
    return <ProcessingScreen tierLabel={tierLabel} onComplete={flow.goToEdit} />
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
      onRestart={() => {
        window.location.reload()
      }}
    />
  )
}

export default App
