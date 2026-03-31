import { useEffect, useRef, useState } from 'react'

import type { Tier, TierConfig } from '../../types'
import { BrandWordmark } from '../branding/BrandWordmark'
import { AlchemySymbolStrip } from '../branding/AlchemySymbolStrip'
import { Button } from '../ui/Button'

interface TierSelectorProps {
  tiers: TierConfig[]
  selectedTier: Tier | null
  onSelect: (tier: Tier) => void
  onContinue: () => void
}

export function TierSelector({ tiers, selectedTier, onSelect, onContinue }: TierSelectorProps) {
  const [ctaProgress, setCtaProgress] = useState(0)
  const [ctaWidthRatio, setCtaWidthRatio] = useState(0.62)
  const ticking = useRef(false)

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      // Monotonic progress from top(0) to bottom(1) to prevent "shrink while scrolling down" behavior.
      const progress = Math.max(0, Math.min(1, y / maxScroll))
      setCtaProgress(progress)
      setCtaWidthRatio(0.62 + progress * 0.38)

      ticking.current = false
    }

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section className="relative mx-auto w-full max-w-xl space-y-5 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 pb-14 shadow-sm">
      <header className="relative z-10">
        <BrandWordmark />
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
          Build your brand kit in minutes
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Guided, simple, and done-for-you options for building a polished brand kit fast.
        </p>
      </header>

      <AlchemySymbolStrip />

      <div className="relative z-10 space-y-3">
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

      <div
        className="pointer-events-none fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
      >
        <div className="flex w-full justify-center">
          <Button
            fullWidth={false}
            onClick={onContinue}
            disabled={!selectedTier}
            className="pointer-events-auto block origin-center rounded-full px-5 py-3 text-sm transition-all duration-200 ease-out"
            style={{
              width: `${ctaWidthRatio * 100}%`,
              fontSize: `${12 + ctaProgress * 2}px`,
            }}
          >
            Start My Identity Kit
          </Button>
        </div>
      </div>
    </section>
  )
}
