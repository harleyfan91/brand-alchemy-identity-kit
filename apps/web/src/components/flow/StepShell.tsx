import type { PropsWithChildren } from 'react'

import { AlchemyMark } from '../branding/AlchemyMark'
import { Button } from '../ui/Button'
import { ProgressBar } from './ProgressBar'

interface StepShellProps {
  stepNumber: number
  totalSteps: number
  title: string
  prompt: string
  onBack?: () => void
  onContinue: () => void
  continueLabel?: string
}

export function StepShell({
  stepNumber,
  totalSteps,
  title,
  prompt,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  children,
}: PropsWithChildren<StepShellProps>) {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 sm:px-6">
      <section className="mx-auto w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <header className="space-y-5 border-b border-zinc-200 pb-5">
          <AlchemyMark />
          <ProgressBar current={stepNumber} total={totalSteps} />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
            <p className="mt-1 text-sm text-zinc-600">{prompt}</p>
            <p className="mt-1 text-xs text-zinc-500">Quick picks now, polished kit in your inbox later.</p>
          </div>
        </header>

        <div className="space-y-4 py-6">{children}</div>

        <footer className="flex items-center justify-between border-t border-zinc-200 pt-5">
          <Button variant="secondary" onClick={onBack} disabled={!onBack}>
            Back
          </Button>
          <Button onClick={onContinue}>{continueLabel}</Button>
        </footer>
      </section>
    </main>
  )
}
