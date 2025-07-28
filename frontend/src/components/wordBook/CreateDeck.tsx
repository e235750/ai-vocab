import { useState } from 'react'
import { DeckData } from '@/types'
import { useDeckStore } from '@/stores/deckStore'
import { useAuth } from '@/hooks/useAuth'
import DeckFormModal from './DeckFormModal'

type CreateDeckProps = {
  isOpen: boolean
  onClose: () => void
}

export default function CreateDeck({ isOpen, onClose }: CreateDeckProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createDeck } = useDeckStore()
  const { user } = useAuth()

  const handleSubmit = async (data: DeckData) => {
    if (!user) {
      alert('認証エラーが発生しました')
      return
    }

    setIsLoading(true)
    try {
      const idToken = await user.getIdToken()
      // ユーザー名を追加
      const dataWithUserName = {
        ...data,
        user_name: user.displayName || user.email || 'ゲストユーザー'
      }
      await createDeck(dataWithUserName, idToken)
      onClose()
    } catch (error) {
      console.error('Error creating deck:', error)
      alert('単語帳の作成中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DeckFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="新規単語帳作成"
      submitLabel="作成"
      isLoading={isLoading}
    />
  )
}
