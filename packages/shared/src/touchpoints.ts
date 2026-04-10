export type TouchpointBucketId = 'social' | 'online_directory' | 'marketplace' | 'owned_channel'

export type TouchpointId =
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'facebook'
  | 'youtube'
  | 'pinterest'
  | 'threads'
  | 'google_business'
  | 'apple_maps'
  | 'bing_places'
  | 'yelp'
  | 'nextdoor'
  | 'tripadvisor'
  | 'marketplace_storefront'
  | 'amazon_storefront'
  | 'ebay_storefront'
  | 'walmart_marketplace'
  | 'faire_wholesale'
  | 'depop_store'
  | 'poshmark_store'
  | 'shopify_marketplace'
  | 'website'
  | 'email_newsletter'
  | 'blog'

export type TouchpointDefinition = {
  id: TouchpointId
  label: string
  bucket: TouchpointBucketId
  aliases?: readonly string[]
}

export const TOUCHPOINT_BUCKET_LABELS: Record<TouchpointBucketId, string> = {
  social: 'Social',
  online_directory: 'Online Directory',
  marketplace: 'Marketplace',
  owned_channel: 'Owned Channel',
}

export const TOUCHPOINT_DEFINITIONS: readonly TouchpointDefinition[] = [
  { id: 'instagram', label: 'Instagram', bucket: 'social' },
  { id: 'tiktok', label: 'TikTok', bucket: 'social' },
  { id: 'linkedin', label: 'LinkedIn', bucket: 'social' },
  { id: 'facebook', label: 'Facebook', bucket: 'social' },
  { id: 'youtube', label: 'YouTube', bucket: 'social' },
  { id: 'pinterest', label: 'Pinterest', bucket: 'social' },
  { id: 'threads', label: 'Threads', bucket: 'social' },

  {
    id: 'google_business',
    label: 'Google',
    bucket: 'online_directory',
    aliases: ['google_maps', 'google_business_profile'],
  },
  { id: 'apple_maps', label: 'Apple Maps', bucket: 'online_directory' },
  { id: 'bing_places', label: 'Bing Places', bucket: 'online_directory', aliases: ['bing'] },
  { id: 'yelp', label: 'Yelp', bucket: 'online_directory' },
  { id: 'nextdoor', label: 'Nextdoor', bucket: 'online_directory' },
  { id: 'tripadvisor', label: 'TripAdvisor', bucket: 'online_directory' },

  { id: 'marketplace_storefront', label: 'Etsy', bucket: 'marketplace', aliases: ['etsy'] },
  { id: 'amazon_storefront', label: 'Amazon', bucket: 'marketplace', aliases: ['amazon'] },
  { id: 'ebay_storefront', label: 'eBay', bucket: 'marketplace', aliases: ['ebay'] },
  { id: 'walmart_marketplace', label: 'Walmart', bucket: 'marketplace' },
  { id: 'faire_wholesale', label: 'Faire', bucket: 'marketplace' },
  { id: 'depop_store', label: 'Depop', bucket: 'marketplace' },
  { id: 'poshmark_store', label: 'Poshmark', bucket: 'marketplace' },
  { id: 'shopify_marketplace', label: 'Shop', bucket: 'marketplace', aliases: ['shopify'] },

  { id: 'website', label: 'Website', bucket: 'owned_channel' },
  { id: 'email_newsletter', label: 'Email newsletter', bucket: 'owned_channel', aliases: ['email'] },
  { id: 'blog', label: 'Blog', bucket: 'owned_channel' },
] as const

const TOUCHPOINT_BY_ID = Object.fromEntries(TOUCHPOINT_DEFINITIONS.map((item) => [item.id, item])) as Record<
  TouchpointId,
  TouchpointDefinition
>

const TOUCHPOINT_ALIAS_MAP: Record<string, TouchpointId> = TOUCHPOINT_DEFINITIONS.reduce<Record<string, TouchpointId>>(
  (acc, def) => {
    acc[def.id] = def.id
    for (const alias of def.aliases ?? []) {
      acc[alias] = def.id
    }
    return acc
  },
  {},
)

export const TOUCHPOINT_IDS = TOUCHPOINT_DEFINITIONS.map((item) => item.id) as readonly TouchpointId[]

export function isTouchpointId(value: string): value is TouchpointId {
  return Object.hasOwn(TOUCHPOINT_BY_ID, value)
}

export function resolveTouchpointId(value: string): TouchpointId | null {
  const normalized = value.trim().toLowerCase()
  return TOUCHPOINT_ALIAS_MAP[normalized] ?? null
}

export function getTouchpointDefinition(id: TouchpointId): TouchpointDefinition {
  return TOUCHPOINT_BY_ID[id]
}

export function getTouchpointLabel(id: TouchpointId): string {
  return TOUCHPOINT_BY_ID[id].label
}

export function normalizeTouchpoints(input: readonly string[], max = 4): TouchpointId[] {
  const normalized: TouchpointId[] = []
  const seen = new Set<TouchpointId>()
  for (const raw of input) {
    const resolved = resolveTouchpointId(raw)
    if (!resolved || seen.has(resolved)) continue
    normalized.push(resolved)
    seen.add(resolved)
    if (normalized.length >= max) break
  }
  return normalized
}

export function touchpointBuckets(): Array<{ id: TouchpointBucketId; label: string; ids: TouchpointId[] }> {
  const grouped: Record<TouchpointBucketId, TouchpointId[]> = {
    social: [],
    online_directory: [],
    marketplace: [],
    owned_channel: [],
  }
  for (const item of TOUCHPOINT_DEFINITIONS) grouped[item.bucket].push(item.id)
  return (Object.keys(grouped) as TouchpointBucketId[]).map((id) => ({
    id,
    label: TOUCHPOINT_BUCKET_LABELS[id],
    ids: grouped[id],
  }))
}
