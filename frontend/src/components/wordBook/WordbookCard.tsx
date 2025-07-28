import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  LuUser,
  LuCalendar,
  LuBookOpen,
  LuGlobe,
  LuLock,
  LuPencil,
  LuTrash2,
  LuCopy,
  LuList,
} from 'react-icons/lu'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Deck } from '@/types'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    onEdit(wordbook)
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    onDuplicate(wordbook)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)

    if (
      !window.confirm(
        `単語帳「${wordbook.name}」を削除しますか？\n\nこの操作により、単語帳内のすべての単語も削除されます。\nこの操作は取り消せません。`
      )
    ) {
      return
    }

    onDelete(wordbook)
  }

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

            {/* 3点メニュー */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleMenuClick}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                title="メニューを開く"
              >
                <BsThreeDotsVertical className="w-5 h-5" />
              </button>

              {/* ドロップダウンメニュー */}
              {isMenuOpen && (
                <div className="absolute right-0 top-8 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <Link
                      href={`/word-list/${wordbook.id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LuList className="w-4 h-4 mr-3" />
                      単語一覧を見る
                    </Link>

                    {activeTab === 'my' && (
                      <>
                        <button
                          onClick={handleEdit}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LuPencil className="w-4 h-4 mr-3" />
                          編集
                        </button>

                        <button
                          onClick={handleDuplicate}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <LuCopy className="w-4 h-4 mr-3" />
                          複製
                        </button>

                        <hr className="my-1" />

                        <button
                          onClick={handleDelete}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LuTrash2 className="w-4 h-4 mr-3" />
                          削除
                        </button>
                      </>
                    )}

                    {activeTab === 'public' && (
                      <button
                        onClick={handleDuplicate}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LuCopy className="w-4 h-4 mr-3" />
                        複製
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
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
