import { Button } from '../ui/Button'

interface ProcessingScreenProps {
  tierLabel: string
  onComplete?: () => void
  actionLabel?: string
}

export function ProcessingScreen({ tierLabel, onComplete, actionLabel = 'Open my draft kit' }: ProcessingScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--ba-color-page-bg)] px-3 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white px-4 py-8 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Generating</p>
        <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          We are building your kit now
        </h1>
        <p className="mt-3 text-sm font-light leading-relaxed text-gray-500 sm:text-base">
          Great choice. Your {tierLabel} is being prepared now and this usually takes just a few minutes.
        </p>
        <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gray-900" />
        </div>
        {onComplete ? (
          <div className="mt-6">
            <Button onClick={onComplete}>{actionLabel}</Button>
          </div>
        ) : null}
      </section>
    </main>
  )
}
