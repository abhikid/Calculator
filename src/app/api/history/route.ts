import { NextRequest } from 'next/server'
import { getHistory, addHistoryEntry, clearHistory } from '@/lib/db/history'
import { PostHistorySchema } from '@/lib/validators'

export async function GET() {
  try {
    const entries = await getHistory(200)
    return Response.json({ entries })
  } catch (err) {
    console.error('[GET /api/history]', err)
    return Response.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = PostHistorySchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const entry = await addHistoryEntry(parsed.data)
    return Response.json({ entry }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/history]', err)
    return Response.json({ error: 'Failed to save history' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const count = await clearHistory()
    return Response.json({ deleted: count })
  } catch (err) {
    console.error('[DELETE /api/history]', err)
    return Response.json({ error: 'Failed to clear history' }, { status: 500 })
  }
}
