'use server'

export async function createCard(word: string) {
  if (!word) {
    return { error: 'Word is required' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/words/${word}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Failed to create card' }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating card:', error)
    return { error: 'Unknown error occurred' }
  }
}
