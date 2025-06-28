import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse<string>> {
  const response = await fetch('http://backend:8000')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return NextResponse.json(data)
}
