import { Deck } from '@/types'

type DeckItemProps = {
  deck: Deck
  isActive: boolean
  onSelect: (id: string) => void
}

export default function DeckItem({ deck, isActive, onSelect }: DeckItemProps) {
  const activeClasses = isActive
    ? 'bg-indigo-50 border-indigo-400'
    : 'bg-white border-gray-300 hover:bg-gray-50'

  return (
    <li
      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors duration-150 ${activeClasses}`}
      onClick={() => onSelect(deck.id)}
    >
      <span className="font-medium">{deck.name}</span>
      <span className="px-3 py-1 text-sm bg-gray-200 rounded-full">100</span>
    </li>
  )
}
