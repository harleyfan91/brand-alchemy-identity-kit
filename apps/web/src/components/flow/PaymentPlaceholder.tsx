import { Button } from '../ui/Button'

interface PaymentPlaceholderProps {
  tierLabel: string
  onStartCheckout: () => void
  onBack: () => void
}

export function PaymentPlaceholder({ tierLabel, onStartCheckout, onBack }: PaymentPlaceholderProps) {
  const tierPromise =
    tierLabel === 'Pro Kit'
      ? 'You are about to unlock AI-personalized drafts and your Pro Content Starter Pack.'
      : 'You are about to unlock guided template drafts assembled from your survey selections.'

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-3 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white px-4 py-8 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Secure Checkout</p>
        <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          Ready to generate your {tierLabel}
        </h1>
        <p className="mt-3 text-sm font-light leading-relaxed text-gray-500 sm:text-base">
          {tierPromise} In production, this button sends you to secure Stripe checkout.
        </p>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="secondary" onClick={onBack}>
            Review my answers
          </Button>
          <Button onClick={onStartCheckout}>Continue</Button>
        </div>
      </section>
    </main>
  )
}
