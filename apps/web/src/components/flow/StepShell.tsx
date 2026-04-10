import type { PropsWithChildren, ReactNode } from 'react'

import { AlchemySymbolStrip } from '../branding/AlchemySymbolStrip'
import { Button } from '../ui/Button'
import { ProgressBar } from './ProgressBar'

interface StepShellProps {
  progressLabel: string
  progressCurrent: number
  progressTotal: number
  progressContextLabel?: string
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
  progressLabel,
  progressCurrent,
  progressTotal,
  progressContextLabel,
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
    <main className="min-h-screen bg-gray-50 px-4 py-5 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-xl">
        <header className="space-y-4 pb-4">
          <ProgressBar
            label={progressLabel}
            current={progressCurrent}
            total={progressTotal}
            contextLabel={progressContextLabel}
          />
          <div>
            <h1 className="font-serif text-2xl font-normal tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              {title}
            </h1>
            <p className="mt-1 text-sm font-light leading-relaxed text-gray-500 sm:text-base">{prompt}</p>
          </div>
        </header>

        {rail ?? <AlchemySymbolStrip />}

        <div className="space-y-4 py-4">{children}</div>

        <footer className="flex items-center justify-between border-t border-gray-200/80 pt-5">
          <Button variant="secondary" onClick={onBack} disabled={!onBack}>
            Back
          </Button>
          <Button onClick={onContinue} disabled={continueDisabled}>
            {continueLabel}
          </Button>
        </footer>
      </div>
    </main>
  )
}
