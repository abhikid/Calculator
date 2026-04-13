import prisma from '@/lib/prisma'
import type { HistoryEntry } from '@/types/calculator'
import type { PostHistoryRequest } from '@/types/api'

function toHistoryEntry(row: {
  id: string
  expression: string
  result: string
  mode: string
  angleUnit: string | null
  createdAt: Date
}): HistoryEntry {
  return {
    id: row.id,
    expression: row.expression,
    result: row.result,
    mode: row.mode as HistoryEntry['mode'],
    angleUnit: (row.angleUnit as HistoryEntry['angleUnit']) ?? undefined,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function getHistory(limit = 100): Promise<HistoryEntry[]> {
  const rows = await prisma.historyEntry.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  return rows.map(toHistoryEntry)
}

export async function addHistoryEntry(data: PostHistoryRequest): Promise<HistoryEntry> {
  const row = await prisma.historyEntry.create({
    data: {
      expression: data.expression,
      result: data.result,
      mode: data.mode,
      angleUnit: data.angleUnit ?? null,
      sessionId: data.sessionId ?? null,
    },
  })
  return toHistoryEntry(row)
}

export async function deleteHistoryEntry(id: string): Promise<boolean> {
  try {
    await prisma.historyEntry.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

export async function clearHistory(): Promise<number> {
  const result = await prisma.historyEntry.deleteMany({})
  return result.count
}
