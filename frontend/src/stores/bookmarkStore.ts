import { create } from 'zustand'
import { Bookmark } from '@/types'
import * as bookmarksApi from '@/lib/api/bookmarks'
import { getAuth } from 'firebase/auth'
import { getIdToken } from '@/lib/firebase/auth'

interface BookmarkStore {
  bookmarkedCardIds: Set<string>
  bookmarks: Bookmark[]
  loading: boolean
  error: string | null
  isLoaded: boolean // 初期化済みフラグを追加

  // アクション
  loadBookmarks: () => Promise<void>
  toggleBookmark: (cardId: string) => Promise<void>
  checkBookmarkExists: (cardId: string) => Promise<boolean>
  isCardBookmarked: (cardId: string) => boolean
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  bookmarkedCardIds: new Set(),
  bookmarks: [],
  loading: false,
  error: null,
  isLoaded: false, // 初期化済みフラグを初期化

  loadBookmarks: async () => {
    // 既にロード済み、または現在ロード中の場合はスキップ
    if (get().isLoaded || get().loading) {
      return
    }

    try {
      set({ loading: true, error: null })

      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        throw new Error('ユーザーが認証されていません')
      }

      const token = await getIdToken()
      if (!token) return

      const bookmarks = await bookmarksApi.getBookmarks(token)

      const bookmarkedCardIds = new Set(bookmarks.map((b) => b.card_id))

      set({
        bookmarks,
        bookmarkedCardIds,
        loading: false,
        isLoaded: true, // 初期化完了フラグを設定
      })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'ブックマークの読み込みに失敗しました',
        loading: false,
      })
    }
  },

  toggleBookmark: async (cardId: string) => {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        throw new Error('ユーザーが認証されていません')
      }

      const token = await getIdToken()
      if (!token) return

      const { bookmarkedCardIds } = get()

      if (bookmarkedCardIds.has(cardId)) {
        // ブックマークを削除
        await bookmarksApi.deleteBookmarkByCardId(cardId, token)
        const newBookmarkedCardIds = new Set(bookmarkedCardIds)
        newBookmarkedCardIds.delete(cardId)

        set({
          bookmarkedCardIds: newBookmarkedCardIds,
          bookmarks: get().bookmarks.filter((b) => b.card_id !== cardId),
        })
      } else {
        // ブックマークを追加
        const bookmark = await bookmarksApi.createBookmark(
          { card_id: cardId },
          token
        )
        const newBookmarkedCardIds = new Set(bookmarkedCardIds)
        newBookmarkedCardIds.add(cardId)

        set({
          bookmarkedCardIds: newBookmarkedCardIds,
          bookmarks: [...get().bookmarks, bookmark],
        })
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'ブックマークの操作に失敗しました',
      })
    }
  },

  checkBookmarkExists: async (cardId: string) => {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        return false
      }

      const token = await getIdToken()
      if (!token) return false

      return await bookmarksApi.checkBookmarkExists(cardId, token)
    } catch (error) {
      console.error('ブックマーク確認エラー:', error)
      return false
    }
  },

  isCardBookmarked: (cardId: string) => {
    return get().bookmarkedCardIds.has(cardId)
  },
}))
