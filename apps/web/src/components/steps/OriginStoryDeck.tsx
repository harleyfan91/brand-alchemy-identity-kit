import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '../ui/Button'

export interface OriginStoryOption {
  id: string
  title: string
  description: string
  icon: string
}

interface OriginStoryDeckProps {
  options: OriginStoryOption[]
  selectedId: string
  onSelect: (id: string) => void
}

const SWIPE_PX = 56

export function OriginStoryDeck({ options, selectedId, onSelect }: OriginStoryDeckProps) {
  const initialIndex = Math.max(0, options.findIndex((o) => o.id === selectedId))
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [reducedMotion, setReducedMotion] = useState(false)
  const pointerStartX = useRef<number | null>(null)
  const regionRef = useRef<HTMLDivElement>(null)

  const count = options.length
  const active = options[activeIndex]

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const idx = options.findIndex((o) => o.id === selectedId)
    if (idx >= 0) setActiveIndex(idx)
  }, [selectedId, options])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => Math.max(0, i - 1))
  }, [])

  const goNext = useCallback(() => {
    setActiveIndex((i) => Math.min(count - 1, i + 1))
  }, [count])

  useEffect(() => {
    const el = regionRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  function onPointerDown(e: React.PointerEvent) {
    pointerStartX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerUp(e: React.PointerEvent) {
    const start = pointerStartX.current
    pointerStartX.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    if (start == null) return
    const dx = e.clientX - start
    if (dx < -SWIPE_PX) goNext()
    else if (dx > SWIPE_PX) goPrev()
  }

  const transitionClass = reducedMotion ? '' : 'transition-transform duration-300 ease-out'

  return (
    <div className="space-y-4">
      <p className="text-xs leading-snug text-zinc-600">
        Swipe or use the arrows to browse. When one fits, confirm below.
      </p>

      <div
        ref={regionRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Brand origin story options"
        className="rounded-2xl outline-none ring-zinc-900 focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <div className="relative w-full overflow-hidden rounded-2xl">
          {/* Stacked depth behind the deck */}
          <div
            className="pointer-events-none absolute inset-x-6 top-3 bottom-0 -z-10 rounded-2xl border border-zinc-200/80 bg-zinc-100/90 shadow-sm"
            style={{ transform: 'scale(0.96) translateY(8px)' }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-3 top-1.5 bottom-0 -z-20 rounded-2xl border border-zinc-200/60 bg-zinc-50 shadow-sm"
            style={{ transform: 'scale(0.98) translateY(4px)' }}
            aria-hidden
          />

          <div
            className="touch-pan-x"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              pointerStartX.current = null
            }}
          >
            <div
              className={`flex ${transitionClass}`}
              style={{
                width: `${count * 100}%`,
                transform: `translateX(-${(activeIndex / count) * 100}%)`,
              }}
            >
              {options.map((option) => (
                <article
                  key={option.id}
                  className="shrink-0 px-1 pb-1"
                  style={{ flex: `0 0 ${100 / count}%` }}
                  aria-hidden={option.id !== active.id}
                >
                  <div
                    className={`min-h-[148px] rounded-2xl border bg-white p-5 shadow-md ${
                      selectedId === option.id ? 'border-zinc-900 ring-1 ring-zinc-900/10' : 'border-zinc-200'
                    }`}
                  >
                    <p className="text-2xl text-zinc-700">{option.icon}</p>
                    <h2 className="mt-2 text-base font-semibold leading-snug text-zinc-900">{option.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{option.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={goPrev}
            disabled={activeIndex <= 0}
            aria-label="Previous origin story"
          >
            Previous
          </Button>
          <span className="text-xs tabular-nums text-zinc-500" aria-live="polite">
            {activeIndex + 1} / {count}
          </span>
          <Button
            type="button"
            variant="secondary"
            onClick={goNext}
            disabled={activeIndex >= count - 1}
            aria-label="Next origin story"
          >
            Next
          </Button>
        </div>

        <div className="mt-3 flex justify-center gap-1.5" role="group" aria-label="Story slides">
          {options.map((option, i) => (
            <button
              key={option.id}
              type="button"
              aria-current={i === activeIndex ? 'true' : undefined}
              aria-label={`${option.title}, story ${i + 1} of ${count}`}
              className={`h-2 w-2 rounded-full transition ${
                i === activeIndex ? 'bg-zinc-900' : 'bg-zinc-300 hover:bg-zinc-400'
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>

        <div className="mt-5">
          <Button
            type="button"
            fullWidth
            onClick={() => onSelect(active.id)}
            aria-pressed={selectedId === active.id}
          >
            {selectedId === active.id ? 'Selected — this is my story' : 'This sounds like me'}
          </Button>
        </div>
      </div>
    </div>
  )
}
