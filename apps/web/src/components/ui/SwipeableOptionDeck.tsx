import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Button } from './Button'

export interface SwipeableDeckOption {
  id: string
  title: string
  description: string
}

interface SwipeableOptionDeckProps {
  options: SwipeableDeckOption[]
  selectedId: string
  onSelect: (id: string) => void
  /** Carousel region label for assistive tech */
  ariaLabel: string
  prevAriaLabel?: string
  nextAriaLabel?: string
  dotGroupAriaLabel?: string
  /** Tailwind height class for cards (default matches origin-story density). */
  cardClassName?: string
}

const SWIPE_PX = 56
const SLIDE_WIDTH_RATIO = 0.85
const GAP_PX = 12

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const DEFAULT_CARD_CLASS =
  'flex h-[220px] flex-col rounded-2xl border-2 p-4 shadow-md transition-[box-shadow,background-color,border-color] sm:h-[240px] sm:p-5'

export function SwipeableOptionDeck({
  options,
  selectedId,
  onSelect,
  ariaLabel,
  prevAriaLabel = 'Previous option',
  nextAriaLabel = 'Next option',
  dotGroupAriaLabel = 'Slides',
  cardClassName = DEFAULT_CARD_CLASS,
}: SwipeableOptionDeckProps) {
  const initialIndex = Math.max(0, options.findIndex((o) => o.id === selectedId))
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [viewportW, setViewportW] = useState(0)
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const regionRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  const count = options.length
  const active = options[activeIndex]

  const slideWidthPx = viewportW > 0 ? Math.round(viewportW * SLIDE_WIDTH_RATIO) : 0
  const stepPx = slideWidthPx + GAP_PX
  const translateX = slideWidthPx > 0 ? -(activeIndex * stepPx) : 0

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const measure = () => setViewportW(el.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(() => measure())
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

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
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
  }

  function onPointerUp(e: React.PointerEvent) {
    const start = pointerStartRef.current
    pointerStartRef.current = null
    if (start == null) return

    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    // Ignore primarily vertical drags so the page can scroll; only count clear horizontal swipes.
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return
    if (dx < 0) goNext()
    else goPrev()
  }

  const transitionClass = reducedMotion ? '' : 'transition-transform duration-300 ease-out'

  return (
    <div className="w-full min-w-0">
      <div
        ref={regionRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className="w-full min-w-0 rounded-2xl outline-none ring-zinc-900 focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <div ref={viewportRef} className="relative w-full min-w-0 overflow-hidden rounded-2xl">
          <div
            className="pointer-events-none absolute inset-x-4 top-3 bottom-0 -z-10 rounded-2xl border border-zinc-200/80 bg-zinc-100/90 shadow-sm sm:inset-x-6"
            style={{ transform: 'scale(0.96) translateY(8px)' }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-2 top-1.5 bottom-0 -z-20 rounded-2xl border border-zinc-200/60 bg-zinc-50 shadow-sm sm:inset-x-3"
            style={{ transform: 'scale(0.98) translateY(4px)' }}
            aria-hidden
          />

          <div
            className="touch-manipulation"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              pointerStartRef.current = null
            }}
          >
            <div
              className={`flex gap-3 ${transitionClass}`}
              style={{
                transform: `translateX(${translateX}px)`,
              }}
            >
              {options.map((option, i) => {
                const isSelected = selectedId === option.id
                const indexLabel = String(i + 1).padStart(2, '0')
                return (
                  <article
                    key={option.id}
                    className="shrink-0 pb-1"
                    style={{
                      width: slideWidthPx > 0 ? slideWidthPx : '100%',
                      minWidth: slideWidthPx > 0 ? slideWidthPx : undefined,
                    }}
                    aria-hidden={option.id !== active?.id}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-label={`${option.title}. Tap to select.`}
                      onClick={() => onSelect(option.id)}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter' || ev.key === ' ') {
                          ev.preventDefault()
                          onSelect(option.id)
                        }
                      }}
                      className={`${cardClassName} ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-100 shadow-lg'
                          : 'border-zinc-200 bg-white hover:border-zinc-400'
                      }`}
                    >
                      <span
                        className={`text-[2.25rem] font-semibold leading-none tabular-nums tracking-tight sm:text-[2.75rem] ${
                          isSelected ? 'text-zinc-900' : 'text-zinc-300'
                        }`}
                        aria-hidden
                      >
                        {indexLabel}
                      </span>
                      <h2 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-zinc-900 sm:mt-4">
                        {option.title}
                      </h2>
                      <p className="mt-1.5 min-h-0 flex-1 text-sm leading-relaxed text-zinc-600 line-clamp-4 sm:mt-2 sm:line-clamp-5">
                        {option.description}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-3 flex shrink-0 items-center justify-center gap-4 border-t border-zinc-100 pt-3 sm:mt-4 sm:gap-6 sm:pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={goPrev}
            disabled={activeIndex <= 0}
            aria-label={prevAriaLabel}
            className="shrink-0 px-3 py-2.5"
          >
            <ChevronLeftIcon className="text-zinc-900" />
          </Button>
          <span className="min-w-[3.5rem] shrink-0 text-center text-xs tabular-nums text-zinc-500" aria-live="polite">
            {activeIndex + 1} / {count}
          </span>
          <Button
            type="button"
            variant="secondary"
            onClick={goNext}
            disabled={activeIndex >= count - 1}
            aria-label={nextAriaLabel}
            className="shrink-0 px-3 py-2.5"
          >
            <ChevronRightIcon className="text-zinc-900" />
          </Button>
        </div>

        <div
          className="relative z-10 mt-3 flex shrink-0 justify-center gap-1.5 sm:mt-3"
          role="group"
          aria-label={dotGroupAriaLabel}
        >
          {options.map((option, i) => {
            const isActive = i === activeIndex
            const isPicked = selectedId === option.id
            return (
              <button
                key={option.id}
                type="button"
                aria-current={isActive ? 'true' : undefined}
                aria-label={`${option.title}, option ${i + 1} of ${count}${isPicked ? ', selected' : ''}`}
                className={`h-2.5 min-h-[10px] w-2.5 min-w-[10px] shrink-0 rounded-full transition ${
                  isActive
                    ? 'bg-zinc-900'
                    : isPicked
                      ? 'bg-zinc-600 ring-2 ring-zinc-900 ring-offset-2 ring-offset-zinc-50'
                      : 'bg-zinc-300 hover:bg-zinc-400'
                }`}
                onClick={() => setActiveIndex(i)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
