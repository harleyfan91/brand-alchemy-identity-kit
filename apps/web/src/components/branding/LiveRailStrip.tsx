import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { type SymbolId, getStripLayout } from '@identity-kit/brand-assets'

import type { VoiceMood } from '../../utils/voicePreview'

interface LiveRailStripProps {
  isActive: boolean
  content: string
  mood: VoiceMood
  className?: string
}

function SymbolGlyph({ id }: { id: SymbolId }) {
  if (id === 'sun') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="7" />
        <circle cx="50" cy="50" r="6" fill="currentColor" />
      </svg>
    )
  }

  if (id === 'mercury') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <path
          d="M34 20 C34 40, 66 40, 66 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="50" cy="49" r="14" fill="none" stroke="currentColor" strokeWidth="7" />
        <line x1="50" y1="63" x2="50" y2="83" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <line x1="36" y1="73" x2="64" y2="73" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'fire') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon
          points="50,24 80,76 20,76"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (id === 'sulfur') {
    return (
      <svg viewBox="0 0 100 102" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon
          points="50,28 74,64 26,64"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <line x1="50" y1="64" x2="50" y2="88" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <line x1="26" y1="77" x2="74" y2="77" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'air') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon
          points="50,24 80,76 20,76"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <line x1="24" y1="50" x2="76" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'salt') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="7" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  if (id === 'earth') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden="true">
        <polygon
          points="20,24 80,24 50,76"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <line x1="24" y1="50" x2="76" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
    )
  }

  return null
}

const moodGradientClass: Record<VoiceMood, string> = {
  calm: 'bg-gradient-to-r from-sky-400 to-teal-500',
  warm: 'bg-gradient-to-r from-rose-400 to-orange-400',
  bold: 'bg-gradient-to-r from-amber-400 to-red-500',
  neutral: 'bg-gradient-to-r from-gray-500 to-gray-400',
}

export function LiveRailStrip({ isActive, content, mood, className = '' }: LiveRailStripProps) {
  const { leftSide, rightSide } = useMemo(() => getStripLayout(), [])
  const symbolCount = leftSide.length + rightSide.length + 1

  const [showSymbols, setShowSymbols] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [colorFlash, setColorFlash] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const colorFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevContentRef = useRef(content)

  const randomDelaysRef = useRef<number[]>(
    Array.from({ length: symbolCount }, () => Math.floor(Math.random() * 350)),
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const triggerColorFlash = useCallback(() => {
    if (colorFlashTimerRef.current) clearTimeout(colorFlashTimerRef.current)
    setColorFlash(true)
    colorFlashTimerRef.current = setTimeout(() => setColorFlash(false), 1600)
  }, [])

  // Symbol → preview animation. Cleanup resets state so React Strict Mode (dev) can replay
  // the effect without getting stuck with symbols hidden and preview never shown.
  useEffect(() => {
    if (!isActive) {
      setShowSymbols(true)
      setShowPreview(false)
      setColorFlash(false)
      prevContentRef.current = content
      return
    }

    if (reducedMotion) {
      setShowSymbols(false)
      setShowPreview(true)
      triggerColorFlash()
      return
    }

    setShowSymbols(false)
    const timer = window.setTimeout(() => {
      setShowPreview(true)
      triggerColorFlash()
    }, 400)

    return () => {
      window.clearTimeout(timer)
      setShowSymbols(true)
      setShowPreview(false)
    }
  }, [isActive, reducedMotion, triggerColorFlash])

  // Flash gradient color whenever sentence changes after initial reveal
  useEffect(() => {
    if (!showPreview) return
    if (prevContentRef.current === content) return
    prevContentRef.current = content
    triggerColorFlash()
  }, [content, showPreview, triggerColorFlash])

  const stripHeight = isActive ? 64 : 28

  return (
    <div
      className={`relative ${className}`}
      style={{ height: `${stripHeight}px`, transition: 'height 300ms ease' }}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute left-1/2 top-[-6px] h-1.5 w-screen -translate-x-1/2 bg-gradient-to-t from-black/12 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 bottom-[-6px] h-1.5 w-screen -translate-x-1/2 bg-gradient-to-b from-black/12 to-transparent" />
      <div className="absolute left-1/2 top-0 w-screen -translate-x-1/2 border-t border-gray-200" />
      <div className="absolute left-1/2 bottom-0 w-screen -translate-x-1/2 border-b border-gray-200" />

      <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="relative h-full">
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap text-gray-700">
            {leftSide.map((symbol, index) => (
              <span
                key={`left-${symbol}-${index}`}
                className="mr-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center align-middle"
                style={{
                  opacity: showSymbols ? 1 : 0,
                  transition: 'opacity 220ms ease-out',
                  transitionDelay: `${randomDelaysRef.current[index]}ms`,
                }}
              >
                <SymbolGlyph id={symbol} />
              </span>
            ))}
            <span
              className="mx-1 inline-flex h-3.5 shrink-0 items-center justify-center align-middle text-[10.5px] font-semibold tracking-tight"
              style={{
                opacity: showSymbols ? 1 : 0,
                transition: 'opacity 220ms ease-out',
                transitionDelay: `${randomDelaysRef.current[leftSide.length]}ms`,
              }}
            >
              β△
            </span>
            {rightSide.map((symbol, index) => (
              <span
                key={`right-${symbol}-${index}`}
                className="mr-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center align-middle"
                style={{
                  opacity: showSymbols ? 1 : 0,
                  transition: 'opacity 220ms ease-out',
                  transitionDelay: `${randomDelaysRef.current[leftSide.length + 1 + index]}ms`,
                }}
              >
                <SymbolGlyph id={symbol} />
              </span>
            ))}
          </div>

          {/* Resting state: plain gray text */}
          <p
            className="pointer-events-none absolute left-1/2 top-1/2 w-[92%] -translate-x-1/2 -translate-y-1/2 text-center text-sm font-medium leading-5 transition-opacity duration-500"
            style={{
              opacity: showPreview && !colorFlash ? 1 : 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            <span className="font-normal text-gray-600">i.e. </span>
            <span className="text-gray-700">{content}</span>
          </p>
          {/* Flash state: gradient only on the example line; prefix stays muted gray */}
          <p
            className="pointer-events-none absolute left-1/2 top-1/2 w-[92%] -translate-x-1/2 -translate-y-1/2 text-center text-sm font-medium leading-5 transition-opacity duration-500"
            style={{
              opacity: showPreview && colorFlash ? 1 : 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            <span className="font-normal text-gray-600">i.e. </span>
            <span className={`text-transparent bg-clip-text ${moodGradientClass[mood]}`}>{content}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
