'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDeckStore } from '@/stores/deckStore'
import Loading from '@/components/Loading'
import WordbookHeader from '@/components/wordBook/WordbookHeader'
import WordbookFilters from '@/components/wordBook/WordbookFilters'
import WordbookGrid from '@/components/wordBook/WordbookGrid'
import CreateDeck from '@/components/wordBook/CreateDeck'
import EditDeck from '@/components/wordBook/EditDeck'
import DuplicateDeck from '@/components/wordBook/DuplicateDeck'
import { Deck } from '@/types'

export default function WordbooksPage() {
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my')
  const [searchQuery, setSearchQuery] = useState('')
  const hasInitialized = useRef(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [selectedWordbook, setSelectedWordbook] = useState<Deck | null>(null)

  const { user } = useAuth()

  // useDeckStoreからデータと関数を取得
  const { decks, publicDecks, loading, error, fetchAllDecks, deleteDeck } =
    useDeckStore()

  // 初期データ取得 - 一度だけ実行
  useEffect(() => {
    const loadWordbooks = async () => {
      if (!user || hasInitialized.current) return

      try {
        hasInitialized.current = true
        const idToken = await user.getIdToken()
        await fetchAllDecks(idToken)
      } catch (error) {
        console.error('Failed to fetch wordbooks:', error)
        hasInitialized.current = false // エラー時はリセット
      }
    }

    loadWordbooks()
  }, [user, fetchAllDecks])

  const handleEdit = (wordbook: Deck) => {
    setSelectedWordbook(wordbook)
    setShowEditModal(true)
  }

  const handleDuplicate = async (wordbook: Deck) => {
    setSelectedWordbook(wordbook)
    setShowDuplicateModal(true)
  }

  const handleDelete = async (wordbook: Deck) => {
    try {
      if (!user) return
      const idToken = await user.getIdToken()
      await deleteDeck(wordbook.id, idToken)
      alert('単語帳を削除しました')
    } catch (error) {
      console.error('Failed to delete wordbook:', error)
      alert('単語帳の削除に失敗しました')
    }
  }

  const handleRefresh = async () => {
    if (user) {
      try {
        const idToken = await user.getIdToken()
        await fetchAllDecks(idToken)
      } catch (error) {
        console.error('Failed to refresh wordbooks:', error)
      }
    }
  }

  const handleCreate = () => {
    setShowCreateModal(true)
  }

  const handleModalClose = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowDuplicateModal(false)
    setSelectedWordbook(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96 bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg font-medium mb-2">
            エラーが発生しました
          </div>
          <div className="text-gray-600 dark:text-gray-400 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white dark:text-gray-900 rounded-lg transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 dark:bg-[#202020] min-h-screen">
      <WordbookHeader
        loading={loading}
        onRefresh={handleRefresh}
        onCreate={handleCreate}
      />

      <WordbookFilters
        activeTab={activeTab}
        searchQuery={searchQuery}
        onTabChange={setActiveTab}
        onSearchChange={setSearchQuery}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WordbookGrid
          wordbooks={activeTab === 'my' ? decks : publicDecks}
          activeTab={activeTab}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </div>

      {/* モーダル */}
      {showCreateModal && (
        <CreateDeck isOpen={showCreateModal} onClose={handleModalClose} />
      )}

      {showEditModal && selectedWordbook && (
        <EditDeck
          isOpen={showEditModal}
          deck={selectedWordbook}
          onClose={handleModalClose}
          onUpdate={handleRefresh}
        />
      )}

      {showDuplicateModal && selectedWordbook && (
        <DuplicateDeck
          isOpen={showDuplicateModal}
          sourceDeck={selectedWordbook}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}
