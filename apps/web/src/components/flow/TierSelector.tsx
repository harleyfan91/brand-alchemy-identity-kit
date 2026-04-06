import { useEffect, useRef, useState } from 'react'

import type { Tier, TierConfig } from '../../types'
import { AlchemySymbolStrip } from '../branding/AlchemySymbolStrip'
import { Button } from '../ui/Button'

interface TierSelectorProps {
  tiers: TierConfig[]
  selectedTier: Tier | null
  onSelect: (tier: Tier) => void
  onContinue: () => void
}

function CheckMark() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M3.5 8.25 6.5 11 12.5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M8 2.2 9.35 6.65 13.8 8 9.35 9.35 8 13.8 6.65 9.35 2.2 8 6.65 6.65 8 2.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function TierSelector({ tiers, selectedTier, onSelect, onContinue }: TierSelectorProps) {
  const [ctaProgress, setCtaProgress] = useState(0)
  const [ctaWidthRatio, setCtaWidthRatio] = useState(0.62)
  const ticking = useRef(false)
  const tierChoiceRef = useRef<HTMLDivElement>(null)
  const prevTierForScrollRef = useRef<Tier | undefined>(undefined)

  /** On mobile, after changing Core/Pro, scroll so the tier row sits near the top — keeps bullets in view. */
  useEffect(() => {
    if (selectedTier === null) return
    if (prevTierForScrollRef.current === undefined) {
      prevTierForScrollRef.current = selectedTier
      return
    }
    if (prevTierForScrollRef.current === selectedTier) return
    prevTierForScrollRef.current = selectedTier

    if (!globalThis.matchMedia?.('(max-width: 639px)').matches) return

    const el = tierChoiceRef.current
    if (!el) return

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const top = el.getBoundingClientRect().top + window.scrollY
        const offset = 10
        window.scrollTo({ top: Math.max(0, top - offset), behavior: 'smooth' })
      })
    })
  }, [selectedTier])

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

  const defaultTier = tiers.find((t) => t.id === 'pro') ?? tiers[0]
  const activeTier = tiers.find((t) => t.id === selectedTier) ?? defaultTier
  const coreTier = tiers.find((t) => t.id === 'core')
  const coreCount = coreTier?.bullets.length ?? 0
  const visibleBullets =
    activeTier.id === 'pro' && coreTier
      ? [
          ...coreTier.bullets.map((text) => ({ text, kind: 'core' as const })),
          ...activeTier.bullets.map((text) => ({ text, kind: 'pro' as const })),
        ]
      : activeTier.bullets.map((text) => ({ text, kind: 'core' as const }))

  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-gray-200 bg-white px-4 pt-6 pb-14 sm:px-6 sm:pb-14 shadow-sm">
      <header className="relative z-10 space-y-4 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-bold uppercase leading-[1.1] tracking-tight sm:text-3xl md:text-4xl">
            <span className="block text-gray-900">Build your brand kit</span>
            <span className="mt-0.5 block text-gray-500 sm:mt-1">in minutes</span>
          </h1>
          <p className="mt-1 text-sm font-light leading-relaxed text-gray-600 sm:mt-2 sm:text-base">
            Our kits help define your brand, ideal customer, voice, and visual direction so you can show up consistently.
          </p>
        </div>
      </header>

      <AlchemySymbolStrip />

      <div className="relative z-10 space-y-5 py-6">
        <div
          ref={tierChoiceRef}
          className="grid grid-cols-2 gap-1.5 rounded-xl border border-gray-200/80 bg-gray-50/80 p-1"
        >
          {tiers.map((tier) => {
            const active = activeTier.id === tier.id
            return (
              <div key={tier.id} className="relative">
                {tier.id === 'pro' ? (
                  <span
                    className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-full rounded-lg bg-gray-900 transition-all duration-200 ${
                      active ? '-translate-y-4 opacity-100' : 'translate-y-0 opacity-0'
                    }`}
                    aria-hidden
                  >
                    <span className="absolute left-1/2 top-1 -translate-x-1/2 whitespace-nowrap px-0.5 text-[8px] font-bold uppercase leading-none tracking-[0.12em] text-white">
                      AI Enhanced
                    </span>
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={() => onSelect(tier.id)}
                  className={`relative z-20 w-full rounded-lg border px-4 pb-3 pt-4 text-left transition-colors duration-150 ease-out sm:px-4 sm:pb-3 sm:pt-4 ${
                    active
                      ? 'border-gray-900 bg-white shadow-sm'
                      : 'border-transparent hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                    <span
                      className={`font-sans text-sm font-bold uppercase tracking-wider sm:text-base ${
                        active ? 'text-[#111]' : 'text-[#6b7280]'
                      }`}
                    >
                      {tier.name}
                    </span>
                    <span
                      className={`shrink-0 font-sans text-2xl font-light tracking-tight sm:text-3xl ${
                        active ? 'text-[#111]' : 'text-[#9ca3af]'
                      }`}
                    >
                      {tier.priceLabel}
                    </span>
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        <div className="px-1">
          <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
            {visibleBullets.map((bullet, index) => (
              <li
                key={`${bullet.kind}-${bullet.text}`}
                className={`flex items-start gap-3 ${
                  activeTier.id === 'pro' && index === coreCount ? 'mt-3 border-t border-gray-200/70 pt-3' : ''
                }`}
              >
                <span className={`mt-0.5 ${bullet.kind === 'pro' ? 'text-gray-900' : 'text-gray-400'}`}>
                  {bullet.kind === 'pro' ? <SparkIcon /> : <CheckMark />}
                </span>
                <span className={bullet.kind === 'pro' ? 'text-gray-900' : ''}>
                  {bullet.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="pointer-events-none fixed bottom-4 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 sm:w-[calc(100%-3rem)]"
      >
        <div className="flex w-full justify-center">
          <Button
            fullWidth={false}
            onClick={onContinue}
            disabled={!selectedTier}
            className="pointer-events-auto block origin-center rounded-full px-5 py-3 font-sans transition-all duration-200 ease-out"
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
