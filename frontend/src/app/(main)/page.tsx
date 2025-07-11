'use client'

import { useRef, useState } from 'react'

export default function Home() {
  const wordRef = useRef<HTMLInputElement>(null)
  const [wordInfo, setWordInfo] = useState<any>(null)
  async function fetchWordInfo(word: string) {
    console.log('Fetching word info for:', word)
    const response = await fetch('/api/words/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch word info')
    }

    setWordInfo(await response.json())
    return response.json()
  }

  async function createWord(wordData: any) {
    console.log('Creating word with data:', wordData)
    const response = await fetch('api/words/word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word_data: wordData }),
    })

    if (!response.ok) {
      throw new Error('Failed to create word')
    }

    return response.json()
  }

  return (
    <>
      <input
        className="border border-gray-300 rounded-md p-2"
        type="text"
        ref={wordRef}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={() => fetchWordInfo(wordRef.current?.value || '')}
      >
        Fetch Word Info
      </button>
      {wordInfo && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Word Information:</h2>
          <pre className="bg-gray-100 p-2 rounded-md">
            {JSON.stringify(wordInfo, null, 2)}
          </pre>
        </div>
      )}

      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={() => createWord(wordInfo || {})}
      >
        Create Word
      </button>
    </>
  )
}
