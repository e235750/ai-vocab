'use server'

import { NewCard, DeckData } from '@/types'

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

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/words/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(card),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Failed to fetch word info' }
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error adding card:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error adding card:', error)
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

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/words/${cardId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Failed to delete card' }
    }

    return { success: true }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error deleting card:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error deleting card:', error)
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

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/${wordbookId}/words`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error fetching words in wordbook:', errorData.error)
      return { error: errorData.error || 'Failed to fetch words in wordbook' }
    }

    const data = await response.json()

    // フロントエンド側でcreated_atによるソートを行う
    if (Array.isArray(data)) {
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.created_at)
        const dateB = new Date(b.created_at)
        return dateA.getTime() - dateB.getTime() // 昇順（古い順）
      })
      return sortedData
    }

    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching words in wordbook:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error fetching words in wordbook:', error)
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

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wordbooks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(wordbook),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Failed to create wordbook' }
    }

    const data = await response.json()
    return data
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

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wordbooks/${wordbookId}`,
      {
        method: 'DELETE',
        headers: {
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

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/words/${cardId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(updatedCard),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Failed to update card' }
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating card:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error updating card:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * ユーザの単語帳を取得する関数
 * @param deckId
 * @param idToken
 * @returns
 */
export async function getOwnedWordbooks(idToken: string) {
  if (!idToken) {
    return { error: 'User authentication token is required' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wordbooks`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error fetching owned wordbooks:', errorData.error)
      return { error: errorData.error || 'Failed to fetch wordbooks' }
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching owned wordbooks:', error.message)
      return { error: error.message }
    }
    console.error('Unknown error fetching owned wordbooks:', error)
    return { error: 'Unknown error' }
  }
}
