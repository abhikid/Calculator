import { NextRequest } from 'next/server'
import { updateFormula, deleteFormula } from '@/lib/db/formulas'
import { PutFormulaSchema } from '@/lib/validators'

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<'/api/formulas/[id]'>
) {
  try {
    const { id } = await ctx.params
    const body = await req.json()
    const parsed = PutFormulaSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const formula = await updateFormula(id, parsed.data)
    if (!formula) return Response.json({ error: 'Formula not found' }, { status: 404 })
    return Response.json({ formula })
  } catch (err) {
    console.error('[PUT /api/formulas/:id]', err)
    return Response.json({ error: 'Failed to update formula' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<'/api/formulas/[id]'>
) {
  try {
    const { id } = await ctx.params
    const ok = await deleteFormula(id)
    if (!ok) return Response.json({ error: 'Formula not found' }, { status: 404 })
    return Response.json({ deleted: true })
  } catch (err) {
    console.error('[DELETE /api/formulas/:id]', err)
    return Response.json({ error: 'Failed to delete formula' }, { status: 500 })
  }
}
