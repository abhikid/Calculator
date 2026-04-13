import prisma from '@/lib/prisma'
import type { PreferencesMap } from '@/types/api'

const DEFAULT_PREFERENCES: PreferencesMap = {
  theme: 'system',
  angleUnit: 'deg',
  lastMode: 'standard',
}

export async function getPreferences(): Promise<PreferencesMap> {
  const rows = await prisma.preference.findMany()
  const map: Partial<PreferencesMap> = {}
  for (const row of rows) {
    try {
      ;(map as Record<string, unknown>)[row.key] = JSON.parse(row.value)
    } catch {
      // ignore malformed values
    }
  }
  return { ...DEFAULT_PREFERENCES, ...map }
}

export async function setPreferences(prefs: Partial<PreferencesMap>): Promise<PreferencesMap> {
  for (const [key, value] of Object.entries(prefs)) {
    await prisma.preference.upsert({
      where: { key },
      create: { key, value: JSON.stringify(value) },
      update: { value: JSON.stringify(value) },
    })
  }
  return getPreferences()
}
