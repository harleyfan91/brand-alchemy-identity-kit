import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { FaChevronDown } from 'react-icons/fa6'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  id: string
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  invalid?: boolean
  describedby?: string
  ariaLabelledby?: string
}

/** Minimum height the dropdown should claim before considering a flip. */
const MIN_LIST_HEIGHT = 200
/** Edge padding so the list never touches the viewport edge. */
const VIEWPORT_PADDING = 8
/** Surface color the list sits on. Edge fades blend to this same color, so the
 * gradient looks correct whatever surface we change to (white today, could be a
 * card / panel color later). */
const DROPDOWN_SURFACE_VAR = '--dropdown-surface'
const DROPDOWN_SURFACE_DEFAULT = '#ffffff'

export function Dropdown({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select one',
  invalid,
  describedby,
  ariaLabelledby,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const i = options.findIndex((o) => o.value === value)
    return i >= 0 ? i : 0
  })
  const [placement, setPlacement] = useState<'below' | 'above'>('below')
  const [maxHeight, setMaxHeight] = useState<number | null>(null)
  const [overflow, setOverflow] = useState<{ top: boolean; bottom: boolean }>({ top: false, bottom: false })

  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typeBufferRef = useRef<{ buffer: string; timeout: ReturnType<typeof setTimeout> | null }>({
    buffer: '',
    timeout: null,
  })

  const selectedOption = options.find((o) => o.value === value) ?? null
  const listboxId = `${id}-listbox`

  const updateOverflow = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const top = el.scrollTop > 1
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1
    setOverflow((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }))
  }, [])

  const scrollIntoView = useCallback(
    (idx: number) => {
      requestAnimationFrame(() => {
        const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${idx}"]`)
        el?.scrollIntoView({ block: 'nearest' })
        updateOverflow()
      })
    },
    [updateOverflow],
  )

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setMaxHeight(null)
      return
    }
    const measure = () => {
      const button = buttonRef.current
      if (!button) return
      const rect = button.getBoundingClientRect()
      const spaceBelow = Math.max(0, window.innerHeight - rect.bottom - VIEWPORT_PADDING)
      const spaceAbove = Math.max(0, rect.top - VIEWPORT_PADDING)
      const useBelow = spaceBelow >= MIN_LIST_HEIGHT || spaceBelow >= spaceAbove
      const available = useBelow ? spaceBelow : spaceAbove
      setPlacement(useBelow ? 'below' : 'above')
      setMaxHeight(Math.max(MIN_LIST_HEIGHT, available))
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setOverflow({ top: false, bottom: false })
      return
    }
    const selIdx = options.findIndex((o) => o.value === value)
    const idx = selIdx >= 0 ? selIdx : 0
    setActiveIndex(idx)
    requestAnimationFrame(() => {
      listRef.current?.focus()
      scrollIntoView(idx)
    })
  }, [open, options, scrollIntoView, value])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (buttonRef.current?.contains(target)) return
      if (listRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const commit = useCallback(
    (option: DropdownOption) => {
      onChange(option.value)
      setOpen(false)
      requestAnimationFrame(() => buttonRef.current?.focus())
    },
    [onChange],
  )

  const moveActive = useCallback(
    (delta: number) => {
      setActiveIndex((prev) => {
        const next = Math.max(0, Math.min(options.length - 1, prev + delta))
        scrollIntoView(next)
        return next
      })
    },
    [options.length, scrollIntoView],
  )

  const setActive = useCallback(
    (idx: number) => {
      setActiveIndex(idx)
      scrollIntoView(idx)
    },
    [scrollIntoView],
  )

  const typeJump = useCallback(
    (char: string) => {
      const buffer = typeBufferRef.current
      if (buffer.timeout) clearTimeout(buffer.timeout)
      buffer.buffer += char.toLowerCase()
      const search = buffer.buffer
      const matchIdx = options.findIndex((o) => o.label.toLowerCase().startsWith(search))
      if (matchIdx >= 0) setActive(matchIdx)
      buffer.timeout = setTimeout(() => {
        buffer.buffer = ''
      }, 500)
    },
    [options, setActive],
  )

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (open) return
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
        event.preventDefault()
        setOpen(true)
        break
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault()
          setOpen(true)
          typeJump(event.key)
        }
    }
  }

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        buttonRef.current?.focus()
        break
      case 'ArrowDown':
        event.preventDefault()
        moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveActive(-1)
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(options.length - 1)
        break
      case 'Enter':
      case ' ': {
        event.preventDefault()
        const opt = options[activeIndex]
        if (opt) commit(opt)
        break
      }
      case 'Tab':
        setOpen(false)
        break
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          typeJump(event.key)
        }
    }
  }

  const borderClass = invalid
    ? 'border-red-400 focus:border-red-500'
    : open
      ? 'border-gray-500'
      : 'border-gray-300 focus:border-gray-500'

  const listPositionClass = placement === 'below' ? 'top-full mt-1' : 'bottom-full mb-1'

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedby}
        aria-labelledby={ariaLabelledby}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
        style={{ touchAction: 'manipulation' }}
        className={`box-border flex w-full min-h-14 items-center justify-between rounded-xl border bg-white px-3 py-3 text-left text-base leading-normal outline-none focus-visible:ring-2 focus-visible:ring-gray-400/35 sm:text-sm ${borderClass}`}
      >
        <span className={selectedOption ? 'truncate text-gray-900' : 'truncate text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown
          className={`ml-2 h-4 w-4 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          style={{ [DROPDOWN_SURFACE_VAR]: DROPDOWN_SURFACE_DEFAULT } as CSSProperties}
          className={`absolute left-0 right-0 z-40 overflow-hidden rounded-xl border border-gray-200 shadow-lg ${listPositionClass}`}
        >
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={`${id}-option-${activeIndex}`}
            onKeyDown={onListKeyDown}
            onScroll={updateOverflow}
            style={{
              maxHeight: maxHeight ?? undefined,
              background: `var(${DROPDOWN_SURFACE_VAR})`,
            }}
            className="overflow-auto py-1 outline-none"
          >
            {options.map((option, i) => (
              <li
                key={option.value}
                id={`${id}-option-${i}`}
                role="option"
                aria-selected={option.value === value}
                data-index={i}
                onPointerDown={(event) => {
                  event.preventDefault()
                }}
                onClick={() => commit(option)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`cursor-pointer px-3 py-3 text-base text-gray-900 sm:text-sm ${
                  i === activeIndex ? 'bg-gray-100' : ''
                } ${option.value === value ? 'font-medium' : ''}`}
                style={{ touchAction: 'manipulation' }}
              >
                {option.label}
              </li>
            ))}
          </ul>
          <div
            aria-hidden
            style={{
              backgroundImage: `linear-gradient(to bottom, var(${DROPDOWN_SURFACE_VAR}), transparent)`,
            }}
            className={`pointer-events-none absolute inset-x-0 top-0 h-6 transition-opacity duration-150 ${
              overflow.top ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            aria-hidden
            style={{
              backgroundImage: `linear-gradient(to top, var(${DROPDOWN_SURFACE_VAR}), transparent)`,
            }}
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-6 transition-opacity duration-150 ${
              overflow.bottom ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      ) : null}
    </div>
  )
}
