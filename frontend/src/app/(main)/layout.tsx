'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarkStore } from '@/stores/bookmarkStore'
import Header from '@/components/Header'
import Loading from '@/components/Loading'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { loadBookmarks, isLoaded: bookmarksLoaded } = useBookmarkStore()

  useEffect(() => {
    // 読み込みが完了し、かつユーザーがいない場合
    if (!loading && !user) {
      router.push('/sign-in') // サインインページにリダイレクト
    }
  }, [user, loading, router])

  // ユーザーがログインしたら、ブックマークを初期化
  useEffect(() => {
    const initializeBookmarks = async () => {
      if (user && !bookmarksLoaded) {
        try {
          await loadBookmarks()
        } catch (error) {
          console.error('Error loading bookmarks in layout:', error)
        }
      }
    }
    initializeBookmarks()
  }, [user, loadBookmarks, bookmarksLoaded])

  // 読み込み中、または未ログイン（リダイレクト待ち）の場合はローディング表示
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loading />
      </div>
    )
  }

  // ログイン済みの場合は子ページを表示
  return (
    <>
      <Header />
      {children}
    </>
  )
}
