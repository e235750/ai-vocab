'use client'

import { FaTimes } from 'react-icons/fa'
import { Card, NewCard } from '@/types'
import { getIdToken } from '@/lib/firebase/auth'
import EditFormCore from './EditFormCore'

interface UpdateCardFormProps {
  onUpdateCard: (updatedCardData: NewCard, idToken: string) => void
  selectedDeckId: string
  cardData: Card
  onCancel: () => void
}

export default function UpdateCardForm({
  onUpdateCard,
  selectedDeckId: _selectedDeckId,
  cardData,
  onCancel,
}: UpdateCardFormProps) {
  const handleSubmit = async (updatedCard: NewCard) => {
    try {
      const idToken = await getIdToken()
      if (idToken) {
        onUpdateCard(updatedCard, idToken)
      }
    } catch (error) {
      console.error('Failed to get authentication token:', error)
      alert('認証に失敗しました。もう一度ログインしてください。')
    }
  }

  return (
    <div className="mt-8 mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">カードを編集</h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <EditFormCore
        cardData={cardData}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        submitButtonText="変更を保存"
        className="p-6 bg-white border-2 border-blue-500 rounded-xl flex flex-col gap-6 shadow-lg"
      />
    </div>
  )
}
