'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import CardViewer from '@/components/CardViewer'
import DeckList from '@/components/wordBook/DeckList'
import CreateDeck from '@/components/wordBook/CreateDeck'
import { type Deck } from '@/components/wordBook/DeckItem'

// ダミーデータは同じ
const initialDecks: Deck[] = [
  {
    id: 1,
    name: 'TOEIC頻出単語',
    cards: [
      { id: 101, word: 'example', definition: '...' },
      { id: 102, word: 'test', definition: '...' },
    ],
  },
  {
    id: 2,
    name: 'ビジネス英会話',
    cards: [{ id: 201, word: 'negotiate', definition: '...' } /* ... */],
  },
]

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>(initialDecks)
  const [selectedDeckId, setSelectedDeckId] = useState<number>(1)
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const selectedDeck = decks.find((deck) => deck.id === selectedDeckId)
  const currentCard = selectedDeck?.cards[currentCardIndex]

  const handleSelectDeck = (deckId: number) => {
    setSelectedDeckId(deckId)
    setCurrentCardIndex(0)
  }

  const handleNavigateCard = (newIndex: number) => {
    setCurrentCardIndex(newIndex)
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto mt-5">
        <div className="flex flex-col gap-8">
          {selectedDeck && currentCard ? (
            <CardViewer
              deckName={selectedDeck.name}
              currentCard={currentCard}
              totalCards={selectedDeck.cards.length}
              currentIndex={currentCardIndex}
              onNavigate={handleNavigateCard}
            />
          ) : (
            <div className="p-6 text-center bg-white border border-gray-300 rounded-xl">
              単語帳を選択してください。
            </div>
          )}

          <DeckList
            decks={decks}
            selectedDeckId={selectedDeckId}
            onSelectDeck={handleSelectDeck}
            openCreateDeckModal={() => setIsOpen(true)}
          />
          <CreateDeck isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      </main>
    </>
  )
}
