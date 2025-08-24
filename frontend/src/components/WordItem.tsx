import { useState, useEffect } from 'react'
import { Card, NewCard } from '@/types'
import EditFormCore from './cardForm/EditFormCore'
import DropdownMenu from './DropdownMenu'
import AudioPlayButton from './AudioPlayButton'
import { useWordMenuItems } from '@/hooks/useMenuItems'
import { PermissionLevel } from '@/types'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarkStore } from '@/stores/bookmarkStore'

type WordItemProps = {
  word: Card
  permission?: PermissionLevel
  onEdit?: (word: Card) => void
  onUpdate?: (wordId: string, updatedCard: NewCard) => void
  onDelete?: (wordId: string) => void
}

export default function WordItem({
  word,
  permission = 'owner', // デフォルトは所有者権限
  onEdit,
  onUpdate,
  onDelete,
}: WordItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const { user } = useAuth()
  const {
    toggleBookmark,
    loadBookmarks,
    isCardBookmarked,
    loading: bookmarkLoading,
    isLoaded: bookmarksLoaded,
  } = useBookmarkStore()

  // ブックマーク一覧を初期読み込み（まだロードされていない場合のみ）
  useEffect(() => {
    const loadBookmarksData = async () => {
      if (user && !bookmarksLoaded) {
        try {
          await loadBookmarks()
        } catch (error) {
          console.error('Error loading bookmarks:', error)
        }
      }
    }
    loadBookmarksData()
  }, [user, loadBookmarks, bookmarksLoaded])

  // 詳細情報がある場合のみアコーディオンを開けるようにする
  const hasDetails =
    (word.synonyms && word.synonyms.length > 0) ||
    (word.example_sentences && word.example_sentences.length > 0) ||
    (word.phonetics && (word.phonetics.text || word.phonetics.audio))

  const handleEditSubmit = (updatedCard: NewCard) => {
    if (onUpdate) {
      onUpdate(word.id, updatedCard)
    }
    setIsEditMode(false)
  }

  const handleEditCancel = () => {
    setIsEditMode(false)
  }

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation() // アコーディオンの開閉を防ぐ
    e.preventDefault()

    if (!word || !user) {
      alert('認証エラーが発生しました')
      return
    }

    try {
      await toggleBookmark(word.id)
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      alert('ブックマークの操作に失敗しました')
    }
  }

  const handleCardClick = () => {
    if (hasDetails) {
      setIsOpen(!isOpen)
    }
  }

  // ドロップダウンメニューのアイテムを定義
  const menuItems = useWordMenuItems({
    permission,
    onEdit: () => {
      setIsEditMode(true)
      if (onEdit) {
        onEdit(word)
      }
    },
    onDelete: () => {
      if (!window.confirm('このカードを削除しますか？')) return
      if (onDelete) {
        onDelete(word.id)
      }
      setIsEditMode(false)
      setIsOpen(false)
    },
  })

  return (
    <div className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/60 transition-colors">
      {/* --- アコーディオンヘッダー --- */}
  <div className="relative p-5 sm:px-6 sm:py-6">
        {/* 右上のボタンエリア */}
  <div className="absolute flex top-3 right-3">
          {/* ブックマークボタン */}
          {user && (
            <button
              onClick={handleBookmarkToggle}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={
                isCardBookmarked(word.id)
                  ? 'ブックマークを削除'
                  : 'ブックマークに追加'
              }
              disabled={bookmarkLoading}
            >
              {isCardBookmarked(word.id) ? (
                <FaBookmark size={16} className="text-yellow-500 dark:text-yellow-400" />
              ) : (
                <FaRegBookmark size={16} />
              )}
            </button>
          )}
          {/* ドロップダウンメニュー */}
          <DropdownMenu
            items={menuItems}
            buttonClassName="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            menuClassName="absolute right-0 top-8 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
          />
        </div>

        <div className="flex justify-between items-center">
          {isEditMode ? (
            // 編集モード
            <div className="flex-1 pr-20">
              <EditFormCore
                cardData={word}
                onSubmit={handleEditSubmit}
                onCancel={handleEditCancel}
                submitButtonText="変更を保存"
                className="p-6 bg-white border-2 border-blue-500 rounded-xl flex flex-col gap-6 shadow-lg"
              />
            </div>
          ) : (
            // 通常表示モード
            <div
              className="flex-1 min-w-0 cursor-pointer pr-20"
              onClick={handleCardClick}
            >
              {/* 英単語表示 */}
              <div className="flex items-center gap-4">
                <span className="font-bold text-xl text-slate-900 dark:text-gray-100 leading-tight">
                  {word.english}
                </span>
              </div>

              {/* 定義表示（簡易表示） */}
              <div className="mt-3 space-y-2">
                {word.definitions && word.definitions.length > 0 && (
                  <>
                    {word.definitions.map((def, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded tracking-wide">
                          {def.part_of_speech}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {def.japanese.map((jp, i) => (
                            <span
                              key={i}
                              className="text-slate-700 dark:text-gray-200 font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                            >
                              {jp}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* アコーディオン矢印 */}
          {hasDetails && !isEditMode && (
            <button
              onClick={handleCardClick}
              className="flex-shrink-0 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* --- アコーディオンの中身 --- */}
      {!isEditMode && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden max-h-0 ${
            isOpen ? 'max-h-[1000px]' : ''
          }`}
        >
          <div className="bg-gray-50/70 dark:bg-gray-800/80 p-4 sm:px-6 sm:py-5 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              {/* 発音記号と音声 */}
              {word.phonetics &&
                (word.phonetics.text || word.phonetics.audio) && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      発音
                    </h3>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        {word.phonetics.text && (
                          <span className="text-slate-600 dark:text-gray-200 text-lg font-mono bg-slate-100 dark:bg-gray-800 px-3 py-2 rounded">
                            {word.phonetics.text}
                          </span>
                        )}
                        {word.phonetics.audio && (
                          <AudioPlayButton audioUrl={word.phonetics.audio} />
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* 類義語 */}
              {word.synonyms && word.synonyms.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                    類義語
                  </h3>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {word.synonyms.map((synonym, index) => (
                        <span
                          key={index}
                          className="text-slate-700 dark:text-gray-200 font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                        >
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 例文 */}
              {word.example_sentences && word.example_sentences.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                    例文
                  </h3>
                  <div className="space-y-4">
                    {word.example_sentences.map((sentence, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                      >
                        <p className="text-gray-900 dark:text-gray-100 font-medium mb-2 leading-relaxed">
                          {sentence.english}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {sentence.japanese}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
