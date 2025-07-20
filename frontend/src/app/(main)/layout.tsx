'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { logout, deleteUser } from '@/lib/firebase/auth'
import Header from '@/components/Header'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 読み込みが完了し、かつユーザーがいない場合
    if (!loading && !user) {
      router.push('/sign-in') // サインインページにリダイレクト
    }
  }, [user, loading, router])

  // 読み込み中、または未ログイン（リダイレクト待ち）の場合はローディング表示
  if (loading || !user) {
    return <div>Loading...</div>
  }

  // ログイン済みの場合は子ページを表示
  return (
    <>
      <Header />
      <button
        onClick={() => {
          logout()
        }}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 transition-colors"
      >
        logout
      </button>
      <button
        onClick={() => {
          deleteUser()
        }}
        className="fixed bottom-4 right-30 bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition-colors"
      >
        delete account
      </button>
      {children}
    </>
  )
}
