'use server'
import { NewCard, DeckData, WordBook } from '@/types'

/**
 * 単語カードをデータベースに追加する関数
 * @param card
 * @param idToken
 * @returns
 */
export async function addCard(card: NewCard, idToken: string) {
  if (!card) {
    return { error: 'Word data is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }
  const url = `${process.env.NEXT_PUBLIC_API_URL}/words/`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(card),
    })

    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[addCard] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to add card'
      console.error('[addCard] Error:', errorMsg)
      return { error: errorMsg }
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[addCard] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[addCard] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語カードを削除する関数
 * @param cardId
 * @param idToken
 * @returns
 */
export async function deleteCard(cardId: string, idToken: string) {
  if (!cardId) {
    return { error: 'Card ID is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }
  const url = `${process.env.NEXT_PUBLIC_API_URL}/words/${cardId}/`
  const headers = { Authorization: `Bearer ${idToken}` }

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    })

    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[deleteCard] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to delete card'
      console.error('[deleteCard] Error:', errorMsg)
      return { error: errorMsg }
    }
    return { success: true }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[deleteCard] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[deleteCard] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語帳の単語を取得する関数
 * @param wordbookId
 * @param idToken
 * @returns
 */
export async function getWordsInWordbook(wordbookId: string, idToken: string) {
  if (!wordbookId) {
    return { error: 'Wordbook ID is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }
  const url = `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/${wordbookId}/words/`
  const headers = { Authorization: `Bearer ${idToken}` }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    // レスポンスヘッダーを全て出力
    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[getWordsInWordbook] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg =
        responseBody?.error || 'Failed to fetch words in wordbook'
      console.error('[getWordsInWordbook] Error:', errorMsg)
      // 追加: 401/403時はidTokenの再取得を促す
      if (response.status === 401 || response.status === 403) {
        console.error(
          '[getWordsInWordbook] Auth error: idToken expired or invalid'
        )
      }
      return { error: errorMsg }
    }
    // フロントエンド側でcreated_atによるソートを行う
    if (Array.isArray(responseBody)) {
      const sortedData = responseBody.sort((a, b) => {
        const dateA = new Date(a.created_at)
        const dateB = new Date(b.created_at)
        return dateA.getTime() - dateB.getTime() // 昇順（古い順）
      })
      return sortedData
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[getWordsInWordbook] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[getWordsInWordbook] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語帳をデータベースに追加する関数
 * @param wordbook
 * @param idToken
 * @returns
 */
export async function addWordbook(wordbook: DeckData, idToken: string) {
  if (!wordbook) {
    return { error: 'Wordbook data is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }
  const url = `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(wordbook),
    })

    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[addWordbook] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to create wordbook'
      console.error('[addWordbook] Error:', errorMsg)
      return { error: errorMsg }
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[addWordbook] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[addWordbook] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語帳を更新する関数
 * @param wordbookId
 * @param wordbook
 * @param idToken
 * @returns
 */
export async function updateWordbook(
  wordbookId: string,
  wordbook: DeckData,
  idToken: string
) {
  if (!wordbookId) {
    return { error: 'Wordbook ID is required' }
  }
  if (!wordbook) {
    return { error: 'Wordbook data is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/${wordbookId}/`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(wordbook),
    })

    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[updateWordbook] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to update wordbook'
      console.error('[updateWordbook] Error:', errorMsg)
      return { error: errorMsg }
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[updateWordbook] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[updateWordbook] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語帳を複製する関数
 * @param sourceWordbookId
 * @param wordbook
 * @param idToken
 * @returns
 */
export async function duplicateWordbook(
  sourceWordbookId: string,
  wordbook: DeckData,
  idToken: string
) {
  if (!sourceWordbookId) {
    return { error: 'Source wordbook ID is required' }
  }
  if (!wordbook) {
    return { error: 'Wordbook data is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/${sourceWordbookId}/duplicate/`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(wordbook),
    })

    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[duplicateWordbook] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to duplicate wordbook'
      console.error('[duplicateWordbook] Error:', errorMsg)
      return { error: errorMsg }
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[duplicateWordbook] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[duplicateWordbook] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語帳を削除する関数
 * @param wordbookId
 * @param idToken
 * @returns
 */
export async function deleteWordbook(wordbookId: string, idToken: string) {
  if (!wordbookId) {
    return { error: 'Wordbook ID is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/${wordbookId}/`
  const headers = { Authorization: `Bearer ${idToken}` }

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    })

    if (response.status === 204) {
      return { success: true }
    }

    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[deleteWordbook] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to delete wordbook'
      console.error('[deleteWordbook] Error:', errorMsg)
      return { error: errorMsg }
    }
    return { success: true }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[deleteWordbook] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[deleteWordbook] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語カードを更新する関数
 * @param cardId
 * @param updatedCard
 * @param idToken
 * @returns
 */
export async function updateCard(
  cardId: string,
  updatedCard: NewCard,
  idToken: string
) {
  if (!cardId) {
    return { error: 'Card ID is required' }
  }
  if (!updatedCard) {
    return { error: 'Updated card data is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/words/${cardId}/`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatedCard),
    })

    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[updateCard] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to update card'
      console.error('[updateCard] Error:', errorMsg)
      return { error: errorMsg }
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[updateCard] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[updateCard] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * ユーザの単語帳を取得する関数
 * @param idToken
 * @returns
 */
export async function getOwnedWordbooks(idToken: string) {
  if (!idToken) {
    console.error('[getOwnedWordbooks] No idToken provided')
    return { error: 'User authentication token is required' }
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/`
    const headers = { Authorization: `Bearer ${idToken}` }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[getOwnedWordbooks] Could not parse response as JSON')
    }

    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to fetch wordbooks'
      console.error('[getOwnedWordbooks] Error:', errorMsg)
      return { error: errorMsg }
    }

    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[getOwnedWordbooks] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[getOwnedWordbooks] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 公開単語帳を取得する関数
 * @param idToken
 * @returns
 */
export async function getPublicWordbooks(idToken: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/public/`
  const headers = { Authorization: `Bearer ${idToken}` }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    let responseBody
    try {
      responseBody = await response.clone().json()
    } catch (_e) {
      responseBody = null
      console.warn('[getPublicWordbooks] Could not parse response as JSON')
    }
    if (!response.ok) {
      const errorMsg = responseBody?.error || 'Failed to fetch public wordbooks'
      console.error('[getPublicWordbooks] Error:', errorMsg)
      return { error: errorMsg }
    }
    return responseBody
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[getPublicWordbooks] Fetch error:', error.message, error)
      return { error: error.message }
    }
    console.error('[getPublicWordbooks] Unknown error:', error)
    return { error: 'Unknown error' }
  }
}

// 検索レスポンス用のインターフェース
export interface SearchResponse {
  wordbooks: WordBook[]
  total: number
  page: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
  query: string
}

/**
 * 単語帳を検索する
 * @param queryParams 検索パラメータ
 * @param idToken 認証トークン
 * @returns 検索結果
 */
export async function searchWordbooks(
  queryParams: string,
  idToken: string
): Promise<SearchResponse | { error: string }> {
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/search?${queryParams}/`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Search failed' }
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error searching wordbooks:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error searching wordbooks:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 特定の単語帳を取得する
 * @param id 単語帳ID
 * @param idToken 認証トークン
 * @returns 単語帳データ
 */
export async function getWordbook(
  id: string,
  idToken: string
): Promise<WordBook | { error: string }> {
  if (!id) {
    return { error: 'Wordbook ID is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/${id}/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Failed to fetch wordbook' }
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching wordbook:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error fetching wordbook:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語帳の一覧を取得する
 * @param idToken 認証トークン
 * @returns 単語帳一覧
 */
export async function getWordbooks(
  idToken: string
): Promise<WordBook[] | { error: string }> {
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Failed to fetch wordbooks' }
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching wordbooks:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error fetching wordbooks:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 新しい単語帳を作成する
 * @param data 単語帳データ
 * @param idToken 認証トークン
 * @returns 作成された単語帳
 */
export async function createWordbook(
  data: {
    name: string
    description?: string
    is_public: boolean
  },
  idToken: string
): Promise<WordBook | { error: string }> {
  if (!data) {
    return { error: 'Wordbook data is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Failed to create wordbook' }
    }

    const result = await response.json()
    return result
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating wordbook:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error creating wordbook:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語帳を更新する（新版）
 * @param id 単語帳ID
 * @param data 更新データ
 * @param idToken 認証トークン
 * @returns 更新された単語帳
 */
export async function updateWordbookNew(
  id: string,
  data: {
    name?: string
    description?: string
    is_public?: boolean
  },
  idToken: string
): Promise<WordBook | { error: string }> {
  if (!id) {
    return { error: 'Wordbook ID is required' }
  }
  if (!data) {
    return { error: 'Update data is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/${id}/`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Failed to update wordbook' }
    }

    const result = await response.json()
    return result
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating wordbook:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error updating wordbook:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語帳を削除する（新版）
 * @param id 単語帳ID
 * @param idToken 認証トークン
 * @returns 削除結果
 */
export async function deleteWordbookNew(
  id: string,
  idToken: string
): Promise<{ success: boolean } | { error: string }> {
  if (!id) {
    return { error: 'Wordbook ID is required' }
  }
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/${id}/`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Failed to delete wordbook' }
    }

    return { success: true }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error deleting wordbook:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error deleting wordbook:', error)
    return { error: 'Unknown error' }
  }
}
