import { Button } from '../ui/Button'

interface PaymentPlaceholderProps {
  tierLabel: string
  onStartCheckout: () => void
  onBack: () => void
  errorText?: string
  actionLabel?: string
}

export function PaymentPlaceholder({
  tierLabel,
  onStartCheckout,
  onBack,
  errorText,
  actionLabel = 'Continue',
}: PaymentPlaceholderProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-3 sm:px-6">
      <section className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white px-4 py-8 sm:p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Secure Checkout</p>
        <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          Ready for secure checkout?
        </h1>
        <p className="mt-3 text-sm font-light leading-relaxed text-gray-500 sm:text-base">
          In production, this button sends you to secure Stripe checkout to start generating your {tierLabel}.
        </p>
        {errorText ? <p className="mt-3 text-sm text-red-600">{errorText}</p> : null}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="secondary" onClick={onBack}>
            Review my answers
          </Button>
          <Button onClick={onStartCheckout}>{actionLabel}</Button>
        </div>
      </section>
    </main>
  )
}
