'use server'
import { Bookmark, NewBookmark } from '@/types'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000/api'

// ブックマーク一覧を取得
export const getBookmarks = async (token: string): Promise<Bookmark[]> => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch bookmarks: ${response.status}`)
  }

  return response.json()
}

// ブックマークを追加
export const createBookmark = async (
  data: NewBookmark,
  token: string
): Promise<Bookmark> => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create bookmark: ${response.status}`)
  }

  return response.json()
}

// ブックマークを削除
export const deleteBookmark = async (
  bookmarkId: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/${bookmarkId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete bookmark: ${response.status}`)
  }
}

// カードIDでブックマークを削除
export const deleteBookmarkByCardId = async (
  cardId: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/card/${cardId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete bookmark by card ID: ${response.status}`)
  }
}

// 特定のカードがブックマークされているかチェック
export const checkBookmarkExists = async (
  cardId: string,
  token: string
): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/bookmarks/check/${cardId}/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to check bookmark: ${response.status}`)
  }

  const result = await response.json()
  return result.is_bookmarked
}
