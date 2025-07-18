'use server'

import { NewCard, DeckData } from '@/types'

/**
 * 単語カードをデータベースに追加する関数
 * @param card
 * @param idToken
 * @returns
 */
export async function addCard(card: NewCard, idToken: string) {
  console.log('card:', card)
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
      console.log('Error adding card:', error.message)
      return { error: error.message }
    }
    console.log('Unknown error adding card:', error)
    return { error: 'Unknown error' }
  }
}

/**
 * 単語カードを削除する関数
 * @param cardId
 * @param idToken
 * @returns
 */
// export async function deleteCard(): {}

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
      console.log('Error creating wordbook:', error.message)
      return { error: error.message }
    }
    console.log('Unknown error creating wordbook:', error)
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
      console.log('Error fetching owned wordbooks:', errorData.error)
      return { error: errorData.error || 'Failed to fetch wordbooks' }
    }

    const data = await response.json()
    console.log('Fetched owned wordbooks:', data)
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error fetching owned wordbooks:', error.message)
      return { error: error.message }
    }
    console.log('Unknown error fetching owned wordbooks:', error)
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
      console.log('Error fetching words in wordbook:', errorData.error)
      return { error: errorData.error || 'Failed to fetch words in wordbook' }
    }

    const data = await response.json()
    console.log('Fetched words in wordbook:', data)
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error fetching words in wordbook:', error.message)
      return { error: error.message }
    }
    console.log('Unknown error fetching words in wordbook:', error)
    return { error: 'Unknown error' }
  }
}
