'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDeckStore } from '@/stores/deckStore'
import { useAuth } from '@/hooks/useAuth'
import { addCard, updateCard, deleteCard, deleteWordbook } from '@/lib/api/db'
import WordList from '@/components/WordList'
import Loading from '@/components/Loading'
import AddCardForm from '@/components/cardForm/AddCardForm'
import { Card, NewCard } from '@/types'

export default function Page() {
  const { id } = useParams()
  const { user } = useAuth()
  const [words, setWords] = useState<Card[]>([])
  const [deckName, setDeckName] = useState<string>('')
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { loading, error, initializeDeckData, fetchWordsInDeck } =
    useDeckStore()

  // 単語帳IDを文字列として取得
  const wordbookId = Array.isArray(id) ? id[0] : id

  // 単語追加ハンドラー
  const handleAddCard = async (newCard: NewCard, idToken: string) => {
    if (!wordbookId) return

    try {
      const result = await addCard(newCard, idToken)

      // 追加されたカードをローカル状態に即座に追加（最後に配置）
      if (result && result.id) {
        const newCardWithId = {
          ...newCard,
          id: result.id,
          created_at: result.created_at || new Date().toISOString(),
          updated_at: result.updated_at || new Date().toISOString(),
        }
        setWords((prevWords) => [...prevWords, newCardWithId])
      } else {
        // 結果がない場合は再取得
        const updatedWords = await fetchWordsInDeck(wordbookId, idToken)
        setWords(updatedWords)
      }

      setIsAddingCard(false)
    } catch (error) {
      console.error('カードの追加に失敗しました:', error)
    }
  }

  // 単語更新ハンドラー
  const handleUpdateCard = async (cardId: string, updatedCard: NewCard) => {
    if (!user || !wordbookId) return

    try {
      const idToken = await user.getIdToken()
      await updateCard(cardId, updatedCard, idToken)
      // 単語リストを再取得
      const updatedWords = await fetchWordsInDeck(wordbookId, idToken)
      setWords(updatedWords)
    } catch (error) {
      console.error('カードの更新に失敗しました:', error)
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    if (!user || !wordbookId) return
    try {
      const idToken = await user.getIdToken()
      await deleteCard(cardId, idToken)
      // 単語リストを再取得
      const updatedWords = await fetchWordsInDeck(wordbookId, idToken)
      setWords(updatedWords)
    } catch (error) {
      console.error('カードの削除に失敗しました:', error)
    }
  }

  const handleDeleteWordbook = async () => {
    if (!user || !wordbookId) return

    const confirmMessage = `単語帳「${deckName}」を削除しますか？\n\nこの操作により、単語帳内のすべての単語も削除されます。\nこの操作は取り消せません。`

    if (!window.confirm(confirmMessage)) return

    try {
      const idToken = await user.getIdToken()
      const result = await deleteWordbook(wordbookId, idToken)

      if (result.error) {
        console.error('単語帳の削除に失敗しました:', result.error)
        alert('単語帳の削除に失敗しました。もう一度お試しください。')
      } else {
        alert('単語帳を削除しました。')
        router.push('/')
      }
    } catch (error) {
      console.error('単語帳の削除に失敗しました:', error)
      alert('単語帳の削除に失敗しました。もう一度お試しください。')
    }

    setIsMenuOpen(false)
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  // メニューの外側をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!wordbookId || !user) return

    const initializeData = async () => {
      try {
        const idToken = await user.getIdToken()
        const { words: fetchedWords, deckName: fetchedDeckName } =
          await initializeDeckData(wordbookId, idToken)
        setWords(fetchedWords)
        setDeckName(fetchedDeckName)
      } catch (err) {
        console.error('Error initializing data:', err)
      }
    }

    initializeData()
  }, [wordbookId, user, initializeDeckData])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">エラー</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {deckName || '単語帳'}
              </h1>
              <p className="text-gray-600">
                {words.length}個の単語が登録されています
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* 3点リーダーメニュー */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={handleMenuClick}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="メニューを開く"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {/* ドロップダウンメニュー */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      onClick={handleDeleteWordbook}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        単語帳を削除
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* 単語追加ボタン */}
              <button
                onClick={() => setIsAddingCard(!isAddingCard)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {isAddingCard ? '閉じる' : '単語を追加'}
              </button>
            </div>
          </div>
        </div>

        {/* 単語追加フォーム */}
        {isAddingCard && wordbookId && (
          <div className="mb-8">
            <AddCardForm
              selectedDeckId={wordbookId}
              onAddCard={handleAddCard}
            />
          </div>
        )}

        {/* 単語リストまたは空の状態 */}
        {words.length > 0 ? (
          <div className="flex justify-center">
            <WordList
              words={words}
              onUpdate={handleUpdateCard}
              onDelete={handleDeleteCard}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                単語がありません
              </h3>
              <p className="text-gray-500 mb-4">
                この単語帳にはまだ単語が登録されていません。
              </p>
              <button
                onClick={() => setIsAddingCard(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                最初の単語を追加
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
