'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

/**
 * Firebaseの認証状態を取得するカスタムフック
 * @returns 現在のユーザー情報と読み込み状態を返すカスタムフック
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    // クリーンアップ関数
    return () => unsubscribe()
  }, [])

  return { user, loading }
}
