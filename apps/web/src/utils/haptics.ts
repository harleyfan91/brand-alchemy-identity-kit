/** Short pulse when a picker value settles (supported mainly on Android). */
export function lightSelectionHaptic(): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(12)
    }
  } catch {
    /* Some browsers throw if vibrate is blocked */
  }
}
