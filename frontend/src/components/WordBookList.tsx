import Link from 'next/link'
import { WordBook } from '@/types'
import { LuBook, LuGlobe, LuLock, LuUser } from 'react-icons/lu'

interface WordBookListProps {
  wordbooks: WordBook[]
}

export default function WordBookList({ wordbooks }: WordBookListProps) {
  if (wordbooks.length === 0) {
    return (
      <div className="text-center py-8">
        <LuBook className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          単語帳が見つかりません
        </h3>
        <p className="text-gray-600 dark:text-gray-400">条件に一致する単語帳がありません</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {wordbooks.map((wordbook) => (
        <Link
          key={wordbook.id}
          href={`/word-list/${wordbook.id}`}
          className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md transition-all duration-200"
        >
          <div className="p-6">
            {/* ヘッダー部分 */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                  {wordbook.name}
                </h3>
                {wordbook.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {wordbook.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2">
                {wordbook.is_public ? (
                  <LuGlobe className="w-4 h-4 text-green-600 dark:text-green-400" title="公開" />
                ) : (
                  <LuLock className="w-4 h-4 text-gray-500 dark:text-gray-400" title="非公開" />
                )}
              </div>
            </div>

            {/* 統計情報 */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <LuBook className="w-4 h-4" />
                <span>{wordbook.num_words}語</span>
              </div>
              {wordbook.user_name && (
                <div className="flex items-center gap-1">
                  <LuUser className="w-4 h-4" />
                  <span className="truncate max-w-[100px]">
                    {wordbook.user_name}
                  </span>
                </div>
              )}
            </div>

            {/* 日付情報 */}
            <div className="text-xs text-gray-400 dark:text-gray-500">
              作成: {new Date(wordbook.created_at).toLocaleDateString('ja-JP')}
              {wordbook.updated_at !== wordbook.created_at && (
                <>
                  <br />
                  更新:{' '}
                  {new Date(wordbook.updated_at).toLocaleDateString('ja-JP')}
                </>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
