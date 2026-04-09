import { useCallback, useEffect, useLayoutEffect, useRef, type KeyboardEvent } from 'react'

import type { Step1ControlledOption } from '../../data/step1ControlledOptions'
import { lightSelectionHaptic } from '../../utils/haptics'

const ITEM_PX = 44
const VISIBLE_ROWS = 3
const VIEWPORT_PX = ITEM_PX * VISIBLE_ROWS
const PAD_PX = (VIEWPORT_PX - ITEM_PX) / 2

export type CenteredDescriptionPayload = { wheelId: string; description: string | null }

interface SlotScrollWheelProps {
  instanceId: string
  options: Step1ControlledOption[]
  value: string
  onChange: (id: string) => void
  ariaLabel: string
  /** Bump when option lists reset (e.g. industry change) so scroll position re-syncs. */
  syncKey?: string
  error?: string
  /** Fired while scrolling and when focus/selection changes — parent shows one shared helper. */
  onCenteredDescriptionChange?: (payload: CenteredDescriptionPayload) => void
}

export function SlotScrollWheel({
  instanceId,
  options,
  value,
  onChange,
  ariaLabel,
  syncKey = '',
  error,
  onCenteredDescriptionChange,
}: SlotScrollWheelProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const draggingRef = useRef(false)
  const hintRafRef = useRef<number | null>(null)

  const indexForValue = useCallback(() => {
    const i = options.findIndex((o) => o.id === value)
    return i < 0 ? 0 : i
  }, [options, value])

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'auto') => {
      const el = scrollerRef.current
      if (!el) return
      const clamped = Math.min(Math.max(0, index), Math.max(0, options.length - 1))
      el.scrollTo({ top: clamped * ITEM_PX, behavior })
    },
    [options.length],
  )

  const emitCenteredDescription = useCallback(() => {
    if (!onCenteredDescriptionChange) return
    const el = scrollerRef.current
    if (!el || options.length === 0) return
    const idx = Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM_PX)))
    const raw = options[idx]?.description?.trim()
    onCenteredDescriptionChange({
      wheelId: instanceId,
      description: raw && raw.length > 0 ? raw : null,
    })
  }, [instanceId, onCenteredDescriptionChange, options])

  const scheduleHintEmit = useCallback(() => {
    if (!onCenteredDescriptionChange) return
    if (hintRafRef.current != null) cancelAnimationFrame(hintRafRef.current)
    hintRafRef.current = requestAnimationFrame(() => {
      hintRafRef.current = null
      emitCenteredDescription()
    })
  }, [emitCenteredDescription, onCenteredDescriptionChange])

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el || options.length === 0) return
    const idx = indexForValue()
    el.scrollTop = idx * ITEM_PX
  }, [value, syncKey, options, indexForValue])

  useEffect(
    () => () => {
      if (hintRafRef.current != null) cancelAnimationFrame(hintRafRef.current)
    },
    [],
  )

  const commitFromScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el || options.length === 0) return
    const raw = el.scrollTop / ITEM_PX
    const idx = Math.min(options.length - 1, Math.max(0, Math.round(raw)))
    const nextId = options[idx]?.id
    if (nextId === undefined) return
    if (nextId !== value) {
      lightSelectionHaptic()
      onChange(nextId)
    }
    if (Math.abs(el.scrollTop - idx * ITEM_PX) > 0.5) {
      el.scrollTo({ top: idx * ITEM_PX, behavior: 'smooth' })
    }
    emitCenteredDescription()
  }, [emitCenteredDescription, onChange, options, value])

  const onScroll = () => {
    scheduleHintEmit()
    if (settleRef.current) clearTimeout(settleRef.current)
    settleRef.current = setTimeout(() => {
      settleRef.current = null
      if (!draggingRef.current) commitFromScroll()
    }, 120)
  }

  useEffect(
    () => () => {
      if (settleRef.current) clearTimeout(settleRef.current)
    },
    [],
  )

  const bumpSelection = (nextIdx: number) => {
    const next = options[nextIdx]
    if (!next || next.id === value) {
      scrollToIndex(nextIdx, 'smooth')
      return
    }
    lightSelectionHaptic()
    scrollToIndex(nextIdx, 'smooth')
    onChange(next.id)
    const raw = next.description?.trim()
    onCenteredDescriptionChange?.({
      wheelId: instanceId,
      description: raw && raw.length > 0 ? raw : null,
    })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const idx = indexForValue()
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      bumpSelection(Math.min(options.length - 1, idx + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      bumpSelection(Math.max(0, idx - 1))
    }
  }

  const active = options[indexForValue()]

  const clearHintIfMine = () => {
    onCenteredDescriptionChange?.({ wheelId: instanceId, description: null })
  }

  return (
    <div className="wheel-slot inline-block min-w-0 max-w-[min(100%,9rem)] align-middle sm:max-w-[11rem]">
      <div
        className="relative overflow-hidden rounded-2xl outline-none ring-gray-900/30 focus-visible:ring-2"
        style={{ height: VIEWPORT_PX }}
        tabIndex={0}
        role="listbox"
        aria-label={ariaLabel}
        aria-activedescendant={active ? `wheel-${instanceId}-${active.id}` : undefined}
        onKeyDown={onKeyDown}
        onFocus={() => {
          emitCenteredDescription()
        }}
        onBlur={() => {
          clearHintIfMine()
        }}
      >
        <div
          ref={scrollerRef}
          className="h-full overflow-y-auto overscroll-y-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onScroll={onScroll}
          onPointerDown={() => {
            draggingRef.current = true
            emitCenteredDescription()
          }}
          onPointerUp={() => {
            draggingRef.current = false
            commitFromScroll()
          }}
          onPointerLeave={() => {
            draggingRef.current = false
          }}
        >
          <div style={{ height: PAD_PX }} aria-hidden />
          {options.map((opt) => {
            const selected = opt.id === value
            return (
              <div
                id={`wheel-${instanceId}-${opt.id}`}
                key={opt.id}
                role="option"
                aria-selected={selected}
                className="flex shrink-0 items-center justify-center px-2 text-center"
                style={{ height: ITEM_PX }}
              >
                <span
                  className={`line-clamp-2 font-serif text-[0.98rem] leading-tight sm:text-lg sm:leading-snug ${
                    selected ? 'font-semibold text-gray-900' : 'font-normal text-gray-400'
                  }`}
                >
                  {opt.label}
                </span>
              </div>
            )
          })}
          <div style={{ height: PAD_PX }} aria-hidden />
        </div>
        {/* Soft selection band — no hard box */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-[44px] -translate-y-1/2 border-y border-gray-200/90 bg-gradient-to-r from-gray-100/50 via-gray-50/30 to-gray-100/50"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-white from-40% via-white/85 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white from-40% via-white/85 to-transparent"
          aria-hidden
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-center font-sans text-[11px] text-red-600 sm:text-xs">{error}</p>
      ) : null}
    </div>
  )
}
