export type LandscapeNavItem = { id: string; label: string }

export type StyleGuideNavId = 'colors' | 'direction' | 'typography' | 'principles' | 'imagery' | 'reference'

export type StrategyMemoNavId = 'archetype' | 'audience' | 'messaging' | 'roadmap'

const STYLE_GUIDE_CORE_NAV: LandscapeNavItem[] = [
  { id: 'colors', label: 'Colors' },
  { id: 'direction', label: 'Direction' },
  { id: 'typography', label: 'Typography' },
  { id: 'principles', label: 'Principles' },
  { id: 'imagery', label: 'Imagery' },
]

export function styleGuideNavItems(includeVisualReference: boolean): LandscapeNavItem[] {
  if (!includeVisualReference) return STYLE_GUIDE_CORE_NAV
  return [...STYLE_GUIDE_CORE_NAV, { id: 'reference', label: 'Reference' }]
}

export const STRATEGY_MEMO_NAV_ITEMS: LandscapeNavItem[] = [
  { id: 'archetype', label: 'Archetype' },
  { id: 'audience', label: 'Audience' },
  { id: 'messaging', label: 'Messaging' },
  { id: 'roadmap', label: 'Roadmap' },
]
