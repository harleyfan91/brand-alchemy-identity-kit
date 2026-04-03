import type { PropsWithChildren, ReactNode } from 'react'

import { BrandWordmark } from '../branding/BrandWordmark'
import { AlchemySymbolStrip } from '../branding/AlchemySymbolStrip'
import { Button } from '../ui/Button'
import { ProgressBar } from './ProgressBar'

interface StepShellProps {
  stepNumber: number
  totalSteps: number
  title: string
  prompt: string
  rail?: ReactNode
  onBack?: () => void
  onContinue: () => void
  continueLabel?: string
  /** When true, Continue is disabled (secondary style like landing CTA until tier selected). */
  continueDisabled?: boolean
}

export function StepShell({
  stepNumber,
  totalSteps,
  title,
  prompt,
  rail,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  children,
}: PropsWithChildren<StepShellProps>) {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-2 flex justify-center sm:mb-2.5">
          <BrandWordmark compact />
        </div>
        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <header className="space-y-4 pb-5">
            <ProgressBar current={stepNumber} total={totalSteps} />
            <div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-[2rem]">
                {title}
              </h1>
              <p className="mt-2 text-base leading-relaxed text-zinc-600">{prompt}</p>
            </div>
          </header>

          {rail ?? <AlchemySymbolStrip />}

          <div className="space-y-4 py-6">{children}</div>

          <footer className="flex items-center justify-between pt-5">
            <Button variant="secondary" onClick={onBack} disabled={!onBack}>
              Back
            </Button>
            <Button onClick={onContinue} disabled={continueDisabled}>
              {continueLabel}
            </Button>
          </footer>
        </section>
      </div>
    </main>
  )
}
