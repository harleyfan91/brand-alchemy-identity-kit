export type Tier = 'core' | 'pro'

export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type FulfillmentStatus = 'not_started' | 'in_progress' | 'complete' | 'error'

export type Screen =
  | 'landing'
  | 'step'
  | 'review'
  | 'payment'
  | 'processing'
  | 'edit'
  | 'confirm'

export interface Step1Snapshot {
  businessName: string
  offer: string
  industry: string
  stage: string
}

export interface Step2Customer {
  customerArchetype: string
  painPoints?: string
  desiredOutcomes?: string
}

export interface Step3Personality {
  personalityAdjectives: string[]
  tone: 'friendly' | 'professional' | 'bold' | ''
  customVoiceNotes?: string
}

export interface Step4Values {
  values: string[]
  missionStatement?: string
}

export interface Step5Story {
  originArchetype: string
  originSummary?: string
  motivation?: string
}

export interface Step6Aesthetic {
  selectedPalette: string
  selectedStyle: string
  colorMoodNotes?: string
  styleNotes?: string
  referenceUploadName?: string
}

export interface Step7Industry {
  industry: string
  competitors: string[]
  differentiation?: string
}

export interface IdentityKitForm {
  tier: Tier | null
  sessionId: string
  orderId: string | null
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  step1: Step1Snapshot
  step2: Step2Customer
  step3: Step3Personality
  step4: Step4Values
  step5: Step5Story
  step6: Step6Aesthetic
  step7: Step7Industry
  createdAt: string
  updatedAt: string
}

export type StepIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type StepErrors = Record<string, string>

export interface TierConfig {
  id: Tier
  name: string
  priceLabel: string
  description: string
  bullets: string[]
}
