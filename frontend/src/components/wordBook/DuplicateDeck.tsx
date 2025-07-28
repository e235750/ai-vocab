import { useState } from 'react'
import { DeckData, Deck } from '@/types'
import { useDeckStore } from '@/stores/deckStore'
import { useAuth } from '@/hooks/useAuth'
import DeckFormModal from './DeckFormModal'

type DuplicateDeckProps = {
  isOpen: boolean
  onClose: () => void
  sourceDeck: Deck | null
}

export default function DuplicateDeck({
  isOpen,
  onClose,
  sourceDeck,
}: DuplicateDeckProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { duplicateDeck } = useDeckStore()
  const { user } = useAuth()

  const handleSubmit = async (data: DeckData) => {
    if (!sourceDeck || !user) {
      alert('認証エラーが発生しました')
      return
    }

    setIsLoading(true)
    try {
      const dataWithUserName = {
        ...data,
        user_name: user.displayName || user.email || 'ゲストユーザー'
      }
      const idToken = await user.getIdToken()
      await duplicateDeck(sourceDeck.id, dataWithUserName, idToken)
      onClose()
    } catch (error) {
      console.error('Error duplicating deck:', error)
      alert('単語帳の複製中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // 複製時の初期データを準備
  const initialData = sourceDeck
    ? {
        name: `${sourceDeck.name}のコピー`,
        description: sourceDeck.description || '',
        is_public: false, // 複製は非公開で作成
      }
    : undefined

  return (
    <DeckFormModal
      isOpen={isOpen && !!sourceDeck}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="単語帳を複製"
      submitLabel="複製"
      initialData={initialData}
      isLoading={isLoading}
    />
  )
}
