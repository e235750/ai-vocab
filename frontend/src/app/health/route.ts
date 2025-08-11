export async function GET() {
  return Response.json({
    status: 'healthy',
    message: 'Frontend is running',
    timestamp: new Date().toISOString(),
  })
}
