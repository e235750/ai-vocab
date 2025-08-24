'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LuCircleUserRound,
  LuGlobe,
  LuSettings,
  LuLogOut,
  LuMenu,
  LuX,
  LuSearch,
} from 'react-icons/lu'
import { logout } from '@/lib/firebase/auth'

const FALLBACK_EMAIL = 'user@example.com'

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleWordbooksClick = () => {
    router.push('/wordbooks')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
      .then(() => {
        router.push('/sign-in')
      })
      .catch((error) => {
        console.error('Logout failed:', error)
        alert('ログアウトに失敗しました')
      })
    setIsUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴとナビゲーション */}
          <div className="flex items-center gap-5">
            <h1 className="text-2xl font-bold">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-400 transition-colors"
              >
                WordWise
              </Link>
            </h1>

            {/* デスクトップナビゲーション */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={handleWordbooksClick}
                className="flex items-center px-3 py-2 text-base bg-transparent border-none rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <LuGlobe className="w-4 h-4 mr-2" />
                単語帳一覧
              </button>
            </nav>

            {/* 検索フィールド */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="単語帳を検索..."
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-blue-500 dark:focus:border-blue-300 outline-none"
                />
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </form>
          </div>

          {/* 右側のアクション */}
          <div className="flex items-center gap-3">
            {/* デスクトップ用ユーザーメニュー */}
            <div className="hidden md:block relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                aria-label="ユーザーメニュー"
              >
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    width={24}
                    height={24}
                    alt="User Avatar"
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <LuCircleUserRound className="w-6 h-6" />
                )}
              </button>

              {/* デスクトップ用ユーザードロップダウン */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.displayName || 'ゲストユーザー'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || FALLBACK_EMAIL}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <LuCircleUserRound className="w-4 h-4 mr-3" />
                    プロフィール
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <LuSettings className="w-4 h-4 mr-3" />
                    設定
                  </Link>

                  <hr className="my-2 border-gray-200 dark:border-gray-700" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <LuLogOut className="w-4 h-4 mr-3" />
                    ログアウト
                  </button>
                </div>
              )}
            </div>

            {/* モバイル統合メニューボタン */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              aria-label="メニュー"
            >
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  width={20}
                  height={20}
                  alt="User Avatar"
                  className="w-5 h-5 rounded-full mr-2"
                />
              ) : (
                <LuCircleUserRound className="w-5 h-5 mr-2" />
              )}
              {isMobileMenuOpen ? (
                <LuX className="w-4 h-4" />
              ) : (
                <LuMenu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* モバイル統合メニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-3 bg-white dark:bg-gray-900">
            {/* ユーザー情報セクション */}
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
              <div className="flex items-center">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    width={32}
                    height={32}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                ) : (
                  <LuCircleUserRound className="w-8 h-8 mr-3 text-gray-400 dark:text-gray-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.displayName || 'ゲストユーザー'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || FALLBACK_EMAIL}
                  </p>
                </div>
              </div>
            </div>

            {/* ナビゲーションメニュー */}
            <div className="space-y-1">
              {/* 検索セクション（モバイル） */}
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="単語帳を検索..."
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-blue-500 dark:focus:border-blue-300 outline-none"
                    />
                    <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>
                </form>
              </div>

              <button
                onClick={() => {
                  handleWordbooksClick()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <LuGlobe className="w-5 h-5 mr-3" />
                単語帳一覧
              </button>

              {/* 区切り線 */}
              <hr className="my-2 border-gray-200 dark:border-gray-700" />

              {/* ユーザーアクション */}
              <Link
                href="/profile"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LuCircleUserRound className="w-5 h-5 mr-3" />
                プロフィール
              </Link>

              <Link
                href="/settings"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LuSettings className="w-5 h-5 mr-3" />
                設定
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <LuLogOut className="w-5 h-5 mr-3" />
                ログアウト
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
