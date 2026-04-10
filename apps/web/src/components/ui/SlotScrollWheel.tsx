import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type KeyboardEvent } from 'react'

import type { Step1ControlledOption } from '../../data/step1ControlledOptions'
import type { Step1WheelDensity, Step1WheelTypeface } from '../../config/step1UxVariants'
import { lightSelectionHaptic } from '../../utils/haptics'

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
  density?: Step1WheelDensity
  typeface?: Step1WheelTypeface
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
  density = 'compact',
  typeface = 'serif',
  onCenteredDescriptionChange,
}: SlotScrollWheelProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const draggingRef = useRef(false)
  const hintRafRef = useRef<number | null>(null)

  const metrics = useMemo(() => {
    if (density === 'comfortable') {
      return { itemPx: 52, rows: 5, maxWMobile: 168, textClass: 'text-[1.05rem] sm:text-lg' }
    }
    return { itemPx: 44, rows: 3, maxWMobile: 144, textClass: 'text-[0.98rem] sm:text-lg' }
  }, [density])

  const itemPx = metrics.itemPx
  const viewportPx = itemPx * metrics.rows
  const padPx = (viewportPx - itemPx) / 2

  const indexForValue = useCallback(() => {
    const i = options.findIndex((o) => o.id === value)
    return i < 0 ? 0 : i
  }, [options, value])

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'auto') => {
      const el = scrollerRef.current
      if (!el) return
      const clamped = Math.min(Math.max(0, index), Math.max(0, options.length - 1))
      el.scrollTo({ top: clamped * itemPx, behavior })
    },
    [itemPx, options.length],
  )

  const emitCenteredDescription = useCallback(() => {
    if (!onCenteredDescriptionChange) return
    const el = scrollerRef.current
    if (!el || options.length === 0) return
    const idx = Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / itemPx)))
    const raw = options[idx]?.description?.trim()
    onCenteredDescriptionChange({
      wheelId: instanceId,
      description: raw && raw.length > 0 ? raw : null,
    })
  }, [instanceId, itemPx, onCenteredDescriptionChange, options])

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
    el.scrollTop = idx * itemPx
  }, [value, syncKey, options, indexForValue, itemPx])

  useEffect(
    () => () => {
      if (hintRafRef.current != null) cancelAnimationFrame(hintRafRef.current)
    },
    [],
  )

  const commitFromScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el || options.length === 0) return
    const raw = el.scrollTop / itemPx
    const idx = Math.min(options.length - 1, Math.max(0, Math.round(raw)))
    const nextId = options[idx]?.id
    if (nextId === undefined) return
    if (nextId !== value) {
      lightSelectionHaptic()
      onChange(nextId)
    }
    if (Math.abs(el.scrollTop - idx * itemPx) > 0.5) {
      el.scrollTo({ top: idx * itemPx, behavior: 'smooth' })
    }
    emitCenteredDescription()
  }, [emitCenteredDescription, itemPx, onChange, options, value])

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

  return (
    <div
      className={`wheel-slot inline-block min-w-0 w-full align-middle sm:w-auto ${density === 'comfortable' ? 'sm:max-w-[13rem]' : 'sm:max-w-[11rem]'}`}
      style={{ maxWidth: metrics.maxWMobile }}
    >
      <div
        className="relative overflow-hidden rounded-2xl outline-none ring-gray-900/30 focus-visible:ring-2"
        style={{ height: viewportPx }}
        tabIndex={0}
        role="listbox"
        aria-label={ariaLabel}
        aria-activedescendant={active ? `wheel-${instanceId}-${active.id}` : undefined}
        onKeyDown={onKeyDown}
        onFocus={emitCenteredDescription}
        onBlur={() => onCenteredDescriptionChange?.({ wheelId: instanceId, description: null })}
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
          <div style={{ height: padPx }} aria-hidden />
          {options.map((opt) => {
            const selected = opt.id === value
            return (
              <div
                id={`wheel-${instanceId}-${opt.id}`}
                key={opt.id}
                role="option"
                aria-selected={selected}
                className="flex shrink-0 items-center justify-center px-2 text-center"
                style={{ height: itemPx }}
              >
                <span
                  className={`line-clamp-2 leading-tight sm:leading-snug ${metrics.textClass} ${
                    typeface === 'serif' ? 'font-serif' : 'font-sans'
                  } ${selected ? 'font-semibold text-gray-900' : 'font-normal text-gray-400'}`}
                >
                  {opt.label}
                </span>
              </div>
            )
          })}
          <div style={{ height: padPx }} aria-hidden />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 border-y border-gray-200/90 bg-gradient-to-r from-gray-100/50 via-gray-50/30 to-gray-100/50"
          style={{ height: itemPx }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-white from-35% via-white/80 to-transparent"
          style={{ height: padPx }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white from-35% via-white/80 to-transparent"
          style={{ height: padPx }}
          aria-hidden
        />
      </div>
      {error ? <p className="mt-1.5 text-center font-sans text-[11px] text-red-600 sm:text-xs">{error}</p> : null}
    </div>
  )
}
