'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 読み込み中でなく、かつユーザーがログイン済みの場合
    if (!loading && user) {
      router.push('/') // ホームページにリダイレクト
    }
  }, [user, loading, router])

  // 読み込み中、または未ログインの場合は子コンポーネント（サインイン・サインアップページ）を表示
  if (loading || user) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
