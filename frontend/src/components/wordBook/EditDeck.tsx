import { useState } from 'react'
import { DeckData, Deck } from '@/types'
import { useDeckStore } from '@/stores/deckStore'
import { useAuth } from '@/hooks/useAuth'
import DeckFormModal from './DeckFormModal'
import { getIdToken } from '@/lib/firebase/auth'

type EditDeckProps = {
  isOpen: boolean
  onClose: () => void
  deck: Deck | null
  onUpdate: () => Promise<void>
}

export default function EditDeck({
  isOpen,
  onClose,
  deck,
  onUpdate,
}: EditDeckProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { updateDeck } = useDeckStore()
  const { user } = useAuth()

  const handleSubmit = async (data: DeckData) => {
    if (!deck || !user) {
      alert('認証エラーが発生しました')
      return
    }

    setIsLoading(true)
    try {
      const updatedData: DeckData = {
        ...data,
        num_words: deck.num_words, // 既存の単語数を保持
        user_name: user.displayName || user.email || 'ゲストユーザー',
      }

      const idToken = await getIdToken()
      if (!idToken) return
      await updateDeck(deck.id, updatedData, idToken)
      await onUpdate() // 親コンポーネントの更新を実行
      onClose()
    } catch (error) {
      console.error('Error updating deck:', error)
      alert('単語帳の更新中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // 編集時の初期データを準備
  const initialData = deck
    ? {
        name: deck.name,
        description: deck.description || '',
        is_public: deck.is_public,
      }
    : undefined

  return (
    <DeckFormModal
      isOpen={isOpen && !!deck}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="単語帳を編集"
      submitLabel="更新"
      initialData={initialData}
      isLoading={isLoading}
    />
  )
}
