import type { Tier, TierConfig } from '../../types'
import { Button } from '../ui/Button'

interface TierSelectorProps {
  tiers: TierConfig[]
  selectedTier: Tier | null
  onSelect: (tier: Tier) => void
  onContinue: () => void
}

export function TierSelector({ tiers, selectedTier, onSelect, onContinue }: TierSelectorProps) {
  return (
    <section className="mx-auto w-full max-w-xl space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <header>
        <p className="text-sm font-medium text-zinc-500">Brand Alchemy Identity Kit</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
          Build your brand kit in minutes
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Choose your experience, answer a guided visual quiz, and get your finished kit by email.
        </p>
      </header>

      <div className="space-y-3">
        {tiers.map((tier) => {
          const active = selectedTier === tier.id
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                active
                  ? 'border-zinc-900 bg-zinc-100'
                  : 'border-zinc-200 bg-white hover:border-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-zinc-900">{tier.name}</h2>
                  {tier.id === 'pro' ? (
                    <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      AI-powered
                    </span>
                  ) : null}
                </div>
                <span className="text-sm font-semibold text-zinc-700">{tier.priceLabel}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-600">{tier.description}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                {tier.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      <Button fullWidth onClick={onContinue} disabled={!selectedTier}>
        Start My Identity Kit
      </Button>
    </section>
  )
}
