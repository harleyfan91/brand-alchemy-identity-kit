import { useCallback, useEffect, useRef, useState } from 'react'

import type { VoiceMood } from '../../utils/voicePreview'

interface ToneExampleStripProps {
  sentence: string
  mood: VoiceMood
  /** When false, show an empty dotted slot; when true, fill with the preview line. */
  active: boolean
  className?: string
}

/** Gradient “flash” on change; settles to standard body color (same idea as the former live rail). */
const moodGradientClass: Record<VoiceMood, string> = {
  calm: 'bg-gradient-to-r from-sky-400 to-teal-500',
  warm: 'bg-gradient-to-r from-rose-400 to-orange-400',
  bold: 'bg-gradient-to-r from-amber-400 to-red-500',
  neutral: 'bg-gradient-to-r from-gray-500 to-gray-400',
}

const FLASH_MS = 1600

/**
 * Desktop: sticky under the title in the scroll shell.
 * Mobile: render inside `StepShell`’s footer stack (flush above the CTA) — no internal `fixed` positioning.
 */
export function ToneExampleStrip({ sentence, mood, active, className = '' }: ToneExampleStripProps) {
  const [colorFlash, setColorFlash] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const colorFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevSentenceRef = useRef(sentence)
  const prevActiveRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const triggerColorFlash = useCallback(() => {
    if (reducedMotion) return
    if (colorFlashTimerRef.current) clearTimeout(colorFlashTimerRef.current)
    setColorFlash(true)
    colorFlashTimerRef.current = setTimeout(() => {
      colorFlashTimerRef.current = null
      setColorFlash(false)
    }, FLASH_MS)
  }, [reducedMotion])

  useEffect(
    () => () => {
      if (colorFlashTimerRef.current) clearTimeout(colorFlashTimerRef.current)
    },
    [],
  )

  useEffect(() => {
    if (!active) {
      prevActiveRef.current = false
      prevSentenceRef.current = sentence
      setColorFlash(false)
    }
  }, [active, sentence])

  useEffect(() => {
    if (!active) return
    if (prevActiveRef.current) return
    prevActiveRef.current = true
    prevSentenceRef.current = sentence
    triggerColorFlash()
  }, [active, sentence, triggerColorFlash])

  useEffect(() => {
    if (!active) return
    if (!prevActiveRef.current) return
    if (prevSentenceRef.current === sentence) return
    prevSentenceRef.current = sentence
    triggerColorFlash()
  }, [active, sentence, triggerColorFlash])

  const shell =
    'max-md:bg-transparent max-md:px-0 max-md:py-0 ' +
    'md:sticky md:top-0 md:z-20 md:-mx-6 md:border-b md:border-gray-200/90 md:bg-white/95 md:px-6 md:py-2 md:backdrop-blur-sm'

  return (
    <div className={`${shell} ${className}`} aria-live="polite" aria-atomic="false">
      <div className="mx-auto w-full max-w-xl">
        <p className="flex flex-wrap items-baseline gap-x-1.5 text-sm leading-snug">
          <span className="shrink-0 font-medium text-gray-500">i.e.</span>
          <span className="relative inline-block min-h-[1.35em] min-w-[min(100%,12rem)] flex-1 border-b border-dotted border-gray-400 pb-px md:max-w-none">
            {active ? (
              <span className="relative block w-full text-pretty">
                <span
                  className={`block font-medium text-gray-700 transition-opacity duration-500 ${
                    colorFlash && !reducedMotion ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {sentence}
                </span>
                <span
                  className={`pointer-events-none absolute left-0 top-0 block w-full bg-clip-text font-medium text-transparent transition-opacity duration-500 ${moodGradientClass[mood]} ${
                    colorFlash && !reducedMotion ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden
                >
                  {sentence}
                </span>
              </span>
            ) : (
              <span className="block text-transparent" aria-hidden>
                &nbsp;
              </span>
            )}
          </span>
        </p>
      </div>
    </div>
  )
}
