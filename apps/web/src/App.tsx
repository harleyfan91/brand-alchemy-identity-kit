import { useMemo, useState } from 'react'

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

  const tierLabel = useMemo(
    () => (flow.form.tier === 'pro' ? 'Pro Kit' : 'Core Kit'),
    [flow.form.tier],
  )
  const isPro = flow.form.tier === 'pro'

  const activeMeta = stepMeta[flow.stepIndex - 1]

  if (flow.screen === 'landing') {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-6 sm:px-6">
        <TierSelector
          tiers={tierOptions}
          selectedTier={flow.form.tier}
          onSelect={flow.setTier}
          onContinue={flow.startFlow}
        />
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
            onAdjectivesChange={(values) =>
              flow.updateForm((prev) => ({
                ...prev,
                step3: { ...prev.step3, personalityAdjectives: values },
              }))
            }
            onToneChange={(value) =>
              flow.updateForm((prev) => ({ ...prev, step3: { ...prev.step3, tone: value } }))
            }
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
            onIndustryChange={(value) =>
              flow.updateForm((prev) => ({ ...prev, step7: { ...prev.step7, industry: value } }))
            }
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
      onRestart={() => {
        window.location.reload()
      }}
    />
  )
}

export default App
