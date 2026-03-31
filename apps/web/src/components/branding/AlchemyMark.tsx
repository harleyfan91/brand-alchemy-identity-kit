export function AlchemyMark() {
  return (
    <div className="inline-flex items-center gap-2">
      <svg viewBox="0 0 48 48" className="h-8 w-8 text-zinc-900" aria-hidden="true">
        <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 9 L36 31 H12 Z M24 17 L17.5 28 H30.5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-sm font-semibold tracking-wide text-zinc-900">Brand Alchemy</span>
    </div>
  )
}
