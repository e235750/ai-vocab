'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  FaUserEdit,
  FaSignOutAlt,
  FaTrashAlt,
  FaPalette,
  FaRegIdBadge,
  FaRegEye,
  FaRegMoon,
} from 'react-icons/fa'

// TODO: ユーザー名変更やアカウント設定をDBに保存する場合は、userスキーマやAPIエンドポイントの追加が必要です。

export default function SettingPage() {
  const { user } = useAuth()
  // TODO: logout, deleteAccount, updateDisplayName などはuseAuthやAPIで実装推奨
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [isCardAnimation, setIsCardAnimation] = useState(true)
  const [isSimpleCard, setIsSimpleCard] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  // ...existing code...
  const [isLogout, setIsLogout] = useState(false)
  const [isDeleteAccount, setIsDeleteAccount] = useState(false)

  // トグルON時のみ実行し、すぐOFFに戻す
  // ...existing code...
  const handleLogoutToggle = (checked: boolean) => {
    if (checked) {
      alert('ログアウトは未実装です。useAuthにlogout追加推奨。')
      setIsLogout(false)
    } else {
      setIsLogout(false)
    }
  }
  const handleDeleteAccountToggle = (checked: boolean) => {
    if (checked) {
      alert('アカウント削除は未実装です。DB/API設計が必要です。')
      setIsDeleteAccount(false)
    } else {
      setIsDeleteAccount(false)
    }
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
            {user?.displayName ?? ''}
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
            onClick={() =>
              alert('ユーザー名の変更は未実装です。DB/API設計が必要です。')
            }
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
            カードViewerアニメーション
          </span>
          <label className="flex cursor-pointer select-none items-center">
            <div className="relative">
              <input
                type="checkbox"
                checked={isCardAnimation}
                onChange={(e) => setIsCardAnimation(e.target.checked)}
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
                onChange={(e) => setIsSimpleCard(e.target.checked)}
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
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
          <FaRegMoon className="w-6 h-6 text-blue-400" />
          <span className="font-semibold flex-1 text-gray-700 dark:text-gray-200">
            ダークモード
          </span>
          <label className="flex cursor-pointer select-none items-center">
            <div className="relative">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block h-8 w-14 rounded-full transition-colors duration-300 ${
                  isDarkMode ? 'bg-blue-500' : 'bg-[#E5E7EB] dark:bg-gray-700'
                }`}
              ></div>
              <div
                className={`dot absolute top-1 left-1 h-6 w-6 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-blue-100 translate-x-6'
                    : 'bg-white translate-x-0'
                }`}
              ></div>
            </div>
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-300 w-10 inline-block text-center">
              {isDarkMode ? 'ON' : 'OFF'}
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
            onClick={() =>
              alert('ログアウトは未実装です。useAuthにlogout追加推奨。')
            }
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
            onClick={() =>
              alert('アカウント削除は未実装です。DB/API設計が必要です。')
            }
          >
            削除
          </button>
        </div>
      </section>
    </div>
  )
}
