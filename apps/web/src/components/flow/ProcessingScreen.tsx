import { Button } from '../ui/Button'

interface ProcessingScreenProps {
  tierLabel: string
  onComplete: () => void
}

export function ProcessingScreen({ tierLabel, onComplete }: ProcessingScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <section className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Generating</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          We are building your kit now
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          {tierLabel} generation is in progress. This usually takes a couple of minutes.
        </p>
        <div className="mt-4 h-2 w-full rounded-full bg-zinc-200">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-zinc-900" />
        </div>
        <div className="mt-6">
          <Button onClick={onComplete}>Continue to Edit</Button>
        </div>
      </section>
    </main>
  )
}
