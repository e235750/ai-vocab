export async function POST(request: Request) {
  const { word } = await request.json()

  if (!word) {
    return new Response(JSON.stringify({ error: 'Word is required' }), {
      status: 400,
    })
  }

  try {
    const response = await fetch(`http://backend:8000/api/words/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word }),
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
