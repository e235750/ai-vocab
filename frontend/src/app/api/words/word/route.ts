export async function POST(request: Request) {
  const { wordData } = await request.json()
  if (!wordData) {
    return new Response(JSON.stringify({ error: 'Word data is required' }), {
      status: 400,
    })
  }

  try {
    const response = await fetch(`http://backend:8000/api/words/word`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordData),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch word info')
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
