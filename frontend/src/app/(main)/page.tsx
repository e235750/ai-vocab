'use client'

import { useState, useEffect } from 'react'
import CardViewer from '@/components/CardViewer'
import DeckList from '@/components/wordBook/DeckList'
import CreateDeck from '@/components/wordBook/CreateDeck'
import AddCardForm from '@/components/addCardForm/AddCardForm'
import { auth } from '@/lib/firebase/config'
import { getIdToken } from '@/lib/firebase/auth'
import { NewCard } from '@/types'
import { addCard } from '@/lib/api/db'
import { useDeckStore } from '@/stores/deckStore'

export default function HomePage() {
  const {
    decks,
    cachedCards,
    selectedDeckId,
    currentCardIndexes,
    loading,
    selectDeck,
    navigateCard,
    reset,
    fetchDecks: storeFetchDecks,
    fetchWordsInDeck: storeFetchWordsInDeck,
  } = useDeckStore()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isCreatingCard, setIsCreatingCard] = useState<boolean>(false)

  const selectedDeck = decks.find((deck) => deck.id === selectedDeckId)
  const currentCards = cachedCards[selectedDeckId] || []
  const currentCardIndex = currentCardIndexes[selectedDeckId] || 0

  const handleSelectDeck = async (deckId: string) => {
    selectDeck(deckId)
    if (!cachedCards[deckId]) {
      const idToken = await getIdToken()
      if (idToken) {
        try {
          await storeFetchWordsInDeck(deckId, idToken)
        } catch (error) {
          console.error('Error fetching words:', error)
        }
      }
    }
  }

  const handleNavigateCard = (newIndex: number) => {
    navigateCard(newIndex)
  }

  const handleAddCard = async (newCard: NewCard, idToken: string) => {
    if (selectedDeckId) {
      try {
        await addCard(newCard, idToken)
        await storeFetchDecks(idToken)
        await storeFetchWordsInDeck(selectedDeckId, idToken)
      } catch (error) {
        console.error('カードの追加または再取得に失敗しました:', error)
      }
    }
  }

  const onClose = async () => {
    const idToken = await getIdToken()
    if (!idToken) return
    setIsOpen(false)
    try {
      await storeFetchDecks(idToken)
    } catch (error) {
      console.error('デッキの再取得に失敗しました:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken()
          const fetchedDecks = await storeFetchDecks(idToken)
          if (fetchedDecks.length > 0) {
            const firstDeckId = fetchedDecks[0].id
            selectDeck(firstDeckId)
          }
        } catch (error) {
          console.error('Error during initial fetch:', error)
        }
      } else {
        reset()
      }
    })
    return () => unsubscribe()
  }, [storeFetchDecks, selectDeck, reset])

  useEffect(() => {
    if (selectedDeckId && !cachedCards[selectedDeckId]) {
      const fetchWords = async () => {
        const idToken = await getIdToken()
        if (idToken) {
          try {
            await storeFetchWordsInDeck(selectedDeckId, idToken)
          } catch (error) {
            console.error('Error fetching words:', error)
          }
        }
      }
      fetchWords()
    }
  }, [selectedDeckId, cachedCards, storeFetchWordsInDeck])

  return (
    <>
      <main className="max-w-4xl mx-auto mt-5">
        <div className="flex flex-col gap-8">
          {selectedDeckId ? (
            <CardViewer
              deckName={selectedDeck?.name || 'Loading...'}
              selectedDeckId={selectedDeckId}
              cards={currentCards}
              totalCards={currentCards.length}
              currentIndex={currentCardIndex}
              isCreatingCard={isCreatingCard}
              onNavigate={handleNavigateCard}
              setIsCreatingCard={setIsCreatingCard}
            />
          ) : (
            <div className="p-6 text-center bg-white border border-gray-300 rounded-xl">
              単語帳を選択してください。
            </div>
          )}
          {selectedDeckId && isCreatingCard && (
            <AddCardForm
              selectedDeckId={selectedDeckId}
              onAddCard={handleAddCard}
            />
          )}
          <DeckList
            decks={decks}
            selectedDeckId={selectedDeckId}
            isFetchingDecks={loading}
            onSelectDeck={handleSelectDeck}
            openCreateDeckModal={() => setIsOpen(true)}
          />
          <CreateDeck isOpen={isOpen} onClose={onClose} />
        </div>
      </main>
    </>
  )
}
