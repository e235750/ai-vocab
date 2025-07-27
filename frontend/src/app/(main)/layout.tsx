'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
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
      {children}
    </>
  )
}
