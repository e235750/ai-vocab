import { useState, FormEvent, useEffect } from 'react'
import { DeckData } from '@/types'

type DeckFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DeckData) => Promise<void>
  title: string
  submitLabel: string
  initialData?: {
    name: string
    description: string
    is_public: boolean
  }
  isLoading?: boolean
}

export default function DeckFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitLabel,
  initialData,
  isLoading = false,
}: DeckFormModalProps) {
  const [isPublic, setIsPublic] = useState(false)
  const [deckName, setDeckName] = useState('')
  const [deckDescription, setDeckDescription] = useState('')

  // initialDataが変更されたときにフォームの値を更新
  useEffect(() => {
    if (initialData) {
      setDeckName(initialData.name)
      setDeckDescription(initialData.description || '')
      setIsPublic(initialData.is_public)
    } else {
      // 初期化（新規作成時）
      setDeckName('')
      setDeckDescription('')
      setIsPublic(false)
    }
  }, [initialData])

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!deckName.trim()) {
      alert('単語帳の名前を入力してください')
      return
    }

    const data: DeckData = {
      name: deckName,
      description: deckDescription,
      is_public: isPublic,
      num_words: 0, // 新規作成時は0、編集時は親コンポーネントで上書き
    }

    try {
      await onSubmit(data)
    } catch (error) {
      console.error('フォーム送信エラー:', error)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-white dark:bg-[#23272f] rounded-xl shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
            >
              &times;
            </button>
          </div>

          <div className="p-6">
            <div className="mb-5">
              <label
                htmlFor="deck-name"
                className="block mb-2 font-semibold text-gray-700 dark:text-gray-200"
              >
                単語帳の名前
              </label>
              <input
                type="text"
                id="deck-name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="TOEIC頻出単語"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23272f] text-gray-900 dark:text-gray-100 rounded-md outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="deck-description"
                className="block mb-2 font-semibold text-gray-700 dark:text-gray-200"
              >
                説明（任意）
              </label>
              <textarea
                id="deck-description"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                rows={4}
                placeholder="この単語帳についての説明を入力します"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23272f] text-gray-900 dark:text-gray-100 rounded-md outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                disabled={isLoading}
              ></textarea>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                公開設定
              </label>
              <div className="flex items-center gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  disabled={isLoading}
                  className={`w-full py-2 text-sm font-bold rounded-md transition-colors flex items-center justify-center disabled:opacity-50 ${
                    isPublic
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-2 border-blue-400 dark:border-blue-300 shadow'
                      : 'bg-white dark:bg-[#23272f] text-gray-500 dark:text-gray-400 border-2 border-blue-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  公開
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  disabled={isLoading}
                  className={`w-full py-2 text-sm font-bold rounded-md transition-colors flex items-center justify-center disabled:opacity-50 ${
                    !isPublic
                      ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 border-2 border-red-400 dark:border-red-300 shadow'
                      : 'bg-white dark:bg-[#23272f] text-gray-500 dark:text-gray-400 border-2 border-red-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  非公開
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-[#23272f] border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-5 py-2 transition-colors bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 font-semibold text-white transition-colors bg-blue-600 dark:bg-blue-700 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:bg-blue-400 dark:disabled:bg-blue-900"
            >
              {isLoading ? '処理中...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
