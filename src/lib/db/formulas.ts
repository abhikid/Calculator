import prisma from '@/lib/prisma'
import type { SavedFormula } from '@/types/calculator'
import type { PostFormulaRequest, PutFormulaRequest } from '@/types/api'

function toSavedFormula(row: {
  id: string
  name: string
  expression: string
  description: string | null
  tags: string | null
  createdAt: Date
  updatedAt: Date
}): SavedFormula {
  return {
    id: row.id,
    name: row.name,
    expression: row.expression,
    description: row.description ?? undefined,
    tags: row.tags ? JSON.parse(row.tags) : [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function getFormulas(): Promise<SavedFormula[]> {
  const rows = await prisma.formula.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(toSavedFormula)
}

export async function createFormula(data: PostFormulaRequest): Promise<SavedFormula> {
  const row = await prisma.formula.create({
    data: {
      name: data.name,
      expression: data.expression,
      description: data.description ?? null,
      tags: data.tags ? JSON.stringify(data.tags) : null,
    },
  })
  return toSavedFormula(row)
}

export async function updateFormula(id: string, data: PutFormulaRequest): Promise<SavedFormula | null> {
  try {
    const row = await prisma.formula.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.expression !== undefined && { expression: data.expression }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.tags !== undefined && { tags: JSON.stringify(data.tags) }),
      },
    })
    return toSavedFormula(row)
  } catch {
    return null
  }
}

export async function deleteFormula(id: string): Promise<boolean> {
  try {
    await prisma.formula.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
