import type { KeyboardEvent } from 'react'

import type { StyleDirectionOption } from '../../data/visualDirection'

interface StyleDirectionGridProps {
  options: StyleDirectionOption[]
  selectedId: string
  onSelect: (id: string) => void
  error?: string
}

export function StyleDirectionGrid({
  options,
  selectedId,
  onSelect,
  error,
}: StyleDirectionGridProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const columns = 2
    const nextIndex =
      event.key === 'ArrowRight'
        ? Math.min(options.length - 1, index + 1)
        : event.key === 'ArrowLeft'
          ? Math.max(0, index - 1)
          : event.key === 'ArrowDown'
            ? Math.min(options.length - 1, index + columns)
            : event.key === 'ArrowUp'
              ? Math.max(0, index - columns)
              : -1

    if (nextIndex === -1) return

    event.preventDefault()
    const next = options[nextIndex]
    if (!next) return
    onSelect(next.id)
  }

  return (
    <fieldset className="min-w-0 w-full space-y-3 border-0 p-0">
      <legend className="sr-only">Choose a style direction</legend>
      <div
        role="radiogroup"
        aria-label="Style direction options"
        className="grid grid-cols-2 items-stretch gap-2.5 sm:gap-3"
      >
        {options.map((option, index) => {
          const selected = selectedId === option.id
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected || (!selectedId && index === 0) ? 0 : -1}
              onClick={() => onSelect(option.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`flex h-full min-h-0 w-full min-w-0 flex-col rounded-2xl border px-3 py-3.5 text-left transition sm:rounded-3xl sm:px-4 sm:py-4 ${
                selected ? 'border-gray-900 bg-gray-100 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <p className="shrink-0 text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-2 shrink-0 text-sm font-semibold leading-snug text-gray-900 sm:mt-3 sm:text-base">
                {option.title}
              </p>
              <p className="mt-1 min-h-0 flex-1 break-words text-xs leading-snug text-gray-600 sm:mt-2 sm:text-sm sm:leading-relaxed">
                {option.description}
              </p>
            </button>
          )
        })}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </fieldset>
  )
}
