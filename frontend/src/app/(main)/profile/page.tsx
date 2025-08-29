'use client'
import { useAuth } from '@/hooks/useAuth'
import { useDeckStore } from '@/stores/deckStore'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getIdToken } from '@/lib/firebase/auth'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { decks, fetchDecks } = useDeckStore()
  const [page, setPage] = useState(1)
  const pageSize = 15

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const idToken = await getIdToken()
        if (!idToken) return
        await fetchDecks(idToken)
      }
    }
    fetch()
  }, [user, fetchDecks])

  // ローディング・未ログイン時の分岐はHooksの後
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="text-gray-700 dark:text-gray-200">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
            ログインが必要です
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            プロフィール情報を表示するにはログインしてください。
          </p>
        </div>
      </div>
    )
  }

  // user, decks, page, pageSizeのHooksの後、returnの直前で定義
  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-'

  const totalPages = Math.ceil(decks.length / pageSize)
  const pagedDecks = decks.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 dark:text-blue-300">
        プロフィール
      </h1>
      <div className="flex flex-row items-center mb-8 gap-8 border-1 border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
        {/* ユーザーアイコン */}
        <div className="flex-shrink-0 flex justify-center items-center">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt="ユーザーアイコン"
              className="w-32 h-32 rounded-full border-4 border-blue-300 shadow-lg"
              width={30}
              height={30}
            />
          ) : (
            <svg
              className="w-32 h-32 text-blue-400 dark:text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </div>
        {/* ユーザー情報 */}
        <div className="flex-1 grid grid-cols-1 gap-4">
          <div>
            <div className="font-semibold text-gray-700 dark:text-gray-200">
              ユーザー名
            </div>
            <div className="text-2xl flex items-center gap-2 text-gray-900 dark:text-gray-100">
              {user.displayName || user.email || 'No Name'}
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 dark:text-gray-200">
              メールアドレス
            </div>
            <div className="text-lg text-gray-900 dark:text-gray-100">
              {user.email || '未登録'}
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 dark:text-gray-200">
              アカウント作成日
            </div>
            <div className="text-lg text-gray-900 dark:text-gray-100">
              {createdAt}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-300 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-400 dark:text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 20h9"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          作成した単語帳（{decks.length}）
        </h2>
        {decks.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">
            まだ単語帳を作成していません。
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-md">
              {pagedDecks.map((deck) => (
                <li
                  key={deck.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                >
                  <Link
                    href={`/word-list/${deck.id}`}
                    className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-100">
                        {deck.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        作成日:{' '}
                        {new Date(deck.created_at).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-sm text-gray-600 dark:text-gray-300">
                      {deck.num_words}語
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="px-3 py-1 rounded border bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 disabled:opacity-50"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  前へ
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {page} / {totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded border bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 disabled:opacity-50"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
