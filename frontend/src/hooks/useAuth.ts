'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged, getRedirectResult, User } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // リダイレクト認証の結果を取得
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user)
        }
      })
      .catch(() => {
        // 無視
      })

    // 通常の認証状態監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return { user, loading }
}
