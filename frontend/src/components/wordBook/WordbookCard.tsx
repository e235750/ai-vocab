import Link from 'next/link'
import {
  LuUser,
  LuCalendar,
  LuBookOpen,
  LuGlobe,
  LuLock,
} from 'react-icons/lu'
import { Deck } from '@/types'
import DropdownMenu from '../DropdownMenu'
import { useWordbookMenuItems, type PermissionLevel } from '@/hooks/useMenuItems'

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

  // カスタムフックを使用してメニューアイテムを取得
  const permission: PermissionLevel = activeTab === 'my' ? 'owner' : 'public'
  const menuItems = useWordbookMenuItems({
    deckId: wordbook.id,
    permission,
    onEdit: handleEdit,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <Link href={`/word-list/${wordbook.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                {wordbook.name}
              </h3>
            </Link>
            <div className="h-10 overflow-hidden">
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {wordbook.description || '説明なし'}
              </p>
            </div>
          </div>
          <div className="flex items-center ml-2 space-x-2">
            {wordbook.is_public ? (
              <LuGlobe className="w-4 h-4 text-green-500" title="公開" />
            ) : (
              <LuLock className="w-4 h-4 text-gray-400" title="非公開" />
            )}

            {/* ドロップダウンメニュー */}
            <DropdownMenu items={menuItems} />
          </div>
        </div>

        {/* メタ情報 - 固定の高さを設定 */}
        <div className="space-y-2 mb-4 text-sm text-gray-500 h-16 flex flex-col justify-start">
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

        {/* 学習ボタン - 常に下部に固定 */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <Link
            href={`/word-list/${wordbook.id}`}
            className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            学習する
          </Link>
        </div>
      </div>
    </div>
  )
}
