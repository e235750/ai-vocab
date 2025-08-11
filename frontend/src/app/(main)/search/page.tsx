'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchWordbooks, SearchResponse } from '@/lib/api/db'
import WordBookList from '@/components/WordBookList'
import Loading from '@/components/Loading'
import { LuFilter, LuSearch } from 'react-icons/lu'
import { useAuth } from '@/hooks/useAuth'

interface SearchFilters {
  isPublic: boolean | null
  isOwned: boolean | null
  minWords: number | null
  sortBy: string
  sortOrder: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const { user } = useAuth()

  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState<SearchFilters>({
    isPublic: null,
    isOwned: null,
    minWords: null,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  const performSearch = useCallback(async (page: number = 1) => {
    if (!query.trim() || !user) return

    setLoading(true)
    setError(null)

    try {
      const idToken = await user.getIdToken()
      
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (filters.isPublic !== null) params.append('is_public', filters.isPublic.toString())
      if (filters.isOwned !== null) params.append('is_owned', filters.isOwned.toString())
      if (filters.minWords !== null) params.append('min_words', filters.minWords.toString())
      params.append('sort_by', filters.sortBy)
      params.append('sort_order', filters.sortOrder)
      params.append('page', page.toString())
      params.append('limit', '20')

      const response = await searchWordbooks(params.toString(), idToken)
      
      if ('error' in response) {
        setError(response.error)
        setSearchResults(null)
      } else {
        setSearchResults(response)
        setCurrentPage(page)
      }
    } catch (err) {
      setError('検索中にエラーが発生しました')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [query, filters, user])

  useEffect(() => {
    if (query) {
      performSearch(1)
    }
  }, [query, performSearch])

  const handleFilterChange = () => {
    performSearch(1)
  }

  const handlePageChange = (page: number) => {
    performSearch(page)
  }

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <LuSearch className="mx-auto w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">単語帳を検索</h2>
          <p className="text-gray-600">上部の検索バーから単語帳を検索してください</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 検索ヘッダー */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          「{query}」の検索結果
        </h1>
        {searchResults && (
          <p className="text-gray-600">
            {searchResults.total}件中 {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, searchResults.total)}件を表示
          </p>
        )}
      </div>

      {/* フィルターボタン */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <LuFilter className="w-4 h-4" />
          フィルター
        </button>
      </div>

      {/* フィルターパネル */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 公開設定フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公開設定
              </label>
              <select
                value={filters.isPublic === null ? '' : filters.isPublic.toString()}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    isPublic: e.target.value === '' ? null : e.target.value === 'true'
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">全て</option>
                <option value="true">公開のみ</option>
                <option value="false">非公開のみ</option>
              </select>
            </div>

            {/* 所有者フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所有者
              </label>
              <select
                value={filters.isOwned === null ? '' : filters.isOwned.toString()}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    isOwned: e.target.value === '' ? null : e.target.value === 'true'
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">全て</option>
                <option value="true">自分の単語帳のみ</option>
                <option value="false">他人の単語帳のみ</option>
              </select>
            </div>

            {/* 最小単語数フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最小単語数
              </label>
              <input
                type="number"
                min="0"
                value={filters.minWords || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minWords: e.target.value ? parseInt(e.target.value) : null
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="例: 10"
              />
            </div>

            {/* ソート設定 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                並び順
              </label>
              <select
                value={`${filters.sortBy}_${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('_')
                  setFilters({
                    ...filters,
                    sortBy,
                    sortOrder
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="created_at_desc">作成日（新しい順）</option>
                <option value="created_at_asc">作成日（古い順）</option>
                <option value="updated_at_desc">更新日（新しい順）</option>
                <option value="updated_at_asc">更新日（古い順）</option>
                <option value="num_words_desc">単語数（多い順）</option>
                <option value="num_words_asc">単語数（少ない順）</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleFilterChange}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              フィルターを適用
            </button>
          </div>
        </div>
      )}

      {/* 検索結果 */}
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : searchResults ? (
        <>
          {searchResults.wordbooks.length === 0 ? (
            <div className="text-center py-8">
              <LuSearch className="mx-auto w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">検索結果が見つかりません</h3>
              <p className="text-gray-600">検索条件を変更してお試しください</p>
            </div>
          ) : (
            <>
              <WordBookList wordbooks={searchResults.wordbooks} />
              
              {/* ページネーション */}
              {searchResults.total_pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!searchResults.has_prev}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      前へ
                    </button>

                    <span className="px-3 py-2 text-sm font-medium text-gray-700">
                      {currentPage} / {searchResults.total_pages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!searchResults.has_next}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      次へ
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </>
      ) : null}
    </div>
  )
}
