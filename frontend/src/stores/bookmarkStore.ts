import { create } from 'zustand'
import { Bookmark } from '@/types'
import * as bookmarksApi from '@/lib/api/bookmarks'
import { getAuth } from 'firebase/auth'

interface BookmarkStore {
  bookmarkedCardIds: Set<string>
  bookmarks: Bookmark[]
  loading: boolean
  error: string | null

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

  loadBookmarks: async () => {
    try {
      set({ loading: true, error: null })

      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        throw new Error('ユーザーが認証されていません')
      }

      const token = await user.getIdToken()
      const bookmarks = await bookmarksApi.getBookmarks(token)

      const bookmarkedCardIds = new Set(bookmarks.map((b) => b.card_id))

      set({
        bookmarks,
        bookmarkedCardIds,
        loading: false,
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

      const token = await user.getIdToken()
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

      const token = await user.getIdToken()
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
