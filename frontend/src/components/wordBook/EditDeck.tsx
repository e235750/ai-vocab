import { useState } from 'react'
import { DeckData, Deck } from '@/types'
import { updateWordbook } from '@/lib/api/db'
import { getIdToken } from '@/lib/firebase/auth'
import DeckFormModal from './DeckFormModal'

type EditDeckProps = {
  isOpen: boolean
  onClose: () => void
  deck: Deck | null
  onUpdate?: () => void
}

export default function EditDeck({
  isOpen,
  onClose,
  deck,
  onUpdate,
}: EditDeckProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: DeckData) => {
    if (!deck) return

    setIsLoading(true)
    try {
      const updatedData: DeckData = {
        ...data,
        num_words: deck.num_words, // 既存の単語数を保持
      }

      const idToken = await getIdToken()
      if (!idToken) {
        alert('認証エラーが発生しました')
        return
      }

      const result = await updateWordbook(deck.id, updatedData, idToken)
      if (result.error) {
        alert(`更新に失敗しました: ${result.error}`)
        return
      }

      onUpdate?.() // 親コンポーネントに更新を通知
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
