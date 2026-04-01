import { Button } from '../ui/Button'

import type { Tier } from '../../types'

interface ConfirmScreenProps {
  tier: Tier | null
  onRestart: () => void
}

export function ConfirmScreen({ tier, onRestart }: ConfirmScreenProps) {
  const pdfCount = tier === 'pro' ? 5 : 4
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <section className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Delivery Confirmed</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Your Identity Kit is on the way
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          We emailed your {pdfCount} branded PDF documents. If you do not see them within a few minutes,
          check your spam/promotions folder.
        </p>
        <p className="mt-2 text-xs text-zinc-500">Need help? Contact support@brandalchemyllc.com</p>

        <div className="mt-6">
          <Button onClick={onRestart}>Start New Kit</Button>
        </div>
      </section>
    </main>
  )
}
