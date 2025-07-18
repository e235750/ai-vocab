'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import CardViewer from '@/components/CardViewer'
import DeckList from '@/components/wordBook/DeckList'
import CreateDeck from '@/components/wordBook/CreateDeck'
import AddCardForm from '@/components/addCardForm/AddCardForm'
import { auth } from '@/lib/firebase/config'
import { getIdToken } from '@/lib/firebase/auth'
import { Deck, Card, NewCard } from '@/types'
import { addCard, getOwnedWordbooks, getWordsInWordbook } from '@/lib/api/db'

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [cachedCards, setCachedCards] = useState<Record<string, Card[]>>({})
  const [selectedDeckId, setSelectedDeckId] = useState<string>('')
  const [currentCardIndexes, setCurrentCardIndexes] = useState<
    Record<string, number>
  >({})
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isFetchingDecks, setIsFetchingDecks] = useState<boolean>(false)
  const [isCreatingCard, setIsCreatingCard] = useState<boolean>(false)

  const selectedDeck = decks.find((deck) => deck.id === selectedDeckId)
  const currentCards = cachedCards[selectedDeckId] || []
  const currentCardIndex = currentCardIndexes[selectedDeckId] || 0

  const handleSelectDeck = (deckId: string) => {
    setSelectedDeckId(deckId)
    if (!cachedCards[deckId]) {
      fetchWordsInDeck(deckId)
    }
  }

  const handleNavigateCard = (newIndex: number) => {
    setCurrentCardIndexes((prev) => ({ ...prev, [selectedDeckId]: newIndex }))
  }

  const handleAddCard = async (newCard: NewCard, idToken: string) => {
    if (selectedDeckId) {
      try {
        await addCard(newCard, idToken)
        await fetchDecks()
        await fetchWordsInDeck(selectedDeckId)
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
      const fetchDecks = await getOwnedWordbooks(idToken)
      setDecks(fetchDecks)
    } catch (error) {
      console.error('デッキの再取得に失敗しました:', error)
    }
  }

  const fetchDecks = async () => {
    const idToken = await getIdToken()
    if (!idToken) return
    try {
      setIsFetchingDecks(true)
      const fetchedDecks = await getOwnedWordbooks(idToken)
      setDecks(fetchedDecks)

      return fetchedDecks
    } catch (error) {
      console.error('Error fetching decks:', error)
    } finally {
      setIsFetchingDecks(false)
    }
  }

  const fetchWordsInDeck = async (deckId: string) => {
    if (!deckId) return

    const idToken = await getIdToken()
    if (!idToken) return
    try {
      const fetchedWords = await getWordsInWordbook(deckId, idToken)
      setCachedCards((prev) => ({
        ...prev,
        [deckId]: fetchedWords,
      }))
    } catch (error) {
      console.error('Error fetching words:', error)
      setCachedCards((prev) => ({ ...prev, [deckId]: [] }))
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const firstFetchDecks = async () => {
          try {
            const fetchedDecks = await fetchDecks()
            if (fetchedDecks.length > 0) {
              const firstDeckId = fetchedDecks[0].id
              setSelectedDeckId(firstDeckId)
            }
          } catch (error) {
            console.error('Error during initial fetch:', error)
          }
        }
        firstFetchDecks()
      } else {
        setDecks([])
        setCachedCards({})
        setSelectedDeckId('')
        setCurrentCardIndexes({})
        console.log('User is not authenticated, resetting state')
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (selectedDeckId && !cachedCards[selectedDeckId]) {
      fetchWordsInDeck(selectedDeckId)
    }
  }, [selectedDeckId, cachedCards])

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto mt-5">
        <div className="flex flex-col gap-8">
          {selectedDeckId ? (
            <CardViewer
              deckName={selectedDeck?.name || 'Loading...'}
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
            isFetchingDecks={isFetchingDecks}
            onSelectDeck={handleSelectDeck}
            openCreateDeckModal={() => setIsOpen(true)}
          />
          <CreateDeck isOpen={isOpen} onClose={onClose} />
        </div>
      </main>
    </>
  )
}
