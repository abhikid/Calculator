import { deleteHistoryEntry } from '@/lib/db/history'

export async function DELETE(
  _req: Request,
  ctx: RouteContext<'/api/history/[id]'>
) {
  try {
    const { id } = await ctx.params
    const ok = await deleteHistoryEntry(id)
    if (!ok) return Response.json({ error: 'Entry not found' }, { status: 404 })
    return Response.json({ deleted: true })
  } catch (err) {
    console.error('[DELETE /api/history/:id]', err)
    return Response.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
