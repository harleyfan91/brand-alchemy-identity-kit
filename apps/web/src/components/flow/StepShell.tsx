import type { PropsWithChildren, ReactNode } from 'react'
import { FaChevronLeft } from 'react-icons/fa6'

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
  /** Small screens only: stacked flush above the footer CTA (same content as `rail` is fine as a second element). */
  mobileFooterAccessory?: ReactNode
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
  mobileFooterAccessory,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  children,
}: PropsWithChildren<StepShellProps>) {
  const mainBottomPad = mobileFooterAccessory
    ? 'pb-32 max-md:pb-[10rem] md:pb-40'
    : rail
      ? 'pb-40 max-md:pb-[11.5rem] sm:pb-44'
      : 'pb-32 sm:pb-36'

  return (
    <main className={`relative min-h-[100dvh] bg-gray-50 px-4 pt-5 sm:px-6 sm:pt-6 ${mainBottomPad}`}>
      <div className="mx-auto w-full min-w-0 max-w-xl">
        <header className="space-y-4 pb-3">
          <div className="flex items-start gap-1 sm:gap-2">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                aria-label="Back"
                className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 active:bg-gray-200"
              >
                <FaChevronLeft className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
            <div className={onBack ? 'min-w-0 flex-1 pt-0.5' : 'min-w-0 flex-1'}>
              <ProgressBar
                label={progressLabel}
                current={progressCurrent}
                total={progressTotal}
                contextLabel={progressContextLabel}
              />
            </div>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-normal tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              {title}
            </h1>
            <p className="mt-1 text-sm font-light leading-relaxed text-gray-500 sm:text-base">{prompt}</p>
          </div>
        </header>

        {rail ? (
          <div className={mobileFooterAccessory ? 'hidden md:block' : ''}>{rail}</div>
        ) : null}

        {/**
         * Window scrolls; fixed footer stays in the thumb zone. Bottom padding on `main` clears the action bar.
         */}
        <div data-step-shell-scroll className="space-y-4 pb-4 pt-2 sm:pt-3">
          {children}
        </div>
      </div>

      {mobileFooterAccessory ? (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex flex-col border-t border-gray-200/90 bg-gray-50/95 backdrop-blur-md">
          <div className="px-4 pb-1 pt-2 sm:px-6 md:hidden">{mobileFooterAccessory}</div>
          <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 md:pt-4">
            <div className="mx-auto w-full max-w-xl">
              <Button fullWidth onClick={onContinue} disabled={continueDisabled}>
                {continueLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200/90 bg-gray-50/95 px-4 pt-4 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          <div className="mx-auto w-full max-w-xl">
            <Button fullWidth onClick={onContinue} disabled={continueDisabled}>
              {continueLabel}
            </Button>
          </div>
        </footer>
      )}
    </main>
  )
}
