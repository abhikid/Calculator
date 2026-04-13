import { z } from 'zod'

export const CalcModeSchema = z.enum(['standard', 'scientific', 'programmer', 'converter'])
export const AngleUnitSchema = z.enum(['deg', 'rad'])

export const PostHistorySchema = z.object({
  expression: z.string().min(1).max(2000),
  result: z.string().min(1).max(500),
  mode: CalcModeSchema,
  angleUnit: AngleUnitSchema.optional(),
  sessionId: z.string().max(128).optional(),
})

export const PutPreferencesSchema = z.object({
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    angleUnit: AngleUnitSchema.optional(),
    lastMode: CalcModeSchema.optional(),
  }),
})

export const PostFormulaSchema = z.object({
  name: z.string().min(1).max(200),
  expression: z.string().min(1).max(2000),
  description: z.string().max(500).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
})

export const PutFormulaSchema = PostFormulaSchema.partial()
