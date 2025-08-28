'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import {
  getUserSettings,
  updateUserSettings,
  getUserProfile,
  updateUserProfile,
} from '@/lib/api/user'
import { useUserSettingsStore } from '@/stores/userSettingsStore'
import { useUserStore } from '@/stores/userStore'
import {
  FaSignOutAlt,
  FaTrashAlt,
  FaPalette,
  FaRegIdBadge,
  FaRegEye,
} from 'react-icons/fa'
import { logout, deleteUser } from '@/lib/firebase/auth'

// TODO: ユーザー名変更やアカウント設定をDBに保存する場合は、userスキーマやAPIエンドポイントの追加が必要です。

export default function SettingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { settings, setSettings } = useUserSettingsStore()
  const { profile, setProfile } = useUserStore()
  const [displayName, setDisplayName] = useState('')
  const [isCardAnimation, setIsCardAnimation] = useState(true)
  const [isSimpleCard, setIsSimpleCard] = useState(false)

  // ユーザー設定・プロフィール初期取得
  useEffect(() => {
    if (!user) return
    user.getIdToken().then(async (token: string) => {
      const [settingsRes, profileRes] = await Promise.all([
        getUserSettings(token),
        getUserProfile(token),
      ])
      if (settingsRes && !('error' in settingsRes)) {
        setSettings(settingsRes)
        setIsSimpleCard(settingsRes.simple_card_mode)
        if (typeof settingsRes.flip_animation === 'boolean') {
          setIsCardAnimation(settingsRes.flip_animation)
        }
      }
      if (profileRes && !('error' in profileRes)) {
        setProfile(profileRes)
        setDisplayName(profileRes.display_name || '')
      }
    })
  }, [user, setSettings, setProfile])

  // flip_animation変更時の処理
  const handleCardAnimationChange = async (checked: boolean) => {
    setIsCardAnimation(checked)
    if (!user) return
    const token = await user.getIdToken()
    const updated = await updateUserSettings(token, {
      ...settings,
      flip_animation: checked,
    })
    if (updated && !('error' in updated)) {
      setSettings(updated)
    } else {
      setSettings(null)
    }
  }

  // 設定変更時にAPIへ反映
  const handleSimpleCardChange = async (checked: boolean) => {
    setIsSimpleCard(checked)
    if (!user) return
    const token = await user.getIdToken()
    const updated = await updateUserSettings(token, {
      ...settings,
      simple_card_mode: checked,
    })
    if (updated && !('error' in updated)) {
      setSettings(updated)
    } else {
      setSettings(null)
    }
  }

  const handleDisplayNameChange = async () => {
    if (!user) return
    const token = await user.getIdToken()
    const updated = await updateUserProfile(token, {
      ...profile,
      display_name: displayName,
    })
    if (updated && !('error' in updated)) {
      setProfile(updated)
      window.location.reload()
    } else {
      setProfile(null)
    }
  }

  const handleLogout = () => {
    if (!window.confirm('ログアウトしますか？')) return
    logout()
      .then(() => {
        router.push('/sign-in')
      })
      .catch((error) => {
        console.error('Logout failed:', error)
        alert('ログアウトに失敗しました')
      })
  }
  const handleDeleteAccount = () => {
    if (
      !window.confirm(
        'アカウントを削除すると、すべてのデータが完全に消去され、元に戻すことはできません。本当に削除しますか？'
      )
    )
      return

    deleteUser()
      .then(() => {
        router.push('/sign-up')
      })
      .catch((error) => {
        console.error('Delete account failed:', error)
        alert('アカウント削除に失敗しました')
      })
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 dark:text-blue-300 flex items-center gap-3">
        <FaPalette className="text-blue-400 dark:text-blue-200 w-8 h-8" /> 設定
      </h1>

      {/* ユーザー設定 */}
      <section className="mb-10 flex flex-col gap-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
          <FaRegIdBadge className="w-6 h-6 text-blue-400" />
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            ユーザー名
          </span>
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
            {typeof profile?.display_name === 'string'
              ? profile.display_name
              : ''}
          </span>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded px-3 py-2 flex-1 text-gray-900 dark:text-gray-100 max-w-[180px] text-right"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <button
            className={`ml-2 px-4 py-2 rounded-lg text-white transition-colors shadow ${
              displayName
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!displayName}
            onClick={handleDisplayNameChange}
          >
            変更
          </button>
        </div>
      </section>

      {/* 表示・動作設定 */}
      <section className="mb-10 flex flex-col gap-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
          <FaRegEye className="w-6 h-6 text-blue-400" />
          <span className="font-semibold flex-1 text-gray-700 dark:text-gray-200">
            カードのアニメーション
          </span>
          <label className="flex cursor-pointer select-none items-center">
            <div className="relative">
              <input
                type="checkbox"
                checked={isCardAnimation}
                onChange={(e) => handleCardAnimationChange(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block h-8 w-14 rounded-full transition-colors duration-300 ${
                  isCardAnimation
                    ? 'bg-blue-500'
                    : 'bg-[#E5E7EB] dark:bg-gray-700'
                }`}
              ></div>
              <div
                className={`dot absolute top-1 left-1 h-6 w-6 rounded-full transition-all duration-300 ${
                  isCardAnimation
                    ? 'bg-blue-100 translate-x-6'
                    : 'bg-white translate-x-0'
                }`}
              ></div>
            </div>
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-300 w-10 inline-block text-center">
              {isCardAnimation ? 'ON' : 'OFF'}
            </span>
          </label>
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
          <FaRegEye className="w-6 h-6 text-blue-400" />
          <span className="font-semibold flex-1 text-gray-700 dark:text-gray-200">
            単語カード簡易表示モード
          </span>
          <label className="flex cursor-pointer select-none items-center">
            <div className="relative">
              <input
                type="checkbox"
                checked={isSimpleCard}
                onChange={(e) => handleSimpleCardChange(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block h-8 w-14 rounded-full transition-colors duration-300 ${
                  isSimpleCard ? 'bg-blue-500' : 'bg-[#E5E7EB] dark:bg-gray-700'
                }`}
              ></div>
              <div
                className={`dot absolute top-1 left-1 h-6 w-6 rounded-full transition-all duration-300 ${
                  isSimpleCard
                    ? 'bg-blue-100 translate-x-6'
                    : 'bg-white translate-x-0'
                }`}
              ></div>
            </div>
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-300 w-10 inline-block text-center">
              {isSimpleCard ? 'ON' : 'OFF'}
            </span>
          </label>
        </div>
      </section>

      {/* アカウント操作 */}
      <section className="mb-10 flex flex-col gap-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
          <FaSignOutAlt className="w-6 h-6 text-blue-400" />
          <span className="font-semibold flex-1 text-gray-700 dark:text-gray-200">
            ログアウト
          </span>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow"
            onClick={handleLogout}
          >
            ログアウト
          </button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
          <FaTrashAlt className="w-6 h-6 text-red-400" />
          <span className="font-semibold flex-1 text-gray-700 dark:text-gray-200">
            アカウント削除
          </span>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow"
            onClick={handleDeleteAccount}
          >
            削除
          </button>
        </div>
      </section>
    </div>
  )
}
