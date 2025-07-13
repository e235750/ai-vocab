import { useState, FormEvent } from 'react'
import { auth } from '@/lib/firebase/config'

type CreateDeckProps = {
  isOpen: boolean
  onClose: () => void
}

type DeckData = {
  name: string
  description?: string
  is_public: boolean
  owner_id: string
  num_words: number
}

export default function CreateDeck({ isOpen, onClose }: CreateDeckProps) {
  const [isPublic, setIsPublic] = useState(true)
  const [deckName, setDeckName] = useState('')
  const [deckDescription, setDeckDescription] = useState('')

  if (!isOpen) {
    return null
  }

  const registerDeck = async () => {
    const user = auth.currentUser
    if (!user) {
      alert('ログインしてください。')
      return
    }
    const data: DeckData = {
      name: deckName,
      description: deckDescription,
      is_public: isPublic,
      owner_id: user.uid,
      num_words: 0,
    }

    try {
      const response = await fetch('api/wordbooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('単語帳の作成に失敗しました。')
      }

      onClose()
    } catch (error: unknown) {
      console.error('Error creating deck:', error)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    registerDeck()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">新規単語帳作成</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-gray-700"
            >
              &times;
            </button>
          </div>

          <div className="p-6">
            <div className="mb-5">
              <label
                htmlFor="deck-name"
                className="block mb-2 font-semibold text-gray-700"
              >
                単語帳の名前
              </label>
              <input
                type="text"
                id="deck-name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="TOEIC頻出単語"
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="deck-description"
                className="block mb-2 font-semibold text-gray-700"
              >
                説明（任意）
              </label>
              <textarea
                id="deck-description"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                rows={4}
                placeholder="この単語帳についての説明を入力します"
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
              ></textarea>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                公開設定
              </label>
              <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`w-full py-2 text-sm font-bold rounded-md transition-colors ${
                    isPublic
                      ? 'bg-white text-blue-600 shadow'
                      : 'bg-transparent text-gray-500 hover:bg-gray-300'
                  }`}
                >
                  公開
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`w-full py-2 text-sm font-bold rounded-md transition-colors ${
                    !isPublic
                      ? 'bg-white text-blue-600 shadow'
                      : 'bg-transparent text-gray-500 hover:bg-gray-300'
                  }`}
                >
                  非公開
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
