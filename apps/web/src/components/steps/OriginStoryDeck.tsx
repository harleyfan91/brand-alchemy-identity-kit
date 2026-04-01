import { SwipeableOptionDeck } from '../ui/SwipeableOptionDeck'

export interface OriginStoryOption {
  id: string
  title: string
  description: string
  icon: string
}

interface OriginStoryDeckProps {
  options: OriginStoryOption[]
  selectedId: string
  onSelect: (id: string) => void
}

export function OriginStoryDeck({ options, selectedId, onSelect }: OriginStoryDeckProps) {
  const deckOptions = options.map((o) => ({
    id: o.id,
    title: o.title,
    description: o.description,
  }))

  return (
    <SwipeableOptionDeck
      options={deckOptions}
      selectedId={selectedId}
      onSelect={onSelect}
      ariaLabel="Brand origin story options"
      prevAriaLabel="Previous origin story"
      nextAriaLabel="Next origin story"
      dotGroupAriaLabel="Story slides"
    />
  )
}
