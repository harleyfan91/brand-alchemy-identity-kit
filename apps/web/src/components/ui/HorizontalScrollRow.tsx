import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

/** Surface color the row sits on. Edge fades blend to this color so the
 * gradient looks like the row is sliding under the container background,
 * whatever color that happens to be. */
const SCROLL_ROW_SURFACE_VAR = '--scroll-row-surface'
const SCROLL_ROW_SURFACE_DEFAULT = '#ffffff'

interface HorizontalScrollRowProps {
  children: ReactNode
  /** Classes applied to the inner scrollable flex container. */
  rowClassName?: string
  /** Override the background color used in the edge fades. */
  surfaceColor?: string
  /** Width of the fade in tailwind size units (1 = 0.25rem). Default 6. */
  fadeWidthClass?: string
  'aria-label'?: string
}

export function HorizontalScrollRow({
  children,
  rowClassName,
  surfaceColor = SCROLL_ROW_SURFACE_DEFAULT,
  fadeWidthClass = 'w-6',
  'aria-label': ariaLabel,
}: HorizontalScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  })

  const update = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const left = el.scrollLeft > 1
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    setEdges((prev) =>
      prev.left === left && prev.right === right ? prev : { left, right },
    )
  }, [])

  useLayoutEffect(() => {
    update()
  }, [update, children])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update])

  return (
    <div
      style={{ [SCROLL_ROW_SURFACE_VAR]: surfaceColor } as CSSProperties}
      className="relative"
    >
      <div
        ref={scrollRef}
        onScroll={update}
        aria-label={ariaLabel}
        className={`flex overflow-x-auto ${rowClassName ?? ''}`}
      >
        {children}
      </div>
      <div
        aria-hidden
        style={{
          backgroundImage: `linear-gradient(to right, var(${SCROLL_ROW_SURFACE_VAR}), transparent)`,
        }}
        className={`pointer-events-none absolute inset-y-0 left-0 ${fadeWidthClass} transition-opacity duration-150 ${
          edges.left ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        aria-hidden
        style={{
          backgroundImage: `linear-gradient(to left, var(${SCROLL_ROW_SURFACE_VAR}), transparent)`,
        }}
        className={`pointer-events-none absolute inset-y-0 right-0 ${fadeWidthClass} transition-opacity duration-150 ${
          edges.right ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
