export async function POST(request: Request) {
  const deckData = await request.json()
  try {
    const response = await fetch('http://backend:8000/api/wordbooks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deckData),
    })

    if (!response.ok) {
      throw new Error('Failed to create wordbook')
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating wordbook:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      })
    }
  }
}
