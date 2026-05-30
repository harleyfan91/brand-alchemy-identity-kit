/** Strategy Memo §7 — timeline nodes (scaffold + future Opus output). */

export type StrategyMemoQuickStartBridgeNode = {
  kind: 'quick_start_bridge'
  horizonLabel: string
  title: string
  body: string
}

export type StrategyMemoPriorityNode = {
  kind: 'priority'
  order: 1 | 2 | 3
  horizonLabel: string
  title: string
  body: string
  activatesPillars: string[]
}

export type StrategyMemoRoadmapNode = StrategyMemoQuickStartBridgeNode | StrategyMemoPriorityNode

export const STRATEGY_MEMO_ROADMAP_FRAMING =
  'Your Quick Start covers the first 30 days. These priorities are what to emphasize after that — each one ties back to your messaging hierarchy above.'

export type StrategyMemoRoadmap = {
  framing: string
  nodes: StrategyMemoRoadmapNode[]
}

export type StrategyMemoNarrative = {
  kind: 'problem_story' | 'brand_manifesto'
  title: string
  body: string
}
