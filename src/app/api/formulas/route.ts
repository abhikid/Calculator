import { NextRequest } from 'next/server'
import { getFormulas, createFormula } from '@/lib/db/formulas'
import { PostFormulaSchema } from '@/lib/validators'

export async function GET() {
  try {
    const formulas = await getFormulas()
    return Response.json({ formulas })
  } catch (err) {
    console.error('[GET /api/formulas]', err)
    return Response.json({ error: 'Failed to fetch formulas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = PostFormulaSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const formula = await createFormula(parsed.data)
    return Response.json({ formula }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/formulas]', err)
    return Response.json({ error: 'Failed to create formula' }, { status: 500 })
  }
}
