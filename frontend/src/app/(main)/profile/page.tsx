'use client'
import { useAuth } from '@/hooks/useAuth'
import { useDeckStore } from '@/stores/deckStore'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { decks, fetchDecks } = useDeckStore()
  const [page, setPage] = useState(1)
  const pageSize = 15

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const idToken = await user.getIdToken()
        await fetchDecks(idToken)
      }
    }
    fetch()
  }, [user, fetchDecks])

  // ローディング・未ログイン時の分岐はHooksの後
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">ログインが必要です</h2>
          <p className="text-gray-600">
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

  const myDecks =
    user && decks
      ? decks
          .filter((deck) => deck.user_name === (user.displayName || user.email))
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
      : []

  const totalPages = Math.ceil(myDecks.length / pageSize)
  const pagedDecks = myDecks.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">プロフィール</h1>
      <div className="flex flex-row items-center mb-8 gap-8 border-1 border-gray-300 rounded-lg p-6">
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
              className="w-32 h-32 text-blue-400"
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
            <div className="font-semibold text-gray-700">ユーザー名</div>
            <div className="text-2xl flex items-center gap-2">
              {user.displayName || user.email || 'No Name'}
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700">メールアドレス</div>
            <div className="text-lg">{user.email || '未登録'}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-700">アカウント作成日</div>
            <div className="text-lg">{createdAt}</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3 text-blue-600 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-400"
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
          作成した単語帳（{myDecks.length}）
        </h2>
        {myDecks.length === 0 ? (
          <div className="text-gray-500">まだ単語帳を作成していません。</div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 bg-gray-50 rounded-lg shadow-sm">
              {pagedDecks.map((deck) => (
                <li
                  key={deck.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Link
                    href={`/word-list/${deck.id}`}
                    className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">
                        {deck.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        作成日:{' '}
                        {new Date(deck.created_at).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 text-sm text-gray-600">
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
                  className="px-3 py-1 rounded border bg-white text-blue-600 disabled:opacity-50"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  前へ
                </button>
                <span className="text-sm text-gray-700">
                  {page} / {totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded border bg-white text-blue-600 disabled:opacity-50"
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
