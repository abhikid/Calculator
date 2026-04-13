'use client'

import { create } from 'zustand'
import { calculate, formatNumber } from '@/engine'
import type { CalcMode, AngleUnit, ProgrammerBase } from '@/types/calculator'

interface CalcState {
  // ── Display state ────────────────────────────────────────────────────────
  /** The expression currently being built, shown in the secondary line */
  expression: string
  /** The value displayed in the primary (large) line */
  displayValue: string
  /** The last successfully evaluated number */
  lastResult: number | null
  /** True after = is pressed: next digit starts fresh, but operator continues */
  isResultFinal: boolean
  /** Live preview result while typing (shown dimmed in display) */
  previewValue: string | null

  // ── Mode ─────────────────────────────────────────────────────────────────
  mode: CalcMode
  angleUnit: AngleUnit
  programmerBase: ProgrammerBase

  // ── Actions ──────────────────────────────────────────────────────────────
  appendToken: (token: string) => void
  evaluate: () => { expression: string; result: string } | null
  clear: () => void
  clearEntry: () => void
  backspace: () => void
  toggleSign: () => void
  applyPercent: () => void
  setMode: (mode: CalcMode) => void
  toggleAngleUnit: () => void
  setProgrammerBase: (base: ProgrammerBase) => void
  /** Insert a value (e.g. from memory recall or history) into the display */
  insertValue: (value: string) => void
}

const OPERATORS = new Set(['+', '-', '*', '/', '^', '%'])

function isLastCharOperator(expr: string): boolean {
  const trimmed = expr.trimEnd()
  return OPERATORS.has(trimmed.at(-1) ?? '')
}

function getPreview(expression: string, angleUnit: AngleUnit): string | null {
  if (!expression || expression.length < 2) return null
  const result = calculate(expression, { angleUnit })
  if (result.value !== null && result.display !== expression) {
    return result.display
  }
  return null
}

export const useCalculatorStore = create<CalcState>()((set, get) => ({
  expression: '',
  displayValue: '0',
  lastResult: null,
  isResultFinal: false,
  previewValue: null,
  mode: 'standard',
  angleUnit: 'deg',
  programmerBase: 10,

  appendToken: (token) => {
    set((s) => {
      let expr = s.expression

      // If the last result is final and the user types a digit/paren, start fresh
      if (s.isResultFinal && !OPERATORS.has(token) && token !== ')') {
        expr = ''
      }

      // Prevent double operators
      if (OPERATORS.has(token) && isLastCharOperator(expr)) {
        // Replace the last operator
        expr = expr.trimEnd().slice(0, -1)
      }

      // Prevent leading decimal without 0
      if (token === '.' && (expr === '' || isLastCharOperator(expr))) {
        expr += '0'
      }

      expr += token

      const preview = getPreview(expr, s.angleUnit)

      return {
        expression: expr,
        displayValue: expr || '0',
        isResultFinal: false,
        previewValue: preview,
      }
    })
  },

  evaluate: () => {
    const { expression, angleUnit } = get()
    if (!expression.trim()) return null

    const result = calculate(expression, { angleUnit })

    if (result.value !== null) {
      const display = result.display
      set({
        expression: '',
        displayValue: display,
        lastResult: result.value,
        isResultFinal: true,
        previewValue: null,
      })
      return { expression, result: display }
    } else {
      // Show the error message briefly
      set({
        displayValue: result.error?.message ?? 'Error',
        previewValue: null,
      })
      return null
    }
  },

  clear: () => {
    set({
      expression: '',
      displayValue: '0',
      lastResult: null,
      isResultFinal: false,
      previewValue: null,
    })
  },

  clearEntry: () => {
    set((s) => {
      if (s.isResultFinal) {
        return { expression: '', displayValue: '0', isResultFinal: false, previewValue: null }
      }
      // Remove last token-worth of characters
      // For simplicity: just clear the whole expression (CE behaviour)
      return { expression: '', displayValue: '0', previewValue: null }
    })
  },

  backspace: () => {
    set((s) => {
      if (s.isResultFinal) {
        // Backspace after result clears back to empty
        return { expression: '', displayValue: '0', isResultFinal: false, previewValue: null }
      }
      const expr = s.expression.slice(0, -1)
      const preview = getPreview(expr, s.angleUnit)
      return {
        expression: expr,
        displayValue: expr || '0',
        previewValue: preview,
      }
    })
  },

  toggleSign: () => {
    set((s) => {
      if (s.isResultFinal && s.lastResult !== null) {
        const negated = formatNumber(-s.lastResult)
        return {
          expression: negated,
          displayValue: negated,
          lastResult: -s.lastResult,
          isResultFinal: false,
          previewValue: null,
        }
      }
      const expr = s.expression
      if (!expr) return {}
      // Wrap in negation: "-(...)" or strip existing negation
      const newExpr = expr.startsWith('-(') && expr.endsWith(')')
        ? expr.slice(2, -1)
        : `-(${expr})`
      const preview = getPreview(newExpr, s.angleUnit)
      return { expression: newExpr, displayValue: newExpr, previewValue: preview }
    })
  },

  applyPercent: () => {
    set((s) => {
      const expr = s.expression || (s.lastResult !== null ? String(s.lastResult) : '')
      if (!expr) return {}
      const newExpr = `(${expr})/100`
      const result = calculate(newExpr, { angleUnit: s.angleUnit })
      if (result.value !== null) {
        const preview = getPreview(newExpr, s.angleUnit)
        return { expression: newExpr, displayValue: newExpr, previewValue: preview }
      }
      return {}
    })
  },

  setMode: (mode) => set({ mode }),
  toggleAngleUnit: () =>
    set((s) => ({ angleUnit: s.angleUnit === 'deg' ? 'rad' : 'deg' })),
  setProgrammerBase: (programmerBase) => set({ programmerBase }),

  insertValue: (value) => {
    set({
      expression: value,
      displayValue: value,
      isResultFinal: true,
      previewValue: null,
    })
  },
}))
