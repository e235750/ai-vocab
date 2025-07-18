import { addCard } from '@/lib/api/db'

export async function POST(request: Request) {
  const { wordData } = await request.json()
  const response = await addCard(wordData)
  return response
}
