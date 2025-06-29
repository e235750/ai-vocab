'use client'
export default function Home() {
  async function fetchWordInfo(word: string) {
    const response = await fetch('/api/word/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch word info')
    }

    return response.json()
  }

  fetchWordInfo('example')
    .then((data) => {
      console.log('Word Info:', data)
    })
    .catch((error) => {
      console.error('Error fetching word info:', error)
    })
  return <></>
}
