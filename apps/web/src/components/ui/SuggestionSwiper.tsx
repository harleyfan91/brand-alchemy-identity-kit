import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * One page inside the {@link SuggestionSwiper}. A page is a single suggestion
 * surface (e.g. "From your logo" or "From your reference image") containing a
 * row of hex chips plus an optional accept action.
 */
export interface SuggestionPage {
  /** Stable identity (also used to key the dot button). */
  id: string
  /** Short title that anchors the source of the suggestions. */
  title: string
  /** Hex strings displayed as chips, in display order. */
  hexes: string[]
  /** Optional CTA label (e.g. "Use these colors"). Omit to render no button. */
  actionLabel?: string
  /** Required when `actionLabel` is provided. */
  onAccept?: () => void
  /**
   * Visually flips the action button to an "active / currently in use" state
   * (filled dark fill, check-mark prefix) when the suggestion set already
   * matches downstream state. The button remains clickable so the buyer can
   * re-apply after editing chips manually, but the visual cue replaces any
   * "already applied" subtitle text that would otherwise eat vertical space.
   */
  actionApplied?: boolean
  /**
   * Disables the action button without removing it — preserves vertical
   * rhythm when an action is contextually unavailable. Kept for future
   * consumers; today's {@link HexColorChips} usage always leaves it false
   * because replace-on-tap always has something to do.
   */
  actionDisabled?: boolean
}

interface SuggestionSwiperProps {
  pages: SuggestionPage[]
  /** Region label for assistive tech. Defaults to a generic carousel label. */
  ariaLabel?: string
}

/**
 * Lightweight paginated swiper for short stacks of related suggestion cards.
 *
 * - 0 pages → renders nothing.
 * - 1 page  → renders a single static card (no dots, no scrolling chrome).
 * - 2+      → renders a single gray pillow card whose interior is a CSS
 *             scroll-snap viewport plus a centered dot indicator. The dots
 *             live INSIDE the card so the whole surface reads as one section
 *             of the form (no detached row of dots hanging below).
 *
 * Built on native scroll-snap rather than a transform-based carousel so that
 * mobile touch inertia, keyboard scrolling, and reduced-motion preferences
 * all behave the way the OS expects with zero extra code. An
 * IntersectionObserver (scoped to the scroll container) tracks which page is
 * dominantly visible so the dot indicator stays in sync during swipe gestures.
 *
 * Width containment: the scroll viewport is locked to its parent's width via
 * `w-full min-w-0`, and each slide is `basis-full shrink-0 min-w-0 max-w-full`.
 * The combination is deliberate — `basis-full` makes each slide *exactly* one
 * scroll-container width (so `flex-wrap` inside has a concrete boundary to
 * wrap chips against), `shrink-0` keeps the page from collapsing under flex
 * pressure, `min-w-0` overrides the default `min-width: auto` that would
 * otherwise let an intrinsic content row force the slide wider than 100%,
 * and `max-w-full` belt-and-suspenders against the same growth.
 *
 * The earlier `min-w-full` variant only set a *minimum* of 100% — chips on a
 * single row could still push the slide past 100% and overflow the card.
 * `basis-full + max-w-full` makes 100% both a floor and a ceiling.
 */
export function SuggestionSwiper({ pages, ariaLabel }: SuggestionSwiperProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLDivElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (pages.length <= 1) return
    const container = scrollRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!best) return
        const idx = slideRefs.current.findIndex((el) => el === best.target)
        if (idx >= 0) setActiveIndex(idx)
      },
      { root: container, threshold: [0.55, 0.85] },
    )

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [pages.length])

  const goTo = useCallback((idx: number) => {
    const el = slideRefs.current[idx]
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }, [])

  if (pages.length === 0) return null

  if (pages.length === 1) {
    return (
      <div className="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3">
        <SuggestionPageBody page={pages[0]!} />
      </div>
    )
  }

  return (
    <div className="w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3">
      <div
        ref={scrollRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel ?? 'Color suggestions'}
        className="flex w-full min-w-0 snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {pages.map((page, idx) => (
          <div
            key={page.id}
            ref={(el) => {
              slideRefs.current[idx] = el
            }}
            className="min-w-0 max-w-full shrink-0 basis-full snap-start"
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${pages.length}`}
          >
            <SuggestionPageBody page={page} />
          </div>
        ))}
      </div>
      <div
        className="mt-3 flex justify-center gap-1.5"
        role="tablist"
        aria-label="Suggestion pages"
      >
        {pages.map((page, idx) => {
          const isActive = idx === activeIndex
          return (
            <button
              key={page.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Show ${page.title} (page ${idx + 1} of ${pages.length})`}
              onClick={() => goTo(idx)}
              className={`h-2 rounded-full transition-all ${
                isActive ? 'w-4 bg-gray-900' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}

function SuggestionPageBody({ page }: { page: SuggestionPage }) {
  const applied = page.actionApplied === true
  return (
    /*
      Title stays left-aligned as a section eyebrow. The chip row and the
      action button are explicitly centered via their own wrappers so the
      collection of swatches and the CTA read as a centered cluster under a
      left-anchored label. `w-full` on the chip row preserves the flex-wrap
      boundary so chips wrap inside the slide width.
    */
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
        {page.title}
      </p>
      <div className="mt-2 flex w-full flex-wrap justify-center gap-2">
        {page.hexes.map((hex) => (
          <span
            key={hex}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700"
          >
            <span
              className="inline-block h-3 w-3 rounded-full border border-gray-300"
              style={{ backgroundColor: hex }}
            />
            {hex.toUpperCase()}
          </span>
        ))}
      </div>
      {page.actionLabel && page.onAccept ? (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={page.onAccept}
            disabled={page.actionDisabled}
            aria-pressed={applied}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
              applied
                ? 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800 disabled:hover:bg-gray-900'
                : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-100 disabled:hover:bg-white'
            }`}
          >
            {applied ? <CheckIcon className="h-3.5 w-3.5" /> : null}
            {page.actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
