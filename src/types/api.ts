import type { CalcMode, AngleUnit, HistoryEntry, SavedFormula } from './calculator'

// ─── History API ─────────────────────────────────────────────────────────────

export interface PostHistoryRequest {
  expression: string
  result: string
  mode: CalcMode
  angleUnit?: AngleUnit
  sessionId?: string
}

export interface GetHistoryResponse {
  entries: HistoryEntry[]
}

// ─── Preferences API ─────────────────────────────────────────────────────────

export interface PreferencesMap {
  theme: 'light' | 'dark' | 'system'
  angleUnit: AngleUnit
  lastMode: CalcMode
}

export interface GetPreferencesResponse {
  preferences: PreferencesMap
}

export interface PutPreferencesRequest {
  preferences: Partial<PreferencesMap>
}

// ─── Formulas API ────────────────────────────────────────────────────────────

export interface PostFormulaRequest {
  name: string
  expression: string
  description?: string
  tags?: string[]
}

export interface GetFormulasResponse {
  formulas: SavedFormula[]
}

export interface PutFormulaRequest {
  name?: string
  expression?: string
  description?: string
  tags?: string[]
}

// ─── Rates API ───────────────────────────────────────────────────────────────

export interface CurrencyRates {
  base: string
  rates: Record<string, number>
  updatedAt: string
}

export interface GetRatesResponse {
  data: CurrencyRates | null
  error?: string
}

// ─── Generic ─────────────────────────────────────────────────────────────────

export interface ApiError {
  error: string
}
