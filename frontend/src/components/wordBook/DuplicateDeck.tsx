import { useState } from 'react'
import { DeckData, Deck } from '@/types'
import { duplicateWordbook } from '@/lib/api/db'
import { getIdToken } from '@/lib/firebase/auth'
import DeckFormModal from './DeckFormModal'

type DuplicateDeckProps = {
  isOpen: boolean
  onClose: () => void
  sourceDeck: Deck | null
  onDuplicated?: () => void
}

export default function DuplicateDeck({
  isOpen,
  onClose,
  sourceDeck,
  onDuplicated,
}: DuplicateDeckProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: DeckData) => {
    if (!sourceDeck) return

    setIsLoading(true)
    try {
      const idToken = await getIdToken()
      if (!idToken) {
        alert('認証エラーが発生しました')
        return
      }

      const result = await duplicateWordbook(sourceDeck.id, data, idToken)
      if (result.error) {
        alert(`複製に失敗しました: ${result.error}`)
        return
      }

      onDuplicated?.() // 親コンポーネントに複製完了を通知
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
        is_public: sourceDeck.is_public,
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
