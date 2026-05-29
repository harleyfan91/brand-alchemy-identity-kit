export type AiCallLogPayload = {
  kitOrderId: string
  sectionName: string
  event: 'start' | 'success' | 'error'
  model?: string
  temperature?: number
  inputTokens?: number
  cachedInputTokens?: number
  outputTokens?: number
  elapsedMs?: number
  error?: string
}

/** Structured console logging until `ai_call_logs` DB writes land in Stage 4. */
export function logAiCall(payload: AiCallLogPayload): void {
  const line = JSON.stringify({
    component: 'ai',
    ts: new Date().toISOString(),
    ...payload,
  })
  if (payload.event === 'error') {
    console.error(line)
  } else {
    console.info(line)
  }
}
