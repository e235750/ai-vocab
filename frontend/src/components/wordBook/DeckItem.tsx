import { useState, useEffect, useRef } from 'react'
import { Deck } from '@/types'
import Link from 'next/link'

type DeckItemProps = {
  deck: Deck
  isActive: boolean
  onSelect: (id: string) => void
  onEdit?: (deck: Deck) => void
  onDelete?: (deckId: string) => void
  onDuplicate?: (deck: Deck) => void
}

export default function DeckItem({
  deck,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}: DeckItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const activeClasses = isActive
    ? 'bg-indigo-50 border-indigo-400'
    : 'bg-white border-gray-300 hover:bg-gray-50'

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
    e.stopPropagation() // 親のonSelectが呼ばれないようにする
    setIsMenuOpen(!isMenuOpen)
  }

  const handleViewWords = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    // Linkコンポーネントが遷移を行う
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    if (onEdit) {
      onEdit(deck)
    }
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    if (onDuplicate) {
      onDuplicate(deck)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)

    if (
      !window.confirm(
        `単語帳「${deck.name}」を削除しますか？\n\nこの操作により、単語帳内のすべての単語も削除されます。\nこの操作は取り消せません。`
      )
    ) {
      return
    }

    if (onDelete) {
      onDelete(deck.id)
    }
  }

  return (
    <li
      className={`border rounded-lg cursor-pointer transition-colors duration-150 ${activeClasses} relative`}
      onClick={() => onSelect(deck.id)}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <span className="font-medium">{deck.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-sm bg-gray-200 rounded-full">
            {deck.num_words}
          </span>

          {/* 3点メニューボタン */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleMenuClick}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="メニューを開く"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* ドロップダウンメニュー */}
            {isMenuOpen && (
              <div className="absolute right-0 top-8 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <Link
                    href={`/word-list/${deck.id}`}
                    onClick={handleViewWords}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    単語一覧を見る
                  </Link>

                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    編集
                  </button>

                  <button
                    onClick={handleDuplicate}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    複製
                  </button>

                  <hr className="my-1" />

                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
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
                    削除
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
