'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDeckStore } from '@/stores/deckStore'
import { useAuth } from '@/hooks/useAuth'
import { useDeckMenuItems } from '@/hooks/useMenuItems'
import {
  addCard,
  updateCard,
  deleteCard,
  deleteWordbook,
  duplicateWordbook,
} from '@/lib/api/db'
import WordList from '@/components/WordList'
import Loading from '@/components/Loading'
import AddCardForm from '@/components/cardForm/AddCardForm'
import EditDeck from '@/components/wordBook/EditDeck'
import DuplicateDeck from '@/components/wordBook/DuplicateDeck'
import DropdownMenu from '@/components/DropdownMenu'
import { Card, NewCard, Deck, PermissionLevel } from '@/types'

export default function Page() {
  const { id } = useParams()
  const { user } = useAuth()
  const [words, setWords] = useState<Card[]>([])
  const [deckName, setDeckName] = useState<string>('')
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false)
  const router = useRouter()

  const { loading, error, initializeDeckData, fetchWordsInDeck, decks } =
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
  }

  const handleEdit = () => {
    setIsEditOpen(true)
  }

  const handleDuplicate = () => {
    setIsDuplicateOpen(true)
  }

  const handleDelete = () => {
    handleDeleteWordbook()
  }

  // 権限レベルを判定
  const isOwner =
    currentDeck && user && currentDeck.user_name === user.displayName
  const selectDeck = useDeckStore((state) => state.selectDeck)

  // カード学習ボタン用ハンドラ
  const handleStartLearning = async () => {
    if (!user || !currentDeck) {
      alert('ログインが必要です')
      return
    }
    // 既に同じIDの単語帳が存在する場合は複製せず選択のみ
    const exists = decks.some((deck) => deck.id === currentDeck.id)
    if (exists) {
      selectDeck(currentDeck.id)
      return
    }
    const duplicateData = {
      name: currentDeck.name,
      description: currentDeck.description,
      is_public: false,
      num_words: currentDeck.num_words,
      user_name: user.displayName || user.email || 'Unknown',
    }
    const idToken = await user.getIdToken()
    const result = await duplicateWordbook(
      currentDeck.id,
      duplicateData,
      idToken
    )
    if (result && result.id) {
      selectDeck(result.id)
    } else {
      alert('単語帳の複製に失敗しました')
    }
  }
  const permission: PermissionLevel = isOwner
    ? 'owner'
    : currentDeck?.is_public
    ? 'public'
    : 'readonly'

  // カスタムフックを使用してメニューアイテムを取得
  const menuItems = useDeckMenuItems({
    deckId: wordbookId,
    permission,
    onEdit: handleEdit,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
    onViewCards: handleStartLearning,
  })

  const handleEditClose = () => {
    setIsEditOpen(false)
  }

  const handleEditUpdate = async () => {
    // データを再取得して表示を更新
    if (!wordbookId || !user) return

    try {
      const idToken = await user.getIdToken()
      const { words: fetchedWords, deckName: fetchedDeckName } =
        await initializeDeckData(wordbookId, idToken)
      setWords(fetchedWords)
      setDeckName(fetchedDeckName)
    } catch (error) {
      console.error('データの再取得に失敗しました:', error)
    }
  }

  const handleDuplicateClose = () => {
    setIsDuplicateOpen(false)
  }

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

  // 現在のdeckを設定
  useEffect(() => {
    if (wordbookId && decks.length > 0) {
      const currentDeckData = decks.find((deck) => deck.id === wordbookId)
      if (currentDeckData) {
        setCurrentDeck(currentDeckData)
      }
    }
  }, [wordbookId, decks])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            エラー
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {deckName || '単語帳'}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <p>{words.length}個の単語が登録されています</p>
                {permission !== 'owner' && currentDeck?.user_name && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    作成者: {currentDeck.user_name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* 3点リーダーメニュー */}
              <div className="relative">
                <DropdownMenu items={menuItems} />
              </div>

              {/* 単語追加ボタン - 所有者のみ表示 */}
              {permission === 'owner' && (
                <button
                  onClick={() => setIsAddingCard(!isAddingCard)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white dark:text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
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
              )}
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
              onUpdate={permission === 'owner' ? handleUpdateCard : undefined}
              onDelete={permission === 'owner' ? handleDeleteCard : undefined}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4"
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                単語がありません
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {permission === 'owner'
                  ? 'この単語帳にはまだ単語が登録されていません。'
                  : 'この単語帳には単語が登録されていません。'}
              </p>
              {permission === 'owner' && (
                <button
                  onClick={() => setIsAddingCard(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white dark:text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors"
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
              )}
            </div>
          </div>
        )}
      </div>

      {/* 編集モーダル - 所有者のみ */}
      {permission === 'owner' && (
        <EditDeck
          isOpen={isEditOpen}
          onClose={handleEditClose}
          deck={currentDeck}
          onUpdate={handleEditUpdate}
        />
      )}

      {/* 複製モーダル */}
      <DuplicateDeck
        isOpen={isDuplicateOpen}
        onClose={handleDuplicateClose}
        sourceDeck={currentDeck}
      />
    </div>
  )
}
