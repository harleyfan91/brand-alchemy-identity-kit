import { Button } from '../ui/Button'

interface PaymentPlaceholderProps {
  tierLabel: string
  onStartCheckout: () => void
  onBack: () => void
}

export function PaymentPlaceholder({ tierLabel, onStartCheckout, onBack }: PaymentPlaceholderProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <section className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Secure Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Ready to generate your {tierLabel}
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          This is a Phase 1 payment placeholder. Stripe Checkout wiring will be added in Phase 2.
        </p>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="secondary" onClick={onBack}>
            Back to review
          </Button>
          <Button onClick={onStartCheckout}>Simulate Payment Success</Button>
        </div>
      </section>
    </main>
  )
}
