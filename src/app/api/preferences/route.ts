import { NextRequest } from 'next/server'
import { getPreferences, setPreferences } from '@/lib/db/preferences'
import { PutPreferencesSchema } from '@/lib/validators'

export async function GET() {
  try {
    const preferences = await getPreferences()
    return Response.json({ preferences })
  } catch (err) {
    console.error('[GET /api/preferences]', err)
    return Response.json({ error: 'Failed to fetch preferences' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = PutPreferencesSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const preferences = await setPreferences(parsed.data.preferences)
    return Response.json({ preferences })
  } catch (err) {
    console.error('[PUT /api/preferences]', err)
    return Response.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}
