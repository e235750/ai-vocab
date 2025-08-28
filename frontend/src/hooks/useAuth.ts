'use client'

import { useState, useEffect } from 'react'

import { onAuthStateChanged, getRedirectResult, User } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { getUserProfile, updateUserProfile } from '@/lib/api/user'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // リダイレクト認証の結果を取得
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        const userObj = result.user
        try {
          const idToken = await userObj.getIdToken()
          const profileRes = await getUserProfile(idToken)
          if (
            profileRes &&
            !('error' in profileRes) &&
            profileRes.display_name
          ) {
            // DBにdisplay_nameがある場合はuser.displayNameを上書き
            userObj.displayName = profileRes.display_name
          } else {
            // DBにdisplay_nameがない場合はuser.displayNameまたは'ゲストユーザー'をDBに保存
            const nameToSave = userObj.displayName || 'ゲストユーザー'
            await updateUserProfile(idToken, { display_name: nameToSave })
            userObj.displayName = nameToSave
          }
          setUser(userObj)
        } catch {
          setUser(userObj)
        }
      }
    })

    // 通常の認証状態監視
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      ;(async () => {
        if (user) {
          try {
            const idToken = await user.getIdToken()
            const profileRes = await getUserProfile(idToken)
            if (
              profileRes &&
              !('error' in profileRes) &&
              profileRes.display_name
            ) {
              user.displayName = profileRes.display_name
            } else {
              const nameToSave = user.displayName || 'ゲストユーザー'
              await updateUserProfile(idToken, { display_name: nameToSave })
              user.displayName = nameToSave
            }
            setUser(user)
          } catch {
            setUser(user)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      })()
    })
    return () => unsubscribe()
  }, [])

  return { user, loading }
}
