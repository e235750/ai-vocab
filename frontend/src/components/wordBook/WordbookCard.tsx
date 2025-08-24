import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDeckStore } from '@/stores/deckStore'
import { useAuth } from '@/hooks/useAuth'
import { duplicateWordbook } from '@/lib/api/db'
import { LuUser, LuCalendar, LuBookOpen, LuGlobe, LuLock } from 'react-icons/lu'
import { Deck } from '@/types'
import DropdownMenu from '../DropdownMenu'
import { useWordbookMenuItems } from '@/hooks/useMenuItems'
import { PermissionLevel } from '@/types'

interface WordbookCardProps {
  wordbook: Deck
  activeTab: 'my' | 'public'
  onEdit: (wordbook: Deck) => void
  onDuplicate: (wordbook: Deck) => void
  onDelete: (wordbook: Deck) => void
}

export default function WordbookCard({
  wordbook,
  activeTab,
  onEdit,
  onDuplicate,
  onDelete,
}: WordbookCardProps) {
  const handleEdit = () => {
    onEdit(wordbook)
  }

  const handleDuplicate = () => {
    onDuplicate(wordbook)
  }

  const handleDelete = () => {
    if (
      !window.confirm(
        `単語帳「${wordbook.name}」を削除しますか？\n\nこの操作により、単語帳内のすべての単語も削除されます。\nこの操作は取り消せません。`
      )
    ) {
      return
    }

    onDelete(wordbook)
  }

  // 3点リーダーメニュー「カード学習」用
  const decks = useDeckStore((state) => state.decks)
  const handleViewCards = async () => {
    if (!user) {
      alert('ログインが必要です')
      return
    }
    // 既に同じIDの単語帳が存在する場合は複製せず選択のみ
    const exists = decks.some((deck) => deck.id === wordbook.id)
    if (exists) {
      selectDeck(wordbook.id)
      return
    }
    const duplicateData = {
      name: wordbook.name,
      description: wordbook.description,
      is_public: false,
      num_words: wordbook.num_words,
      user_name: user.displayName || user.email || 'Unknown',
    }
    const idToken = await user.getIdToken()
    const result = await duplicateWordbook(wordbook.id, duplicateData, idToken)
    if (result && result.id) {
      selectDeck(result.id)
    } else {
      alert('単語帳の複製に失敗しました')
    }
  }

  const permission: PermissionLevel = activeTab === 'my' ? 'owner' : 'public'
  const menuItems = useWordbookMenuItems({
    deckId: wordbook.id,
    permission,
    onEdit: handleEdit,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
    onViewCards: handleViewCards,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const router = useRouter()
  const { user } = useAuth()

  // 学習ボタン押下時の処理
  const selectDeck = useDeckStore((state) => state.selectDeck)
  const handleStartLearning = async () => {
    if (!user) {
      alert('ログインが必要です')
      return
    }
    // 既に同じIDの単語帳が存在する場合は複製せず選択のみ
    const exists = decks.some((deck) => deck.id === wordbook.id)
    if (exists) {
      selectDeck(wordbook.id)
      return
    }
    // 複製用データを作成
    const duplicateData = {
      name: wordbook.name,
      description: wordbook.description,
      is_public: false, // 複製は非公開で作成
      num_words: wordbook.num_words,
      user_name: user.displayName || user.email || 'Unknown',
    }
    // APIで複製
    const idToken = await user.getIdToken()
    const result = await duplicateWordbook(wordbook.id, duplicateData, idToken)
    if (result && result.id) {
      selectDeck(result.id) // zustandで選択
      router.push('/') // トップページに遷移
    } else {
      alert('単語帳の複製に失敗しました')
    }
  }

  return (
    <div className="bg-white dark:bg-[#23272f] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <Link href={`/word-list/${wordbook.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                {wordbook.name}
              </h3>
            </Link>
            <div className="h-10 overflow-hidden">
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                {wordbook.description || '説明なし'}
              </p>
            </div>
          </div>
          <div className="flex items-center ml-2 space-x-2">
            {wordbook.is_public ? (
              <LuGlobe className="w-4 h-4 text-green-500" title="公開" />
            ) : (
              <LuLock className="w-4 h-4 text-gray-400 dark:text-gray-600" title="非公開" />
            )}

            {/* ドロップダウンメニュー */}
            <DropdownMenu items={menuItems} />
          </div>
        </div>

        {/* メタ情報 - 固定の高さを設定 */}
        <div className="space-y-2 mb-4 text-sm text-gray-500 dark:text-gray-300 h-16 flex flex-col justify-start">
          <div className="flex items-center">
            <LuUser className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {wordbook.user_name || 'Unknown User'}
            </span>
          </div>
          <div className="flex items-center">
            <LuCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatDate(wordbook.created_at)}</span>
          </div>
          <div className="flex items-center">
            <LuBookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{wordbook.num_words || 0}語</span>
          </div>
        </div>

        {/* 学習ボタン - 複製してcardViewerに遷移 */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <button
            onClick={handleStartLearning}
            className="w-full text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            学習する
          </button>
        </div>
      </div>
    </div>
  )
}
