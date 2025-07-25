import { useState } from 'react'
import { DeckData } from '@/types'
import { addWordbook } from '@/lib/api/db'
import { getIdToken } from '@/lib/firebase/auth'
import DeckFormModal from './DeckFormModal'

type CreateDeckProps = {
  isOpen: boolean
  onClose: () => void
}

export default function CreateDeck({ isOpen, onClose }: CreateDeckProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: DeckData) => {
    setIsLoading(true)
    try {
      const idToken = await getIdToken()
      if (!idToken) {
        alert('認証エラーが発生しました')
        return
      }

      const result = await addWordbook(data, idToken)
      if (result.error) {
        alert(`作成に失敗しました: ${result.error}`)
        return
      }

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
