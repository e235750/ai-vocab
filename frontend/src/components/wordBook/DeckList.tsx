import DeckItem, { type Deck } from './DeckItem.tsx'

type DeckListProps = {
  decks: Deck[]
  selectedDeckId: number
  onSelectDeck: (id: number) => void
  openCreateDeckModal: () => void
}

export default function DeckList({
  decks,
  selectedDeckId,
  onSelectDeck,
  openCreateDeckModal,
}: DeckListProps) {
  return (
    <section className="p-6 bg-white border border-gray-300 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-600">単語帳一覧</h2>
        <button
          className="px-4 py-1.5 font-semibold bg-white border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={openCreateDeckModal}
        >
          新規作成
        </button>
      </div>
      <ul className="flex flex-col gap-2.5">
        {decks.map((deck) => (
          <DeckItem
            key={deck.id}
            deck={deck}
            isActive={deck.id === selectedDeckId}
            onSelect={onSelectDeck}
          />
        ))}
      </ul>
    </section>
  )
}
