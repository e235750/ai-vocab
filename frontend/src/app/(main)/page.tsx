'use client'

import { useState, useEffect } from 'react'
import CardViewer from '@/components/CardViewer'
import DeckList from '@/components/wordBook/DeckList'
import CreateDeck from '@/components/wordBook/CreateDeck'
import EditDeck from '@/components/wordBook/EditDeck'
import DuplicateDeck from '@/components/wordBook/DuplicateDeck'
import AddCardForm from '@/components/cardForm/AddCardForm'
import UpdateCardForm from '@/components/cardForm/UpdateCardForm'
import { auth } from '@/lib/firebase/config'
import { getIdToken } from '@/lib/firebase/auth'
import { NewCard, Deck } from '@/types'
import { addCard, updateCard, deleteCard, deleteWordbook } from '@/lib/api/db'
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
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [isDuplicateOpen, setIsDuplicateOpen] = useState<boolean>(false)
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null)
  const [duplicatingDeck, setDuplicatingDeck] = useState<Deck | null>(null)
  const [cardAction, setCardAction] = useState<
    'none' | 'creating' | 'updating'
  >('none')

  // computed values
  const isCreatingCard = cardAction === 'creating'
  const isUpdatingCard = cardAction === 'updating'

  // helper functions for state management
  const setIsCreatingCard = (value: boolean) => {
    setCardAction(value ? 'creating' : 'none')
  }

  const setIsUpdatingCard = (value: boolean) => {
    setCardAction(value ? 'updating' : 'none')
  }

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

  const handleUpdateCard = async (updatedCard: NewCard, idToken: string) => {
    if (selectedDeckId && currentCards[currentCardIndex]) {
      try {
        const cardId = currentCards[currentCardIndex].id
        await updateCard(cardId, updatedCard, idToken)
        await storeFetchWordsInDeck(selectedDeckId, idToken)
        setIsUpdatingCard(false)
      } catch (error) {
        console.error('カードの更新に失敗しました:', error)
      }
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    if (!selectedDeckId) return

    try {
      const idToken = await getIdToken()
      if (!idToken) return

      await deleteCard(cardId, idToken)
      await storeFetchDecks(idToken) // デッキの単語数を更新
      await storeFetchWordsInDeck(selectedDeckId, idToken)

      // 削除後のインデックス調整
      const newTotalCards = currentCards.length - 1
      if (currentCardIndex >= newTotalCards && newTotalCards > 0) {
        navigateCard(newTotalCards - 1)
      } else if (newTotalCards === 0) {
        navigateCard(0)
      }
    } catch (error) {
      console.error('カードの削除に失敗しました:', error)
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

  const handleWordbookDeleted = async (deckId: string) => {
    const idToken = await getIdToken()
    if (!idToken) return

    try {
      await deleteWordbook(deckId, idToken)
      const fetchedDecks = await storeFetchDecks(idToken)
      if (fetchedDecks.length > 0) {
        // 削除後、残っているデッキから最初のものを選択
        const firstDeckId = fetchedDecks[0].id
        selectDeck(firstDeckId)
      } else {
        // すべてのデッキが削除された場合はリセット
        reset()
      }
    } catch (error) {
      console.error('デッキの再取得に失敗しました:', error)
    }
  }

  const handleWordbookEdit = (deck: Deck) => {
    setEditingDeck(deck)
    setIsEditOpen(true)
  }

  const handleEditClose = () => {
    setIsEditOpen(false)
    setEditingDeck(null)
  }

  const handleEditUpdate = async () => {
    const idToken = await getIdToken()
    if (!idToken) return

    try {
      await storeFetchDecks(idToken) // デッキリストを再取得
    } catch (error) {
      console.error('デッキの再取得に失敗しました:', error)
    }
  }

  const handleWordbookDuplicate = (deck: Deck) => {
    setDuplicatingDeck(deck)
    setIsDuplicateOpen(true)
  }

  const handleDuplicateClose = () => {
    setIsDuplicateOpen(false)
    setDuplicatingDeck(null)
  }

  const handleDuplicateCompleted = async () => {
    const idToken = await getIdToken()
    if (!idToken) return

    try {
      await storeFetchDecks(idToken) // デッキリストを再取得
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
              isUpdatingCard={isUpdatingCard}
              onNavigate={handleNavigateCard}
              setIsCreatingCard={setIsCreatingCard}
              setIsUpdatingCard={setIsUpdatingCard}
              onDeleteCard={handleDeleteCard}
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
          {selectedDeckId && isUpdatingCard && (
            <UpdateCardForm
              onUpdateCard={handleUpdateCard}
              selectedDeckId={selectedDeckId}
              cardData={currentCards[currentCardIndex]}
              onCancel={() => setIsUpdatingCard(false)}
            />
          )}
          <DeckList
            decks={decks}
            selectedDeckId={selectedDeckId}
            isFetchingDecks={loading}
            onSelectDeck={handleSelectDeck}
            openCreateDeckModal={() => setIsOpen(true)}
            onWordbookDeleted={handleWordbookDeleted}
            onWordbookEdit={handleWordbookEdit}
            onWordbookDuplicate={handleWordbookDuplicate}
          />
          <CreateDeck isOpen={isOpen} onClose={onClose} />
          <EditDeck
            isOpen={isEditOpen}
            onClose={handleEditClose}
            deck={editingDeck}
            onUpdate={handleEditUpdate}
          />
          <DuplicateDeck
            isOpen={isDuplicateOpen}
            onClose={handleDuplicateClose}
            sourceDeck={duplicatingDeck}
            onDuplicated={handleDuplicateCompleted}
          />
        </div>
      </main>
    </>
  )
}
