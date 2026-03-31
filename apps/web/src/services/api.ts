type JsonValue = Record<string, unknown>

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787'

async function request<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return (await response.json()) as TResponse
}

export interface SessionResponse {
  sessionId: string
}

export interface CheckoutResponse {
  checkoutUrl: string
  tier: string
}

export interface FulfillmentResponse {
  sessionId: string
  status: 'complete' | 'in_progress' | 'error'
  outputs: {
    brandBrief: string
    styleGuide: string
    voicePlaybook: string
    quickStart: string
  }
}

export const api = {
  createSession: () => request<SessionResponse>('/sessions', { method: 'POST' }),
  createCheckout: (payload: JsonValue) =>
    request<CheckoutResponse>('/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getFulfillment: (sessionId: string) => request<FulfillmentResponse>(`/fulfillment/${sessionId}`),
}
